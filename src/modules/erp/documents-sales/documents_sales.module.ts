import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { DocumentsSalesController } from './documents_sales.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductPricingModule } from '../pricing/product-pricing/product-pricing.module';
import { SalesReportModule } from './sales-reports/sales_reports.module';
import { ProductPriceService } from '../pricing/product-pricing/product-pricing.service';

@Module({
  imports: [PrismaModule, ProductPricingModule, SalesReportModule],
  controllers: [DocumentsSalesController],
  providers: [DocumentsSalesService, ProductPriceService],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
