import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';
import { AuditModule } from '@/modules/erp/audit/audit.module';

import { VariantCostsController } from './variant-costs.controller';

import { VariantCostsService } from './variant-costs.service';

import { VariantCostResolverService } from './services/variant-cost-resolver.service';

@Module({
  imports: [PrismaModule, AuditModule],

  controllers: [VariantCostsController],

  providers: [VariantCostsService, VariantCostResolverService],

  exports: [VariantCostResolverService],
})
export class VariantCostsModule {}
