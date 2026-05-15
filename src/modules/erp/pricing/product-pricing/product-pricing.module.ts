import { Module } from '@nestjs/common';

import { ProductPricingController } from './product-pricing.controller';
import { ProductPricingFacadeService } from './product-pricing-facade.service';

import { ProductsService } from '../../../master-data/products/products.service';
import { PricingEngineService } from '../pricing-engine.service';
import { ExchangeService } from '../exchange/exchange.service';

@Module({
  controllers: [ProductPricingController],
  providers: [
    ProductPricingFacadeService,
    ProductsService,
    PricingEngineService,
    ExchangeService,
  ],
  exports: [ProductPricingFacadeService],
})
export class ProductPricingModule {}
