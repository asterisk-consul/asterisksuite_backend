import { Module } from '@nestjs/common';
import { CashBoxMovementsController } from './cash-box-movements.controller';
import { CashBoxMovementsService } from './cash-box-movements.service';

@Module({
  controllers: [CashBoxMovementsController],
  providers: [CashBoxMovementsService],
  exports: [CashBoxMovementsService],
})
export class CashBoxMovementsModule {}
