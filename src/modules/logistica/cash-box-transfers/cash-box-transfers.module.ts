import { Module } from '@nestjs/common';
import { CashBoxTransfersController } from './cash-box-transfers.controller';
import { CashBoxTransfersService } from './cash-box-transfers.service';
import { BankMovementsModule } from '@/modules/erp/bank-movements/bank-movements.module';

@Module({
  imports: [BankMovementsModule],
  controllers: [CashBoxTransfersController],
  providers: [CashBoxTransfersService],
  exports: [CashBoxTransfersService],
})
export class CashBoxTransfersModule {}
