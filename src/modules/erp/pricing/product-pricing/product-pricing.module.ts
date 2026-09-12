import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module'; // ← agregar
import { ExchangeModule } from '../exchange/exchange.module';
import { AuditModule } from '../../audit/audit.module';

import { ProductPricingController } from './product-pricing.controller';
import { ProductPricingFacadeService } from './product-pricing-facade.service';
import { ProductPriceController } from './product-price.controller';
import { ProductPriceService } from './product-pricing.service';

import { ProductsService } from '../../../master-data/products/products.service';
import { PricingEngineService } from '../pricing-engine.service';
import { ProductPartyPricingController } from '../product-party-pricing/product-party-pricing.controller';
import { ProductPartyPricingService } from '../product-party-pricing/product-party-pricing.service';
@Module({
  imports: [PrismaModule, ExchangeModule, AuditModule],
  controllers: [ProductPricingController, ProductPriceController, ProductPartyPricingController],
  providers: [
    ProductPricingFacadeService,
    ProductPriceService,
    ProductsService, // ← agregar
    PricingEngineService,
    ProductPartyPricingService,
  ],
  exports: [
    ProductPricingFacadeService,
    ProductPriceService,
    PricingEngineService,
    ProductPartyPricingService,
  ],
})
export class ProductPricingModule {}
