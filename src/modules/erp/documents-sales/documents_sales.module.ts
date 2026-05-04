import { Module } from '@nestjs/common';
import { DocumentsSalesService } from './documents_sales.services';
import { DocumentsSalesController } from './documents_sales.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductPriceModule } from '../../master-data/products-prices/products_prices.module';

@Module({
  imports: [PrismaModule, ProductPriceModule],
  controllers: [DocumentsSalesController],
  providers: [DocumentsSalesService],
  exports: [DocumentsSalesService],
})
export class DocumentsSalesModule {}
