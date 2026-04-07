// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DataImportModule } from './data-import/data-import.module';
import { modulesmodule } from './modules/modules.module';
import { DocumentTypesModule } from './modules/erp/erp.modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DataImportModule,
    modulesmodule,
    DocumentTypesModule,
  ],
})
export class AppModule {}
