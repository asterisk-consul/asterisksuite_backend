import { Module } from '@nestjs/common';
import { CurrentAccountsController } from './current-accounts.controller';
import { CurrentAccountsService } from './current-accounts.service';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [CurrenciesModule],
  controllers: [CurrentAccountsController],
  providers: [CurrentAccountsService],
  exports: [CurrentAccountsService],
})
export class CurrentAccountsModule {}
