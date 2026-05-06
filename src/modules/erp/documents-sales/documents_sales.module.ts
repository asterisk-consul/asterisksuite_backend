import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { DocumentsSalesController } from './documents_sales.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductPriceModule } from '../../master-data/products-prices/products_prices.module';
import { SalesReportModule } from './sales-reports/sales_reports.module';
import { ProductPriceService } from '../../master-data/products-prices/products_prices.service';

@Module({
  imports: [PrismaModule, ProductPriceModule, SalesReportModule],
  controllers: [DocumentsSalesController],
  providers: [DocumentsSalesService, ProductPriceService],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
