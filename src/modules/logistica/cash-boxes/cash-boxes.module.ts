import { Module } from '@nestjs/common';
import { CashBoxesController } from './cash-boxes.controller';
import { CashBoxesService } from './cash-boxes.service';

@Module({
  controllers: [CashBoxesController],
  providers: [CashBoxesService],
  exports: [CashBoxesService],
})
export class CashBoxesModule {}
