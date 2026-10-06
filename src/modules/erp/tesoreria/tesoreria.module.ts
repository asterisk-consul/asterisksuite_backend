import { Module } from '@nestjs/common';

import { EmployeesModule } from '../employees/employees.module';
import { PartnersModule } from '../partners/partners.module';
import { PaymentsModule } from '../payments/payments.module';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';
import { TreasuryObligationsModule } from '../treasury-obligations/treasury-obligations.module';
import { CreditCardsModule } from '../credit-cards/credit-cards.module';

@Module({
  imports: [
    EmployeesModule,
    PartnersModule,
    PaymentsModule,
    BankAccountsModule,
    CurrentAccountsModule,
    TreasuryObligationsModule,
    CreditCardsModule,
  ],
  exports: [
    EmployeesModule,
    PartnersModule,
    PaymentsModule,
    BankAccountsModule,
    CurrentAccountsModule,
    TreasuryObligationsModule,
    CreditCardsModule,
  ],
})
export class TesoreriaModule {}
