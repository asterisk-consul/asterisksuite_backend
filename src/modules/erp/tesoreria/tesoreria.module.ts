import { Module } from '@nestjs/common';

import { EmployeesModule } from '../employees/employees.module';
import { PartnersModule } from '../partners/partners.module';
import { PaymentsModule } from '../payments/payments.module';
import { BankAccountsModule } from '../bank-accounts/bank-accounts.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';
import { CashBoxesModule } from '@/modules/logistica/cash-boxes/cash-boxes.module';
import { CashBoxMovementsModule } from '@/modules/logistica/cash-box-movements/cash-box-movements.module';
import { CashBoxRenditionsModule } from '@/modules/logistica/cash-box-renditions/cash-box-renditions.module';
import { CashBoxTransfersModule } from '@/modules/logistica/cash-box-transfers/cash-box-transfers.module';

@Module({
  imports: [
    EmployeesModule,
    PartnersModule,
    PaymentsModule,
    BankAccountsModule,
    CurrentAccountsModule,
    CashBoxesModule,
    CashBoxMovementsModule,
    CashBoxRenditionsModule,
    CashBoxTransfersModule,
  ],
  exports: [
    EmployeesModule,
    PartnersModule,
    PaymentsModule,
    BankAccountsModule,
    CurrentAccountsModule,
    CashBoxesModule,
    CashBoxMovementsModule,
    CashBoxRenditionsModule,
    CashBoxTransfersModule,
  ],
})
export class TesoreriaModule {}
