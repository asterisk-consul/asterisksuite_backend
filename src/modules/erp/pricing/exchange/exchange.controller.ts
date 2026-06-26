import {
  Controller,
  Get,
  Param,
  ParseFloatPipe,
  Post,
  Query,
} from '@nestjs/common';

import { CurrencyRateType } from '@/generated/prisma/enums';

import { ExchangeService } from './exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  // =========================================================
  // SYNC
  // =========================================================

  @Post('sync/official')
  syncOfficialRates() {
    return this.exchangeService.syncOfficialRates();
  }

  @Post('sync/dollars')
  syncDollarRates() {
    return this.exchangeService.syncDollarRates();
  }

  // =========================================================
  // CONVERT
  // =========================================================

  @Get('convert')
  convert(
    @Query('amount', ParseFloatPipe)
    amount: number,

    @Query('from')
    from: string,

    @Query('to')
    to: string,

    @Query('rateType')
    rateType?: CurrencyRateType,
  ) {
    return this.exchangeService.convertAmount(amount, from, to, rateType);
  }

  // =========================================================
  // RATE
  // =========================================================

  @Get('rate/:from/:to')
  getRate(
    @Param('from')
    from: string,

    @Param('to')
    to: string,

    @Query('rateType')
    rateType?: CurrencyRateType,
  ) {
    return this.exchangeService.getLatestRate(from, to, rateType);
  }
}
