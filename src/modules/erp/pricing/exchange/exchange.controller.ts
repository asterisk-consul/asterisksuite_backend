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
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  // =========================================================
  // SYNC
  // =========================================================

  @RequirePermissions('exchange.sync')
  @Post('sync/official')
  syncOfficialRates() {
    return this.exchangeService.syncOfficialRates();
  }

  @RequirePermissions('exchange.sync')
  @Post('sync/dollars')
  syncDollarRates() {
    return this.exchangeService.syncDollarRates();
  }

  // =========================================================
  // CONVERT
  // =========================================================

  @RequirePermissions('exchange.read')
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

  @RequirePermissions('exchange.read')
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
