// pricing-engine.module.ts

import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { ExchangeModule } from '@/modules/erp/exchange/exchange.module';

import { PricingEngineService } from './pricing-engine.service';
import { PricingEngineController } from './pricing-engine.controller';

@Module({
  imports: [PrismaModule, ExchangeModule],
  controllers: [PricingEngineController],
  providers: [PricingEngineService],
  exports: [PricingEngineService],
})
export class PricingEngineModule {}
