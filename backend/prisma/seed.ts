import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

// Conexión con el adaptador para evitar problemas de inicialización
const dbUrl = "postgresql://sael_user:sael_password@localhost:5444/sael_db?schema=public";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando el sembrado de datos en SAEL...');

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
  console.log('✅ Administrador verificado (admin@sael.com).');

  // 2. Limpiar datos anteriores (el orden respeta las relaciones de la DB)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // 3. Crear Categorías Reales
  const lpf = await prisma.category.create({ data: { name: 'Liga Profesional', slug: 'liga-profesional' } });
  const premier = await prisma.category.create({ data: { name: 'Premier League', slug: 'premier-league' } });
  const selecciones = await prisma.category.create({ data: { name: 'Selecciones', slug: 'selecciones' } });
  console.log('✅ Categorías creadas.');

  // 4. Datos de Productos
  const productsData = [
    {
      name: 'Camiseta Boca Juniors Titular 2024',
      slug: 'camiseta-boca-titular-2024',
      description: 'La piel del xeneize, versión jugador con tecnología de ventilación avanzada.',
      price: 55000,
      categoryId: lpf.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1/boca_titular.jpg'],
    },
    {
      name: 'Camiseta River Plate Titular 2024',
      slug: 'camiseta-river-titular-2024',
      description: 'La icónica banda roja cruzada. Tela liviana ideal para alto rendimiento.',
      price: 55000,
      categoryId: lpf.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1/river_titular.jpg'],
    },
    {
      name: 'Camiseta Manchester City Local 23/24',
      slug: 'camiseta-manchester-city-local-23-24',
      description: 'Celeste ciudadano con detalles sutiles en el cuello. Ajuste perfecto.',
      price: 65000,
      categoryId: premier.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1/city_local.jpg'],
    },
    {
      name: 'Camiseta Argentina Titular 3 Estrellas',
      slug: 'camiseta-argentina-titular-3-estrellas',
      description: 'La camiseta de los campeones del mundo. Parche oficial en el centro.',
      price: 75000,
      categoryId: selecciones.id,
      images: ['https://res.cloudinary.com/demo/image/upload/v1/argentina_titular.jpg'],
    }
  ];

  // Insertar Productos y sus Variantes
  for (const prod of productsData) {
    await prisma.product.create({
      data: {
        ...prod,
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
    console.log(`👕 Producto insertado: ${prod.name}`);
  }

  // 5. Crear Pedidos de Prueba
  console.log('📦 Generando pedidos de prueba...');
  
  // Obtenemos variantes recién creadas para asociarlas a los pedidos
  const variantes = await prisma.productVariant.findMany({
    include: { product: true }
  });

  if (variantes.length >= 2) {
    // Pedido 1: Pagado
    await prisma.order.create({
      data: {
        customerName: 'Lionel Messi',
        customerEmail: 'liomessi@sael.com',
        customerPhone: '1122334455',
        shippingAddress: 'Av. Siempre Viva 123',
        shippingZip: '1001',
        shippingCost: 5000,
        totalAmount: variantes[0].product.price + 5000,
        status: 'PAID',
        items: {
          create: [
            {
              variantId: variantes[0].id,
              quantity: 1,
              price: variantes[0].product.price
            }
          ]
        }
      }
    });

    // Pedido 2: Pendiente
    await prisma.order.create({
      data: {
        customerName: 'Julian Alvarez',
        customerEmail: 'arana@sael.com',
        customerPhone: '1199887766',
        shippingAddress: 'Paseo de la Castellana 456',
        shippingZip: '28046',
        shippingCost: 4500,
        totalAmount: (variantes[1].product.price * 2) + 4500,
        status: 'PENDING',
        items: {
          create: [
            {
              variantId: variantes[1].id,
              quantity: 2,
              price: variantes[1].product.price
            }
          ]
        }
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