import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BankAccountsController } from './bank-accounts.controller';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountAccessGuard } from '@/common/guards/bank-account-access.guard';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService, BankAccountAccessGuard, PrismaService],
  exports: [BankAccountsService],
})
export class BankAccountsModule {}
