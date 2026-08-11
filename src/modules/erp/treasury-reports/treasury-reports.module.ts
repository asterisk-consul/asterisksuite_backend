import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { TreasuryReportsController } from './treasury-reports.controller';
import { TreasuryReportsService } from './treasury-reports.service';
import { CurrenciesModule } from '../currencies/currencies.module';

@Module({
  imports: [PrismaModule, CurrenciesModule],
  controllers: [TreasuryReportsController],
  providers: [TreasuryReportsService],
})
export class TreasuryReportsModule {}
