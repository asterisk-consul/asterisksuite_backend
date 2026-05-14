import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CurrencyRatesController } from './currency-rates.controller';
import { CurrencyRatesService } from './currency-rates.service';

@Module({
  controllers: [CurrencyRatesController],
  providers: [CurrencyRatesService, PrismaService],
  exports: [CurrencyRatesService],
})
export class CurrencyRatesModule {}
