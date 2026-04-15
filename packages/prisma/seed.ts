import { PrismaClient, Role, OrderStatus, PaymentProvider } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ────────────────────────────────────────────────
  // 1. Users
  // ────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('admin1234', 10);
  const staffPassword = await bcrypt.hash('staff1234', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@eightcoffee.co.th' },
    update: {},
    create: {
      email: 'admin@eightcoffee.co.th',
      name: 'Admin Eight Coffee',
      passwordHash: adminPassword,
      role: Role.ADMIN,
      lineUserId: null,
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'roaster@eightcoffee.co.th' },
    update: {},
    create: {
      email: 'roaster@eightcoffee.co.th',
      name: 'คุณมานะ — Roaster',
      passwordHash: staffPassword,
      role: Role.STAFF,
      lineUserId: null,
    },
  });

  console.log(`✅ Users: ${admin.email}, ${staff.email}`);

  // ────────────────────────────────────────────────
  // 2. Products
  // ────────────────────────────────────────────────
  const productData = [
    {
      slug: 'ethiopia-yirgacheffe-natural',
      nameTh: 'เอธิโอเปีย ยิร์กาเชฟเฟ เนเชอรัล',
      nameEn: 'Ethiopia Yirgacheffe Natural',
      origin: 'Ethiopia',
      farm: 'Kochere Washing Station',
      altitude: '1800-2200',
      process: 'Natural',
      variety: 'Heirloom',
      roastLevel: 'Light',
      degasDays: 10,
      flavorNotes: ['ดอกไม้', 'บลูเบอร์รี่', 'น้ำผึ้ง', 'ไวน์'],
      descTh: 'กลิ่นหอมดอกไม้ชัดเจน มีความหวานของบลูเบอร์รี่และน้ำผึ้ง เปรี้ยวสดชื่นแบบผลไม้เขตร้อน',
      flavorSweet: 4.0, flavorSour: 3.5, flavorBody: 2.0, flavorAroma: 5.0, flavorBitter: 1.0,
      isActive: true,
      variants: [
        { weightGram: 100, retailPrice: 220, wholesalePrice: 180 },
        { weightGram: 250, retailPrice: 520, wholesalePrice: 420 },
        { weightGram: 500, retailPrice: 980, wholesalePrice: 800 },
      ],
    },
    {
      slug: 'colombia-huila-washed',
      nameTh: 'โคลอมเบีย อูอิลา วอช',
      nameEn: 'Colombia Huila Washed',
      origin: 'Colombia',
      farm: 'Finca La Esperanza',
      altitude: '1600-1900',
      process: 'Washed',
      variety: 'Castillo',
      roastLevel: 'Medium',
      degasDays: 7,
      flavorNotes: ['ช็อกโกแลต', 'คาราเมล', 'เฮเซลนัต'],
      descTh: 'บอดี้หนักแน่น หวานแบบคาราเมล มีกลิ่นช็อกโกแลตดาร์ก สมดุลดี',
      flavorSweet: 4.0, flavorSour: 2.0, flavorBody: 4.5, flavorAroma: 3.5, flavorBitter: 2.5,
      isActive: true,
      variants: [
        { weightGram: 250, retailPrice: 450, wholesalePrice: 360 },
        { weightGram: 500, retailPrice: 850, wholesalePrice: 680 },
        { weightGram: 1000, retailPrice: 1600, wholesalePrice: 1280 },
      ],
    },
    {
      slug: 'thailand-doi-chang-honey',
      nameTh: 'ไทย ดอยช้าง ฮันนี่',
      nameEn: 'Thailand Doi Chang Honey',
      origin: 'Thailand',
      farm: 'Doi Chang Village',
      altitude: '1200-1600',
      process: 'Honey',
      variety: 'Typica / Catimor',
      roastLevel: 'Medium Light',
      degasDays: 7,
      flavorNotes: ['น้ำผึ้ง', 'พีช', 'อ้อย'],
      descTh: 'หวานแบบน้ำผึ้ง ความเปรี้ยวต่ำ บอดี้กลางๆ ดื่มง่ายสำหรับทุกคน',
      flavorSweet: 4.5, flavorSour: 1.5, flavorBody: 3.0, flavorAroma: 3.5, flavorBitter: 1.5,
      isActive: true,
      variants: [
        { weightGram: 200, retailPrice: 310, wholesalePrice: 250 },
        { weightGram: 250, retailPrice: 380, wholesalePrice: 300 },
        { weightGram: 500, retailPrice: 720, wholesalePrice: 580 },
      ],
    },
    {
      slug: 'kenya-aa-washed',
      nameTh: 'เคนยา AA วอช',
      nameEn: 'Kenya AA Washed',
      origin: 'Kenya',
      farm: 'Nyeri Cooperative',
      altitude: '1700-2100',
      process: 'Washed',
      variety: 'SL28 / SL34',
      roastLevel: 'Light',
      degasDays: 12,
      flavorNotes: ['แบล็กเคอร์แรนท์', 'มะนาว', 'ดอกไม้'],
      descTh: 'เปรี้ยวสดสไตล์ผลไม้แดง กลิ่นแบล็กเคอร์แรนท์ชัดเจน',
      flavorSweet: 3.0, flavorSour: 5.0, flavorBody: 2.5, flavorAroma: 4.5, flavorBitter: 1.0,
      isActive: true,
      variants: [
        { weightGram: 250, retailPrice: 580, wholesalePrice: 460 },
        { weightGram: 500, retailPrice: 1100, wholesalePrice: 880 },
      ],
    },
    {
      slug: 'myanmar-shan-natural',
      nameTh: 'เมียนมา ฉาน เนเชอรัล',
      nameEn: 'Myanmar Shan Natural',
      origin: 'Myanmar',
      farm: 'Shan Highlands Farm',
      altitude: '1400-1800',
      process: 'Natural',
      variety: 'Bourbon / Typica',
      roastLevel: 'Medium',
      degasDays: 8,
      flavorNotes: ['มะม่วง', 'มะพร้าว', 'ช็อกโกแลต'],
      descTh: 'กลิ่นหอมมะม่วงและมะพร้าวที่เป็นเอกลักษณ์',
      flavorSweet: 4.0, flavorSour: 2.5, flavorBody: 3.5, flavorAroma: 4.0, flavorBitter: 2.0,
      isActive: true,
      variants: [
        { weightGram: 250, retailPrice: 420, wholesalePrice: 340 },
        { weightGram: 500, retailPrice: 800, wholesalePrice: 640 },
      ],
    },
    {
      slug: 'brazil-cerrado-natural',
      nameTh: 'บราซิล เซอร์ราโด เนเชอรัล',
      nameEn: 'Brazil Cerrado Natural',
      origin: 'Brazil',
      farm: 'Fazenda Santa Lucia',
      altitude: '900-1100',
      process: 'Natural',
      variety: 'Yellow Bourbon',
      roastLevel: 'Medium Dark',
      degasDays: 5,
      flavorNotes: ['ช็อกโกแลต', 'ถั่ว', 'คาราเมล'],
      descTh: 'บอดี้หนัก ขมนุ่ม เหมาะเป็น Base สำหรับ Espresso',
      flavorSweet: 3.5, flavorSour: 1.0, flavorBody: 5.0, flavorAroma: 3.0, flavorBitter: 3.5,
      isActive: true,
      variants: [
        { weightGram: 250, retailPrice: 350, wholesalePrice: 280 },
        { weightGram: 500, retailPrice: 660, wholesalePrice: 530 },
        { weightGram: 1000, retailPrice: 1240, wholesalePrice: 990 },
      ],
    },
  ];

  for (const p of productData) {
    const { variants, ...productFields } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...productFields, flavorNotes: p.flavorNotes },
    });

    for (const v of variants) {
      await prisma.productVariant.upsert({
        where: { productId_weightGram: { productId: product.id, weightGram: v.weightGram } },
        update: {},
        create: { productId: product.id, ...v },
      });
    }

    console.log(`✅ Product: ${product.nameTh}`);
  }

  // ────────────────────────────────────────────────
  // 3. Green Bean Inventory
  // ────────────────────────────────────────────────
  const greenBeans = [
    { lotNumber: 'LOT-2025-042', origin: 'Ethiopia Yirgacheffe', process: 'Natural', purchasedKg: 20, remainingKg: 12.8, alertThresholdKg: 5, costPerKg: 620, supplier: 'Kochere Farm', arrivedAt: new Date('2025-03-10') },
    { lotNumber: 'LOT-2025-039', origin: 'Colombia Huila', process: 'Washed', purchasedKg: 30, remainingKg: 18.5, alertThresholdKg: 5, costPerKg: 480, supplier: 'Finca La Esperanza', arrivedAt: new Date('2025-02-28') },
    { lotNumber: 'LOT-2025-041', origin: 'Thailand Doi Chang', process: 'Honey', purchasedKg: 25, remainingKg: 14.2, alertThresholdKg: 5, costPerKg: 350, supplier: 'Doi Chang Village', arrivedAt: new Date('2025-03-05') },
    { lotNumber: 'LOT-2025-044', origin: 'Kenya AA', process: 'Washed', purchasedKg: 10, remainingKg: 3.5, alertThresholdKg: 5, costPerKg: 780, supplier: 'Nyeri Cooperative', arrivedAt: new Date('2025-03-20') },
    { lotNumber: 'LOT-2025-040', origin: 'Myanmar Shan', process: 'Natural', purchasedKg: 15, remainingKg: 1.8, alertThresholdKg: 3, costPerKg: 420, supplier: 'Shan Highlands', arrivedAt: new Date('2025-03-01') },
    { lotNumber: 'LOT-2025-038', origin: 'Brazil Cerrado', process: 'Natural', purchasedKg: 50, remainingKg: 28.3, alertThresholdKg: 10, costPerKg: 280, supplier: 'Fazenda Santa Lucia', arrivedAt: new Date('2025-02-15') },
  ];

  for (const gb of greenBeans) {
    await prisma.greenBeanInventory.upsert({
      where: { lotNumber: gb.lotNumber },
      update: {},
      create: gb,
    });
  }
  console.log(`✅ Green Bean Inventory: ${greenBeans.length} lots`);

  // ────────────────────────────────────────────────
  // 4. System Config
  // ────────────────────────────────────────────────
  const configs = [
    { key: 'SHIPPING_PROVIDER', value: 'flash_express', description: 'Logistics provider (flash_express | mock)' },
    { key: 'FREE_SHIPPING_THRESHOLD_THB', value: '500', description: 'Order total for free shipping' },
    { key: 'DEFAULT_SHIPPING_FEE_THB', value: '50', description: 'Flat shipping fee when below threshold' },
    { key: 'LOW_STOCK_ALERT_ENABLED', value: 'true', description: 'Send LINE notification on low stock' },
    { key: 'PAYMENT_PROVIDER', value: 'mock', description: 'Payment provider (mock | gbprimepay)' },
    { key: 'STORE_NAME_TH', value: 'Eight Coffee Roasters', description: 'Store display name (TH)' },
    { key: 'STORE_LINE_OA', value: '@eightcoffee', description: 'LINE OA handle' },
  ];

  for (const c of configs) {
    await prisma.systemConfig.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }
  console.log(`✅ SystemConfig: ${configs.length} entries`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('──────────────────────────────────');
  console.log('Admin: admin@eightcoffee.co.th / admin1234');
  console.log('Staff: roaster@eightcoffee.co.th / staff1234');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
