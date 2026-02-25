// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
//import { TableModule } from './tables/table.module';
import { DataImportModule } from './data-import/data-import.module.js';
import { LogisticaModule } from './logistica/logistica.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    //TableModule,
    DataImportModule,
    LogisticaModule,
  ],
})
export class AppModule {}
