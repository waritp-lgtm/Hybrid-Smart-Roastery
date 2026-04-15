import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { sku: string } },
) {
  const { sku } = params;

  // Fetch product + roasted batch info from NestJS API
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/sku/${sku}`,
    { next: { revalidate: 3600 } }, // Cache 1 hour
  );

  if (!res.ok) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  const product = await res.json();
  return NextResponse.json(product);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { sku: string } },
) {
  // Submit taste rating from QR scan
  const body = await req.json();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/reviews`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...body,
        productSku: params.sku,
        source: 'qr',
      }),
    },
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
