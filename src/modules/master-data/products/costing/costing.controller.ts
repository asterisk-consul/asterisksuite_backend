// src/modules/master-data/products/costing/costing.controller.ts

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CostingService } from './costing.service';

import { CalculateProductCostDto } from './dto/calculate-product-cost.dto';

@Controller('products/costing')
export class CostingController {
  constructor(private readonly costingService: CostingService) {}
  @RequirePermissions('cost_templates.read')
  @Get(':productId/pareto')
  getCostPareto(
    @Param('productId') productId: string,
    @Query('currencyId') currencyId: string,
    @Query('mode')
    mode: 'materials' | 'full' = 'materials',
  ) {
    return this.costingService.getCostPareto(productId, currencyId, mode);
  }

  @RequirePermissions('cost_templates.create')
  @Post('calculate')
  calculate(
    @Body()
    dto: CalculateProductCostDto,
  ) {
    return this.costingService.calculateProductCost(dto.product_id, dto.currency_id, dto.save_snapshot);
  }

  @RequirePermissions('cost_templates.read')
  @Get(':productId/history')
  history(
    @Param('productId')
    productId: string,
  ) {
    return this.costingService.getCostHistory(productId);
  }
}
