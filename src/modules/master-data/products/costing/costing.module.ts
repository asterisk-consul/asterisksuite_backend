import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { EngineeringModule } from '../engineering/engineering.module';
import { CostingController } from './costing.controller';
import { CostingService } from './costing.service';
import { CostingTreeService } from './costing-tree.service';
import { CostingCalculatorService } from './costing-calculator.service';
import { CostingHistoryService } from './costing-history.service';
import { CostingSyncService } from './costing-sync.service';
import { BomCostStrategy } from './strategies/bom-cost.strategy';
import { EngineeringCostStrategy } from './strategies/engineering-cost.strategy';
import { ManualCostStrategy } from './strategies/manual-cost.strategy';
import { PurchaseCostStrategy } from './strategies/purchase-cost.strategy';
import { RateCostStrategy } from './strategies/rate-cost.strategy';
import { VariantCostsModule } from '../variant-costs/variant-costs.module';

@Module({
  imports: [PrismaModule, EngineeringModule, VariantCostsModule],

  controllers: [CostingController],

  providers: [
    CostingService,

    CostingTreeService,

    CostingCalculatorService,

    CostingHistoryService,

    CostingSyncService,

    BomCostStrategy,

    EngineeringCostStrategy,

    ManualCostStrategy,

    PurchaseCostStrategy,

    RateCostStrategy,
  ],

  exports: [CostingService],
})
export class CostingModule {}
