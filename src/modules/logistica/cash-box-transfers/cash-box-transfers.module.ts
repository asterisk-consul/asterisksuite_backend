import { Module } from '@nestjs/common';
import { CashBoxTransfersController } from './cash-box-transfers.controller';
import { CashBoxTransfersService } from './cash-box-transfers.service';

@Module({
  controllers: [CashBoxTransfersController],
  providers: [CashBoxTransfersService],
  exports: [CashBoxTransfersService],
})
export class CashBoxTransfersModule {}
