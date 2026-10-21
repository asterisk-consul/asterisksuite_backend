import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { EngineeringModule } from '@/modules/master-data/products/engineering/engineering.module';
import { DocumentsSalesModule } from '@/modules/erp/documents-sales/documents_sales.module';

@Module({
  imports: [PrismaModule, EngineeringModule, DocumentsSalesModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
