import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CurrenciesModule } from '../currencies/currencies.module';
import { CurrentAccountsModule } from '../current-accounts/current-accounts.module';

@Module({
  imports: [CurrenciesModule, CurrentAccountsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
