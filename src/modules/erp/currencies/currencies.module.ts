import { Module } from '@nestjs/common';


import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { CurrencyConversionService } from './currency-conversion.service';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrencyConversionService],
  exports: [CurrenciesService, CurrencyConversionService],
})
export class CurrenciesModule {}
