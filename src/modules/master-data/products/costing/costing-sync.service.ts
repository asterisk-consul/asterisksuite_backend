import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { EngineeringService } from '../engineering/engineering.service';

import { VariantCostResolverService } from '../variant-costs/services/variant-cost-resolver.service';

interface CostBreakdownInput {
  component_product_id: string;

  component_variant_id: string | null;

  quantity: number;

  unit_cost: number;

  total_cost: number;

  level: number;
}

@Injectable()
export class CostingSyncService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly engineeringService: EngineeringService,

    private readonly variantCostResolver: VariantCostResolverService,
  ) {}

  async recalculateProductCost(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const currency = await this.prisma.currencies.findFirst({
      where: {
        is_base: true,
      },
    });

    if (!currency) {
      throw new NotFoundException('No base currency configured');
    }

    const engineering = await this.engineeringService.calculate(productId);

    const materials = engineering.materials;

    let materialCost = 0;

    const breakdowns: CostBreakdownInput[] = [];

    for (const material of materials) {
      let unitCost = 0;

      if (material.variant_id) {
        const resolved = await this.variantCostResolver.resolve(
          material.variant_id,
          currency.id,
        );

        unitCost = resolved.converted_cost;
      } else {
        const childProduct = await this.prisma.products.findUnique({
          where: {
            id: material.product_id,
          },
        });

        unitCost = Number(childProduct?.current_cost || 0);
      }

      const totalCost = unitCost * material.quantity;

      materialCost += totalCost;

      breakdowns.push({
        component_product_id: material.product_id,

        component_variant_id: material.variant_id ?? null,

        quantity: material.quantity,

        unit_cost: unitCost,

        total_cost: totalCost,

        level: 0,
      });
    }

    let laborCost = 0;

    let overheadCost = 0;

    switch (product.cost_source) {
      case 'MANUAL':
        materialCost = Number(product.current_cost || 0);
        break;

      case 'ENGINEERING':
        laborCost = materialCost * 0.15;

        overheadCost = materialCost * 0.1;

        break;

      case 'PURCHASE':
        break;

      case 'BOM':
      default:
        break;
    }

    const totalCost = materialCost + laborCost + overheadCost;

    const cost = await this.prisma.product_costs.create({
      data: {
        product_id: productId,

        currency_id: currency.id,

        cost_source: product.cost_source,

        material_cost: materialCost,

        labor_cost: laborCost,

        overhead_cost: overheadCost,

        total_cost: totalCost,

        breakdowns: {
          create: breakdowns,
        },
      },

      include: {
        breakdowns: true,
      },
    });

    await this.prisma.products.update({
      where: {
        id: productId,
      },

      data: {
        current_cost: totalCost,

        needs_cost_recalculation: false,

        last_cost_calculated_at: new Date(),
      },
    });

    return cost;
  }
}
