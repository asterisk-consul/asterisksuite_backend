// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'src/generated/prisma/client';
import { SshService } from 'src/ssh/ssh.service';

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
    // 🔴 1. Levanta el túnel (await bloquea hasta que está listo)
    await this.sshService.createSSHTunnel(5433); // o el puerto local que uses

    // 🔴 2. Recién ahora conecta Prisma
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
