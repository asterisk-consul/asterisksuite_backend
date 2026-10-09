import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CurrenciesModule } from '../currencies/currencies.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';
import { DocumentsSalesModule } from '../documents-sales/documents_sales.module';
import { AccessControlModule } from '@/access-control/access-control.module';
import { BankMovementsModule } from '../bank-movements/bank-movements.module';

@Module({
  imports: [CurrenciesModule, CurrentAccountsModule, DocumentsSalesModule, AccessControlModule, BankMovementsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
