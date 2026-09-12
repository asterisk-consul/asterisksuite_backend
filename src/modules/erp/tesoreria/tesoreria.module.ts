import { Module } from '@nestjs/common';

import { EmployeesModule } from '../employees/employees.module';
import { PartnersModule } from '../partners/partners.module';
import { PaymentsModule } from '../payments/payments.module';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';

@Module({
  imports: [
    EmployeesModule,
    PartnersModule,
    PaymentsModule,
    BankAccountsModule,
    CurrentAccountsModule,
  ],
  exports: [
    EmployeesModule,
    PartnersModule,
    PaymentsModule,
    BankAccountsModule,
    CurrentAccountsModule,
  ],
})
export class TesoreriaModule {}
