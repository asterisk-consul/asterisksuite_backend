import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';

import { round2 } from './utils/costing.utils';

import { VariantCostResolverService } from '../variant-costs/services/variant-cost-resolver.service';

@Injectable()
export class CostingTreeService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly variantCostResolver: VariantCostResolverService,
  ) {}

  async buildTree(
    productId: string,
    currencyId: string,
    level = 0,
  ): Promise<CostBreakdownItem[]> {
    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,

        deleted_at: null,

        active: true,
      },

      include: {
        child_product: true,

        child_variant: true,
      },
    });

    const result: CostBreakdownItem[] = [];

    for (const component of components) {
      let unitCost = 0;

      let source: string | undefined;

      if (component.child_variant_id) {
        const resolved = await this.variantCostResolver.resolve(
          component.child_variant_id,
          currencyId,
        );

        unitCost = resolved.converted_cost;

        source = resolved.source;
      } else {
        unitCost = Number(component.child_product.current_cost || 0);
      }

      const quantity = Number(component.quantity);

      const waste = Number(component.waste_percentage || 0);

      const factor = 1 + waste / 100;

      const totalCost = round2(quantity * unitCost * factor);

      const children = await this.buildTree(
        component.child_product_id,
        currencyId,
        level + 1,
      );

      result.push({
        product_id: component.child_product_id,

        variant_id: component.child_variant_id || undefined,

        product_name: component.child_product.name,

        quantity,

        unit_cost: unitCost,

        total_cost: totalCost,

        level,

        currency_id: currencyId,

        cost_source: source,

        children,
      });
    }

    return result;
  }

  flattenTree(items: CostBreakdownItem[]): CostBreakdownItem[] {
    const result: CostBreakdownItem[] = [];

    for (const item of items) {
      result.push(item);

      if (item.children?.length) {
        result.push(...this.flattenTree(item.children));
      }
    }

    return result;
  }
}
