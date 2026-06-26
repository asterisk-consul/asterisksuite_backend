import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { VariantCostsController } from './variant-costs.controller';

import { VariantCostsService } from './variant-costs.service';

import { VariantCostResolverService } from './services/variant-cost-resolver.service';

@Module({
  imports: [PrismaModule],

  controllers: [VariantCostsController],

  providers: [VariantCostsService, VariantCostResolverService],

  exports: [VariantCostResolverService],
})
export class VariantCostsModule {}
