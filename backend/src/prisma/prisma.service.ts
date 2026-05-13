import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // Si process.env.DATABASE_URL llega vacío por culpa de Node, usamos la tuya directamente para que no falle.
    const dbUrl = process.env.DATABASE_URL || "postgresql://sael_user:sael_password@localhost:5444/sael_db?schema=public";
    
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}