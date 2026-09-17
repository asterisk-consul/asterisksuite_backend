import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CurrenciesModule } from '../currencies/currencies.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';
import { DocumentsSalesModule } from '../documents-sales/documents_sales.module';

@Module({
  imports: [CurrenciesModule, CurrentAccountsModule, DocumentsSalesModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
