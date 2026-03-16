// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DataImportModule } from './data-import/data-import.module';
import { LogisticaModule } from './logistica/logistica.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DataImportModule,
    LogisticaModule,
  ],
})
export class AppModule {}
