import { Module } from '@nestjs/common';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountAccessGuard } from '@/common/guards/bank-account-access.guard';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService, BankAccountAccessGuard],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
