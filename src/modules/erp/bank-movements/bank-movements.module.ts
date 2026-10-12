import { Module } from '@nestjs/common';
import { BankMovementsService } from './bank-movements.service';

@Module({
  providers: [BankMovementsService],
  exports: [BankMovementsService],
})
export class BankMovementsModule {}
