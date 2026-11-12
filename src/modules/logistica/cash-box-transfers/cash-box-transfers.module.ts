import { Module } from '@nestjs/common';
import { CashBoxTransfersController } from './cash-box-transfers.controller';
import { CashBoxTransfersService } from './cash-box-transfers.service';
import { BankMovementsModule } from '@/modules/erp/bank-movements/bank-movements.module';
import { CashBoxesModule } from '../cash-boxes/cash-boxes.module';

@Module({
  imports: [BankMovementsModule, CashBoxesModule],
  controllers: [CashBoxTransfersController],
  providers: [CashBoxTransfersService],
  exports: [CashBoxTransfersService],
})
export class CashBoxTransfersModule {}
