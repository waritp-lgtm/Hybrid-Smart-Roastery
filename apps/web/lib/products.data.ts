// Shared product mock data — replace with API fetch when backend ready

export interface Product {
  id: string;
  slug: string;
  nameTh: string;
  nameEn: string;
  origin: string;
  farm: string;
  altitude: string;
  process: string;
  variety: string;
  roastLevel: 'Light' | 'Medium Light' | 'Medium' | 'Medium Dark' | 'Dark';
  roastLevelTh: string;
  tagsTh: string[];
  descTh: string;
  descEn: string;
  flavorScores: { sweet: number; sour: number; body: number; aroma: number; bitter: number };
  brewGuide: { method: string; ratio: string; temp: string; grind: string; time: string }[];
  variants: { weightGram: number; retailPrice: number; wholesalePrice: number }[];
  degasDays: number;
  isNew: boolean;
  inStock: boolean;
  badge?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'p001', slug: 'ethiopia-yirgacheffe-natural',
    nameTh: 'เอธิโอเปีย ยิร์กาเชฟเฟ เนเชอรัล',
    nameEn: 'Ethiopia Yirgacheffe Natural',
    origin: 'Ethiopia', farm: 'Kochere Washing Station',
    altitude: '1,800–2,200 masl', process: 'Natural', variety: 'Heirloom',
    roastLevel: 'Light', roastLevelTh: 'คั่วอ่อน',
    tagsTh: ['ดอกไม้', 'บลูเบอร์รี่', 'ไวน์', 'น้ำผึ้ง'],
    descTh: 'กลิ่นหอมดอกไม้ชัดเจน มีความหวานของบลูเบอร์รี่และน้ำผึ้ง เปรี้ยวสดชื่นแบบผลไม้เขตร้อน เหมาะสำหรับการดริปและ Pour Over',
    descEn: 'Vibrant floral aroma with blueberry sweetness and honey-like finish. Best enjoyed as pour over.',
    flavorScores: { sweet: 4, sour: 3.5, body: 2, aroma: 5, bitter: 1 },
    brewGuide: [
      { method: 'Pour Over', ratio: '1:15', temp: '90°C', grind: 'Medium Fine', time: '3:00–3:30' },
      { method: 'Cold Brew', ratio: '1:8', temp: 'Cold', grind: 'Coarse', time: '12–16h' },
    ],
    variants: [
      { weightGram: 100, retailPrice: 220, wholesalePrice: 180 },
      { weightGram: 250, retailPrice: 520, wholesalePrice: 420 },
      { weightGram: 500, retailPrice: 980, wholesalePrice: 800 },
    ],
    degasDays: 10, isNew: true, inStock: true, badge: 'New Arrival',
  },
  {
    id: 'p002', slug: 'colombia-huila-washed',
    nameTh: 'โคลอมเบีย อูอิลา วอช',
    nameEn: 'Colombia Huila Washed',
    origin: 'Colombia', farm: 'Finca La Esperanza',
    altitude: '1,600–1,900 masl', process: 'Washed', variety: 'Castillo',
    roastLevel: 'Medium', roastLevelTh: 'คั่วกลาง',
    tagsTh: ['ช็อกโกแลต', 'คาราเมล', 'เฮเซลนัต', 'ผลไม้แห้ง'],
    descTh: 'บอดี้หนักแน่น หวานแบบคาราเมล มีกลิ่นช็อกโกแลตดาร์กและเฮเซลนัต สมดุลดี เหมาะกับทุกวิธีการชง',
    descEn: 'Full body with caramel sweetness, dark chocolate, and hazelnut. Versatile for any brewing method.',
    flavorScores: { sweet: 4, sour: 2, body: 4.5, aroma: 3.5, bitter: 2.5 },
    brewGuide: [
      { method: 'Drip', ratio: '1:14', temp: '94°C', grind: 'Medium', time: '4:00–4:30' },
      { method: 'Espresso', ratio: '1:2', temp: '93°C', grind: 'Fine', time: '25–30s' },
    ],
    variants: [
      { weightGram: 250, retailPrice: 450, wholesalePrice: 360 },
      { weightGram: 500, retailPrice: 850, wholesalePrice: 680 },
      { weightGram: 1000, retailPrice: 1600, wholesalePrice: 1280 },
    ],
    degasDays: 7, isNew: false, inStock: true, badge: 'Best Seller',
  },
  {
    id: 'p003', slug: 'thailand-doi-chang-honey',
    nameTh: 'ไทย ดอยช้าง ฮันนี่',
    nameEn: 'Thailand Doi Chang Honey',
    origin: 'Thailand', farm: 'Doi Chang Village',
    altitude: '1,200–1,600 masl', process: 'Honey', variety: 'Typica / Catimor',
    roastLevel: 'Medium Light', roastLevelTh: 'คั่วกลาง-อ่อน',
    tagsTh: ['น้ำผึ้ง', 'พีช', 'อ้อย', 'แมคคาเดเมีย'],
    descTh: 'หวานแบบน้ำผึ้งและน้ำอ้อย มีกลิ่นพีชและแมคคาเดเมียนุ่มๆ ความเปรี้ยวต่ำ บอดี้กลางๆ ดื่มง่ายสำหรับทุกคน',
    descEn: 'Sweet honey and sugarcane flavor with soft peach and macadamia notes. Low acidity, easy to enjoy.',
    flavorScores: { sweet: 4.5, sour: 1.5, body: 3, aroma: 3.5, bitter: 1.5 },
    brewGuide: [
      { method: 'Pour Over', ratio: '1:15', temp: '92°C', grind: 'Medium', time: '3:00' },
      { method: 'AeroPress', ratio: '1:12', temp: '85°C', grind: 'Medium Fine', time: '1:30' },
    ],
    variants: [
      { weightGram: 200, retailPrice: 310, wholesalePrice: 250 },
      { weightGram: 250, retailPrice: 380, wholesalePrice: 300 },
      { weightGram: 500, retailPrice: 720, wholesalePrice: 580 },
    ],
    degasDays: 7, isNew: false, inStock: true, badge: 'Local Hero',
  },
  {
    id: 'p004', slug: 'kenya-aa-washed',
    nameTh: 'เคนยา AA วอช',
    nameEn: 'Kenya AA Washed',
    origin: 'Kenya', farm: 'Nyeri Cooperative',
    altitude: '1,700–2,100 masl', process: 'Washed', variety: 'SL28 / SL34',
    roastLevel: 'Light', roastLevelTh: 'คั่วอ่อน',
    tagsTh: ['แบล็กเคอร์แรนท์', 'มะเขือเทศ', 'มะนาว', 'กลิ่นดอกไม้'],
    descTh: 'เปรี้ยวสดสไตล์ผลไม้แดง มีความซับซ้อนสูง กลิ่นแบล็กเคอร์แรนท์และมะเขือเทศชัดเจน เหมาะสำหรับผู้ที่ชอบกาแฟเปรี้ยวสดชื่น',
    descEn: 'Bright berry acidity, complex cup with blackcurrant, tomato, and citrus finish.',
    flavorScores: { sweet: 3, sour: 5, body: 2.5, aroma: 4.5, bitter: 1 },
    brewGuide: [
      { method: 'Pour Over', ratio: '1:16', temp: '88°C', grind: 'Medium Fine', time: '3:30' },
    ],
    variants: [
      { weightGram: 250, retailPrice: 580, wholesalePrice: 460 },
      { weightGram: 500, retailPrice: 1100, wholesalePrice: 880 },
    ],
    degasDays: 12, isNew: true, inStock: true,
  },
  {
    id: 'p005', slug: 'myanmar-shan-natural',
    nameTh: 'เมียนมา ฉาน เนเชอรัล',
    nameEn: 'Myanmar Shan Natural',
    origin: 'Myanmar', farm: 'Shan Highlands Farm',
    altitude: '1,400–1,800 masl', process: 'Natural', variety: 'Bourbon / Typica',
    roastLevel: 'Medium', roastLevelTh: 'คั่วกลาง',
    tagsTh: ['มะม่วง', 'มะพร้าว', 'ช็อกโกแลต', 'ดอกไม้'],
    descTh: 'กาแฟจากพื้นที่ชายแดนไทย-เมียนมา มีกลิ่นหอมมะม่วงและมะพร้าวที่เป็นเอกลักษณ์ ตัวเลือกที่น่าสนใจสำหรับนักสะสม',
    descEn: 'Unique tropical profile with mango and coconut sweetness. A collector\'s choice from Shan State.',
    flavorScores: { sweet: 4, sour: 2.5, body: 3.5, aroma: 4, bitter: 2 },
    brewGuide: [
      { method: 'Pour Over', ratio: '1:15', temp: '91°C', grind: 'Medium', time: '3:15' },
    ],
    variants: [
      { weightGram: 250, retailPrice: 420, wholesalePrice: 340 },
      { weightGram: 500, retailPrice: 800, wholesalePrice: 640 },
    ],
    degasDays: 8, isNew: false, inStock: true,
  },
  {
    id: 'p006', slug: 'brazil-cerrado-natural',
    nameTh: 'บราซิล เซอร์ราโด เนเชอรัล',
    nameEn: 'Brazil Cerrado Natural',
    origin: 'Brazil', farm: 'Fazenda Santa Lucia',
    altitude: '900–1,100 masl', process: 'Natural', variety: 'Yellow Bourbon',
    roastLevel: 'Medium Dark', roastLevelTh: 'คั่วกลาง-เข้ม',
    tagsTh: ['ช็อกโกแลต', 'ถั่ว', 'คาราเมล', 'เชอร์รี่'],
    descTh: 'บอดี้หนัก ขมนุ่ม มีกลิ่นช็อกโกแลตและถั่วที่ชัดเจน เหมาะเป็น Base สำหรับทำ Espresso และนม',
    descEn: 'Heavy body, smooth bitterness, chocolate and nut aroma. Ideal espresso base.',
    flavorScores: { sweet: 3.5, sour: 1, body: 5, aroma: 3, bitter: 3.5 },
    brewGuide: [
      { method: 'Espresso', ratio: '1:2.5', temp: '94°C', grind: 'Fine', time: '25–28s' },
      { method: 'Moka Pot', ratio: '1:4', temp: 'Brew', grind: 'Medium Fine', time: '5:00' },
    ],
    variants: [
      { weightGram: 250, retailPrice: 350, wholesalePrice: 280 },
      { weightGram: 500, retailPrice: 660, wholesalePrice: 530 },
      { weightGram: 1000, retailPrice: 1240, wholesalePrice: 990 },
    ],
    degasDays: 5, isNew: false, inStock: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
