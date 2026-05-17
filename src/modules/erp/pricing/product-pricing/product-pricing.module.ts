import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module'; // ← agregar
import { ExchangeModule } from '../exchange/exchange.module';

import { ProductPricingController } from './product-pricing.controller';
import { ProductPricingFacadeService } from './product-pricing-facade.service';
import { ProductPriceController } from './product-price.controller';
import { ProductPriceService } from './product-pricing.service';

import { ProductsService } from '../../../master-data/products/products.service';
import { PricingEngineService } from '../pricing-engine.service';
@Module({
  imports: [PrismaModule, ExchangeModule],
  controllers: [ProductPricingController, ProductPriceController],
  providers: [
    ProductPricingFacadeService,
    ProductPriceService,
    ProductsService, // ← agregar
    PricingEngineService,
  ],
  exports: [
    ProductPricingFacadeService,
    ProductPriceService,
    PricingEngineService,
  ],
})
export class ProductPricingModule {}
