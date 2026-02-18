import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { LogisticaPrismaModule } from '@/prisma/prisma-logistica.module';

@Module({
  imports: [LogisticaPrismaModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
