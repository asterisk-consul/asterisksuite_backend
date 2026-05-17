import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { DocumentsSalesController } from './documents_sales.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductPricingModule } from '../pricing/product-pricing/product-pricing.module';
import { SalesReportModule } from './sales-reports/sales_reports.module';
import { DocumentsSalesItemsService } from './documents-sales-items.service';
import { DocumentsSalesTotalsService } from './documents-sales-totals.service';

@Module({
  imports: [PrismaModule, ProductPricingModule, SalesReportModule],
  controllers: [DocumentsSalesController],
  providers: [
    DocumentsSalesService,
    // ← ProductPriceService eliminado, viene via ProductPricingModule
    DocumentsSalesItemsService,
    DocumentsSalesTotalsService,
  ],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
