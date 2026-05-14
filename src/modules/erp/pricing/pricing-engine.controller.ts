// pricing-engine.controller.ts

import { Controller, Get, Query, Param, ParseFloatPipe } from '@nestjs/common';

import { PricingEngineService } from './pricing-engine.service';

@Controller('pricing-engine')
export class PricingEngineController {
  constructor(private readonly pricingEngineService: PricingEngineService) {}

  // ─────────────────────────────────────────────
  // GET PRICE
  // ─────────────────────────────────────────────
  @Get('product/:productId')
  async resolveProductPrice(
    @Param('productId') productId: string,

    @Query('currency')
    currency: string,
  ) {
    return this.pricingEngineService.resolveProductPrice(productId, currency);
  }

  // ─────────────────────────────────────────────
  // CALCULATE ITEM
  // ─────────────────────────────────────────────
  @Get('product/:productId/item')
  async resolveItem(
    @Param('productId')
    productId: string,

    @Query('quantity', ParseFloatPipe)
    quantity: number,

    @Query('currency')
    currency: string,

    @Query('override_price')
    overridePrice?: string,
  ) {
    return this.pricingEngineService.resolveItemWithTaxes(
      productId,
      quantity,
      currency,
      overridePrice ? Number(overridePrice) : undefined,
    );
  }
}
