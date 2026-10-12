import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountAccessGuard } from '@/common/guards/bank-account-access.guard';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';

@Module({
  imports: [BankMovementsModule],
  controllers: [BankAccountsController],
  providers: [BankAccountsService, BankAccountAccessGuard],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
