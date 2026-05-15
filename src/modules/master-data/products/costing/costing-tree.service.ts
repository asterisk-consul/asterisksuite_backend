// src/modules/master-data/products/costing/costing-tree.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';

import { round2, safeNumber } from './utils/costing.utils';

@Injectable()
export class CostingTreeService {
  constructor(private readonly prisma: PrismaService) {}

  async buildTree(productId: string, level = 0): Promise<CostBreakdownItem[]> {
    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,
        deleted_at: null,
        active: true,
      },
      include: {
        child_product: {
          include: {
            product_costs: {
              where: {
                active: true,
              },
              orderBy: {
                created_at: 'desc',
              },
              take: 1,
            },
          },
        },
      },
    });

    const result: CostBreakdownItem[] = [];

    for (const component of components) {
      const child = component.child_product;

      if (!child) {
        continue;
      }

      const latestCost = child.product_costs[0];

      const unitCost = latestCost ? safeNumber(latestCost.total_cost) : 0;

      const quantity = safeNumber(component.quantity);

      const totalCost = round2(unitCost * quantity);

      const children = await this.buildTree(child.id, level + 1);

      result.push({
        product_id: child.id,

        product_name: child.name,

        quantity,

        unit_cost: unitCost,

        total_cost: totalCost,

        level,

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
