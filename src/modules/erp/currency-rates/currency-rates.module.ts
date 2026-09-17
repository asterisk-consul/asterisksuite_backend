import { Module } from '@nestjs/common';


import { CurrencyRatesController } from './currency-rates.controller';
import { CurrencyRatesService } from './currency-rates.service';

@Module({
  controllers: [CurrencyRatesController],
  providers: [CurrencyRatesService],
  exports: [CurrencyRatesService],
})
export class CurrencyRatesModule {}
