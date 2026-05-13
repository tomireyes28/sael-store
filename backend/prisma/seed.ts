import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

// 1. Forzamos a que lea tu archivo .env para encontrar la DATABASE_URL
config();

// 2. Le pasamos el mismo adaptador que configuramos ayer en el PrismaService
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando el sembrado de datos...');

  // Encriptamos la contraseña "123456"
  const hashedPassword = await bcrypt.hash('123456', 10);

  // IMPORTANTE: Fijate si tu modelo en schema.prisma se llama adminUser, userAdmin o UserAdmin
  // Si te tira error acá, es solo cambiar el nombre de esa propiedad.
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@sael.com' },
    update: {},
    create: {
      email: 'admin@sael.com',
      password: hashedPassword,
    },
  });

  console.log(`✅ Administrador creado con éxito: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error('Error al crear el admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });