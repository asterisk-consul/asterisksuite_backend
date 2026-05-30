import { Injectable } from '@nestjs/common';

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

      // ✅ cantidad real según ingeniería
      const quantity = this.calculateEngineeringQuantity(component);

      const totalCost = round2(quantity * unitCost);

      const children = await this.buildTree(
        component.child_product_id,
        currencyId,
        level + 1,
      );

      result.push({
        product_id: component.child_product_id,

        variant_id: component.child_variant_id || undefined,

        product_name: component.child_product.name,

        product_sku: component.child_product.sku,

        variant_name: component.child_variant?.name,

        variant_sku: component.child_variant?.sku,

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

  consolidateTree(items: CostBreakdownItem[]): Map<
    string,
    {
      product_id: string;
      variant_id: string | null;
      product_name: string;
      product_sku?: string | null;
      variant_name?: string | null;
      variant_sku?: string | null;
      total_quantity: number;
      total_cost: number;
      occurrences: number;
      cost_source?: string;
    }
  > {
    const flat = this.flattenTree(items);

    const map = new Map<
      string,
      ReturnType<typeof this.consolidateTree> extends Map<string, infer V>
        ? V
        : never
    >();

    for (const item of flat) {
      const key = `${item.product_id}::${item.variant_id ?? 'base'}`;

      if (map.has(key)) {
        const existing = map.get(key)!;

        existing.total_quantity = round2(
          existing.total_quantity + item.quantity,
        );

        existing.total_cost = round2(existing.total_cost + item.total_cost);

        existing.occurrences += 1;
      } else {
        map.set(key, {
          product_id: item.product_id,

          variant_id: item.variant_id ?? null,

          product_name: item.product_name,

          product_sku: item.product_sku,

          variant_name: item.variant_name,

          variant_sku: item.variant_sku,

          total_quantity: item.quantity,

          total_cost: item.total_cost,

          occurrences: 1,

          cost_source: item.cost_source,
        });
      }
    }

    return map;
  }

  // ─────────────────────────────────────────────
  // ENGINEERING CALCULATIONS
  // ─────────────────────────────────────────────

  private calculateEngineeringQuantity(component: any): number {
    const calculationType = component.child_product?.calculation_type ?? 'UNIT';

    const waste = Number(component.waste_percentage || 0);

    switch (calculationType) {
      case 'SURFACE':
        return this.calculateSurfaceQuantity(component, waste);

      case 'LINEAR':
        return this.calculateLinearQuantity(component, waste);

      case 'VOLUME':
        return this.calculateVolumeQuantity(component, waste);

      case 'UNIT':
      default:
        return Number(component.quantity);
    }
  }

  private calculateSurfaceQuantity(component: any, waste: number): number {
    const variant = component.child_variant;

    const thicknessM = Number(variant?.thickness_mm || 0) / 1000;

    const densityKgM3 = Number(variant?.density_kg_m3 || 0);

    const lengthM = Number(component.length_mm || 0) / 1000;

    const widthM = Number(component.width_mm || 0) / 1000;

    const areaM2 = lengthM * widthM;

    const volumeM3 = areaM2 * thicknessM;

    const weightKg = volumeM3 * densityKgM3;

    return round2(weightKg * (1 + waste / 100));
  }

  private calculateLinearQuantity(component: any, waste: number): number {
    const lengthM = Number(component.length_mm || 0) / 1000;

    return round2(lengthM * (1 + waste / 100));
  }

  private calculateVolumeQuantity(component: any, waste: number): number {
    const volume =
      (Number(component.length_mm || 0) / 1000) *
      (Number(component.width_mm || 0) / 1000) *
      (Number(component.height_mm || 0) / 1000);

    return round2(volume * (1 + waste / 100));
  }
}
