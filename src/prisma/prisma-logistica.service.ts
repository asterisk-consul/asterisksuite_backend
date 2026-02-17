// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma-logistica/client';

@Injectable()
export class LogisticaPrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_LOGISTICA_URL;
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    // 🔴 RECIÉN AHORA conecta Prisma
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
