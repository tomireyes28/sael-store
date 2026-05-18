import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const dbUrl = "postgresql://sael_user:sael_password@localhost:5444/sael_db?schema=public";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando el sembrado masivo de datos en SAEL...');

  // 1. Crear / Verificar Admin
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@sael.com' },
    update: {},
    create: {
      email: 'admin@sael.com',
      password: hashedPassword,
    },
  });
  console.log('✅ Administrador verificado.');

  // 2. Limpiar datos anteriores
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 3. Crear Categorías Reales (Coinciden con el Frontend)
  const selecciones = await prisma.category.create({ data: { name: 'Selecciones', slug: 'selecciones' } });
  const lpf = await prisma.category.create({ data: { name: 'Liga Argentina', slug: 'liga-argentina' } });
  const premier = await prisma.category.create({ data: { name: 'Premier League', slug: 'premier-league' } });
  const laLiga = await prisma.category.create({ data: { name: 'Liga Española', slug: 'la-liga' } });
  const serieA = await prisma.category.create({ data: { name: 'Serie A', slug: 'serie-a' } });
  const brasileirao = await prisma.category.create({ data: { name: 'Brasileirao', slug: 'brasileirao' } });
  const retro = await prisma.category.create({ data: { name: 'Retro', slug: 'retro' } });
  
  console.log('✅ Categorías creadas.');

  // Imágenes genéricas de alta calidad de Unsplash para indumentaria/fútbol
  const imgFutbol = ['https://images.unsplash.com/photo-1589487391730-58f20eb2c308?auto=format&fit=crop&q=80&w=800'];
  const imgRopa1 = ['https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=800'];
  const imgRopa2 = ['https://images.unsplash.com/photo-1578587018452-892bace94f12?auto=format&fit=crop&q=80&w=800'];
  const imgRetro = ['https://images.unsplash.com/photo-1550985223-9366eec6a9bf?auto=format&fit=crop&q=80&w=800'];

  // 4. Datos de Productos (30 productos)
  const productsData = [
    // SELECCIONES
    { name: 'Argentina Titular 2024', slug: 'arg-titular-24', price: 75000, categoryId: selecciones.id, images: imgFutbol },
    { name: 'Argentina Suplente 2024', slug: 'arg-suplente-24', price: 75000, categoryId: selecciones.id, images: imgRopa1 },
    { name: 'Brasil Titular 2024', slug: 'bra-titular-24', price: 70000, categoryId: selecciones.id, images: imgRopa2 },
    { name: 'Francia Titular 2024', slug: 'fra-titular-24', price: 72000, categoryId: selecciones.id, images: imgFutbol },
    { name: 'Inglaterra Suplente 2024', slug: 'ing-suplente-24', price: 70000, categoryId: selecciones.id, images: imgRopa1 },
    
    // LIGA ARGENTINA
    { name: 'Boca Juniors Titular 2024', slug: 'boca-titular-24', price: 55000, categoryId: lpf.id, images: imgFutbol },
    { name: 'Boca Juniors Alternativa 2024', slug: 'boca-alt-24', price: 55000, categoryId: lpf.id, images: imgRopa2 },
    { name: 'River Plate Titular 2024', slug: 'river-titular-24', price: 55000, categoryId: lpf.id, images: imgRopa1 },
    { name: 'River Plate Suplente 2024', slug: 'river-sup-24', price: 55000, categoryId: lpf.id, images: imgFutbol },
    { name: 'Racing Club Titular 2024', slug: 'racing-titular-24', price: 50000, categoryId: lpf.id, images: imgRopa2 },
    { name: 'Independiente Titular 2024', slug: 'cai-titular-24', price: 50000, categoryId: lpf.id, images: imgRopa1 },
    
    // PREMIER LEAGUE
    { name: 'Manchester City Local 23/24', slug: 'city-local-24', price: 65000, categoryId: premier.id, images: imgFutbol },
    { name: 'Arsenal Local 23/24', slug: 'arsenal-local-24', price: 65000, categoryId: premier.id, images: imgRopa1 },
    { name: 'Liverpool Local 23/24', slug: 'liverpool-local-24', price: 65000, categoryId: premier.id, images: imgRopa2 },
    { name: 'Manchester Utd Visita 23/24', slug: 'utd-visita-24', price: 65000, categoryId: premier.id, images: imgFutbol },
    { name: 'Chelsea Local 23/24', slug: 'chelsea-local-24', price: 65000, categoryId: premier.id, images: imgRopa1 },
    
    // LIGA ESPAÑOLA
    { name: 'Real Madrid Local 23/24', slug: 'rma-local-24', price: 65000, categoryId: laLiga.id, images: imgFutbol },
    { name: 'Barcelona Local 23/24', slug: 'barca-local-24', price: 65000, categoryId: laLiga.id, images: imgRopa1 },
    { name: 'Atletico Madrid Local 23/24', slug: 'atletico-local-24', price: 60000, categoryId: laLiga.id, images: imgRopa2 },
    { name: 'Real Madrid Visita 23/24', slug: 'rma-visita-24', price: 65000, categoryId: laLiga.id, images: imgFutbol },
    
    // SERIE A
    { name: 'Juventus Local 23/24', slug: 'juve-local-24', price: 62000, categoryId: serieA.id, images: imgRopa1 },
    { name: 'Milan Local 23/24', slug: 'milan-local-24', price: 62000, categoryId: serieA.id, images: imgFutbol },
    { name: 'Inter Local 23/24', slug: 'inter-local-24', price: 62000, categoryId: serieA.id, images: imgRopa2 },
    { name: 'Napoli Local 23/24', slug: 'napoli-local-24', price: 60000, categoryId: serieA.id, images: imgFutbol },
    
    // BRASILEIRAO
    { name: 'Flamengo Local 2024', slug: 'fla-local-24', price: 50000, categoryId: brasileirao.id, images: imgRopa1 },
    { name: 'Palmeiras Local 2024', slug: 'palmeiras-local-24', price: 50000, categoryId: brasileirao.id, images: imgFutbol },
    { name: 'Sao Paulo Local 2024', slug: 'sao-paulo-local-24', price: 50000, categoryId: brasileirao.id, images: imgRopa2 },
    
    // RETRO
    { name: 'Argentina 1986 Titular', slug: 'arg-1986', price: 85000, categoryId: retro.id, images: imgRetro },
    { name: 'Boca Juniors 2000 Titular', slug: 'boca-2000', price: 80000, categoryId: retro.id, images: imgRetro },
    { name: 'Napoli 1987 Titular', slug: 'napoli-1987', price: 85000, categoryId: retro.id, images: imgRetro },
  ];

  // Insertar Productos y sus Variantes
  for (const prod of productsData) {
    await prisma.product.create({
      data: {
        name: prod.name,
        slug: prod.slug,
        description: 'Versión importada de alta calidad. Tela premium con tecnología de ventilación.',
        price: prod.price,
        categoryId: prod.categoryId,
        images: prod.images,
        variants: {
          create: [
            { size: 'S', stock: 15 },
            { size: 'M', stock: 20 },
            { size: 'L', stock: 10 },
            { size: 'XL', stock: 5 },
          ]
        }
      }
    });
  }
  console.log(`✅ ${productsData.length} Productos insertados con éxito.`);

  // 5. Crear Pedidos de Prueba
  console.log('📦 Generando pedidos de prueba...');
  const variantes = await prisma.productVariant.findMany({ include: { product: true } });

  if (variantes.length >= 2) {
    await prisma.order.create({
      data: {
        customerName: 'Lionel Messi', customerEmail: 'liomessi@sael.com', customerPhone: '1122334455',
        shippingAddress: 'Av. Siempre Viva 123', shippingZip: '1001', shippingCost: 5000,
        totalAmount: variantes[0].product.price + 5000, status: 'PAID',
        items: { create: [{ variantId: variantes[0].id, quantity: 1, price: variantes[0].product.price }] }
      }
    });

    await prisma.order.create({
      data: {
        customerName: 'Julian Alvarez', customerEmail: 'arana@sael.com', customerPhone: '1199887766',
        shippingAddress: 'Paseo de la Castellana 456', shippingZip: '28046', shippingCost: 4500,
        totalAmount: (variantes[1].product.price * 2) + 4500, status: 'PENDING',
        items: { create: [{ variantId: variantes[1].id, quantity: 2, price: variantes[1].product.price }] }
      }
    });
    console.log('✅ Pedidos de prueba creados.');
  }

  console.log('✨ ¡Base de datos poblada con éxito!');
}

main()
  .catch((e) => {
    console.error('Error durante el sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });