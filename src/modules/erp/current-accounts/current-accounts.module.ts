import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrentAccountsController } from './current-accounts.controller';
import { CurrentAccountsService } from './current-accounts.service';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [CurrenciesModule],
  controllers: [CurrentAccountsController],
  providers: [CurrentAccountsService, PrismaService],
  exports: [CurrentAccountsService],
})
export class CurrentAccountsModule {}
