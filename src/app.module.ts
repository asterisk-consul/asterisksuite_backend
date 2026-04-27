// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DataImportModule } from './data-import/data-import.module';
import { modulesmodule } from './modules/modules.module';
import { DocumentsTypesErpModule } from './modules/erp/document_types/documents-types.module';
import { DocumentsTypesModule } from './modules/master-data/documents-types/documents-types.module';
import { TaxesModule } from './modules/erp/taxes/taxes.module';
import { DocumentsModule } from './modules/erp/documents/documents.module';
import { PurchasesModule } from './modules/erp/purchase/purchases.module';
import { ReporteChoferesModule } from './modules/logistica/reports/drivers/dispatch_rates.module';
import { DocumentsSalesModule } from './modules/erp/documents-sales/documents_sales.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DataImportModule,
    modulesmodule,
    DocumentsTypesErpModule,
    DocumentsTypesModule,
    TaxesModule,
    DocumentsModule,
    PurchasesModule,
    ReporteChoferesModule,
    DocumentsSalesModule,
  ],
})
export class AppModule {}
