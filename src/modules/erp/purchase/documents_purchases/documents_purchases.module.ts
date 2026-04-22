import { Module } from '@nestjs/common';
import { TaxesPurchasesService } from '../documents_purchases/documents_purchases.service';
import { TaxesPurchasesController } from '../documents_purchases/documents_purchases.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [TaxesPurchasesController],
  providers: [TaxesPurchasesService, PrismaService],
  exports: [TaxesPurchasesService], // 🔥 para usarlo desde documents
})
export class TaxesPurchasesModule {}
