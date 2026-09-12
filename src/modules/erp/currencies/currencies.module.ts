import { Module } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { CurrencyConversionService } from './currency-conversion.service';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrencyConversionService, PrismaService],
  exports: [CurrenciesService, CurrencyConversionService],
})
export class CurrenciesModule {}
