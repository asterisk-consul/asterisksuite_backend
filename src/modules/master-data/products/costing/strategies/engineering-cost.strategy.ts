import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { EngineeringService } from '../../engineering/engineering.service';

import { VariantCostResolverService } from '../../variant-costs/services/variant-cost-resolver.service';

import { CalculatedCost } from '../interfaces/calculated-cost.interface';

import { CostBreakdownItem } from '../interfaces/cost-breakdown.interface';

import { round2 } from '../utils/costing.utils';

@Injectable()
export class EngineeringCostStrategy {
  constructor(
    private readonly prisma: PrismaService,

    private readonly engineeringService: EngineeringService,

    private readonly variantCostResolver: VariantCostResolverService,
  ) {}

  async calculate(
    productId: string,
    currencyId: string,
  ): Promise<CalculatedCost> {
    const engineering = await this.engineeringService.calculate(productId);

    let materialCost = 0;

    const breakdown: CostBreakdownItem[] = [];

    for (const item of engineering.materials) {
      let unitCost = 0;

      let source: string | undefined;

      if (item.variant_id) {
        const resolved = await this.variantCostResolver.resolve(
          item.variant_id,
          currencyId,
        );

        unitCost = resolved.converted_cost;

        source = resolved.source;
      } else {
        const product = await this.prisma.products.findUnique({
          where: {
            id: item.product_id,
          },
        });

        unitCost = Number(product?.current_cost || 0);
      }

      const totalCost = round2(unitCost * item.quantity);

      materialCost += totalCost;

      breakdown.push({
        product_id: item.product_id,

        variant_id: item.variant_id || undefined,

        product_name: item.product_name || 'Producto',

        quantity: item.quantity,

        unit_cost: unitCost,

        total_cost: totalCost,

        level: 0,

        currency_id: currencyId,

        cost_source: source,
      });
    }

    const laborCost = round2(materialCost * 0.15);

    const overheadCost = round2(materialCost * 0.1);

    const totalCost = round2(materialCost + laborCost + overheadCost);

    return {
      product_id: productId,

      material_cost: materialCost,

      labor_cost: laborCost,

      overhead_cost: overheadCost,

      total_cost: totalCost,

      breakdown,
    };
  }
}
