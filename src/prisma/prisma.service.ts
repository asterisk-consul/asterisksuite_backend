// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { SshService } from '../ssh/ssh.service';
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private readonly sshService: SshService) {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  async onModuleInit() {
    // 🔴 ESPERA AL TÚNEL
    await this.sshService.waitUntilReady();

    // 🔴 RECIÉN AHORA conecta Prisma
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
