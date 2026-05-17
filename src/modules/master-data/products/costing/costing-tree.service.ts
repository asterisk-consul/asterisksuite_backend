// src/modules/master-data/products/costing/costing-tree.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';

import { round2, safeNumber } from './utils/costing.utils';

@Injectable()
export class CostingTreeService {
  constructor(private readonly prisma: PrismaService) {}

  async buildTree(
    productId: string,
    level = 0,
    visited = new Set<string>(),
  ): Promise<CostBreakdownItem[]> {
    // ─────────────────────────────
    // EVITAR CICLOS
    // ─────────────────────────────

    if (visited.has(productId)) {
      throw new BadRequestException(
        `Ciclo detectado en estructura BOM (${productId})`,
      );
    }

    visited.add(productId);

    // ─────────────────────────────
    // COMPONENTES
    // ─────────────────────────────

    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,
        deleted_at: null,
        active: true,
      },

      include: {
        child_product: {
          include: {
            // ─────────────────────
            // COSTOS CALCULADOS
            // ─────────────────────

            product_costs: {
              where: {
                active: true,
              },

              orderBy: {
                created_at: 'desc',
              },

              take: 1,
            },

            // ─────────────────────
            // PRECIO PRODUCTO
            // FALLBACK
            // ─────────────────────

            product_price: {
              where: {
                deleted_at: null,
                active: true,
              },

              include: {
                currencies: true,
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

    // ─────────────────────────────
    // LOOP COMPONENTES
    // ─────────────────────────────

    for (const component of components) {
      const child = component.child_product;

      if (!child) {
        continue;
      }

      // ─────────────────────────
      // COSTO UNITARIO
      // ─────────────────────────

      const latestCost = child.product_costs[0];

      let unitCost = 0;

      // COSTO CALCULADO
      if (latestCost) {
        unitCost = safeNumber(latestCost.total_cost);
      }

      // FALLBACK → PRECIO
      else if (child.product_price?.length) {
        unitCost = safeNumber(child.product_price[0].price);
      }

      // ─────────────────────────
      // CANTIDAD
      // ─────────────────────────

      const quantity = safeNumber(component.quantity);

      // ─────────────────────────
      // HIJOS RECURSIVOS
      // ─────────────────────────

      const children = await this.buildTree(
        child.id,
        level + 1,
        new Set(visited),
      );

      // ─────────────────────────
      // COSTO HIJOS
      // ─────────────────────────

      const childrenCost = children.reduce(
        (acc, childItem) => acc + childItem.total_cost,
        0,
      );

      // ─────────────────────────
      // COSTO PROPIO
      // ─────────────────────────

      const ownCost = round2(unitCost * quantity);

      // ─────────────────────────
      // COSTO TOTAL
      // ─────────────────────────

      const totalCost = round2(ownCost + childrenCost);

      // ─────────────────────────
      // RESULTADO
      // ─────────────────────────

      result.push({
        product_id: child.id,

        product_name: child.name,

        quantity,

        unit_cost: round2(unitCost),

        total_cost: totalCost,

        level,

        children,
      });
    }

    return result;
  }

  // ─────────────────────────────
  // FLATTEN TREE
  // ─────────────────────────────

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
