import { Module } from '@nestjs/common';
import { DocumentsPurchasesService } from './documents_purchases.service';
import { ProductPricingModule } from '../pricing/product-pricing/product-pricing.module';
import { DocumentsPurchasesController } from './documents_puerchases.controller';
import { DocumentsPurchasesItemsService } from './documents-purchases-items-services';
import { DocumentsPurchasesTotalsService } from './documents-purchases-totals';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductPricingModule],
  controllers: [DocumentsPurchasesController],
  providers: [DocumentsPurchasesService, DocumentsPurchasesItemsService, DocumentsPurchasesTotalsService],
  exports: [DocumentsPurchasesService],
})
export class DocumentsPurchasesModule {}
