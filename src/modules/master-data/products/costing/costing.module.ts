// src/modules/master-data/products/costing/costing.module.ts

import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { CostingController } from './costing.controller';

import { CostingService } from './costing.service';

import { CostingTreeService } from './costing-tree.service';

import { CostingCalculatorService } from './costing-calculator.service';

import { CostingHistoryService } from './costing-history.service';

@Module({
  imports: [PrismaModule],

  controllers: [CostingController],

  providers: [
    CostingService,

    CostingTreeService,

    CostingCalculatorService,

    CostingHistoryService,
  ],

  exports: [CostingService],
})
export class CostingModule {}
