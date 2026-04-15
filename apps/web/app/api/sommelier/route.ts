import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const { query, products } = await req.json();

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ error: 'Query too short' }, { status: 400 });
  }

  try {
    // Step 1: Embed the query with Gemini text-embedding-004
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const queryEmbedResult = await embeddingModel.embedContent(query);
    const queryVector = queryEmbedResult.embedding.values;

    // Step 2: Compute cosine similarity with product embeddings
    // (In production, this would be a pgvector query via NestJS API)
    // For products without pre-computed embeddings, fall back to keyword search
    const scoredProducts = await Promise.all(
      products.map(async (product: any) => {
        // If product has embedding, use cosine similarity
        if (product.embedding) {
          const similarity = cosineSimilarity(queryVector, product.embedding);
          return { ...product, similarity };
        }
        // Fallback: simple text match score
        const text = `${product.origin} ${JSON.stringify(product.flavorNotes)} ${product.nameTh} ${product.nameEn}`.toLowerCase();
        const words = query.toLowerCase().split(/\s+/);
        const matchScore = words.filter((w: string) => text.includes(w)).length / words.length;
        return { ...product, similarity: matchScore };
      }),
    );

    // Sort by similarity descending
    const ranked = scoredProducts
      .filter((p) => p.similarity > 0.1)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Step 3: Generate conversational recommendation with Gemini Flash
    let recommendation = '';
    if (ranked.length > 0) {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `คุณคือ Coffee Sommelier ของ Eight Coffee Roasters 
ลูกค้าถามว่า: "${query}"
สินค้าที่ตรงที่สุด: ${ranked.slice(0, 3).map((p) => `${p.nameTh} (${p.origin}, ${JSON.stringify(p.flavorNotes)})`).join(', ')}
กรุณาแนะนำในภาษาไทยสั้นๆ 2-3 ประโยค ว่าทำไมสินค้าเหล่านี้เหมาะกับความต้องการของลูกค้า`;

      const result = await model.generateContent(prompt);
      recommendation = result.response.text();
    }

    return NextResponse.json({ products: ranked, recommendation });
  } catch (error: any) {
    console.error('AI Sommelier error:', error.message);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
  }
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}
