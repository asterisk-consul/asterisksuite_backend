import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { EngineeringModule } from '@/modules/master-data/products/engineering/engineering.module';

@Module({
  imports: [PrismaModule, EngineeringModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
