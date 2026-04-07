import { Module } from '@nestjs/common';
import { DocumentsTypesController } from './document_types/documents-types.controller';
import { DocumentsTypesService } from './document_types/documents-types.service';
import { PurchasesController } from './purchase/purchases.controller';
import { PurchasesService } from './purchase/purchases.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DocumentsTypesController, PurchasesController],
  providers: [DocumentsTypesService, PurchasesService, PrismaService],
  exports: [DocumentsTypesService],
})
export class DocumentTypesModule {}
