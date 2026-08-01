import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';

import { round2 } from './utils/costing.utils';

import { VariantCostResolverService } from '../variant-costs/services/variant-cost-resolver.service';

export interface ConsolidatedCostItem {
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

@Injectable()
export class CostingTreeService {
  constructor(
    private readonly db: PrismaService,

    private readonly variantCostResolver: VariantCostResolverService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async buildTree(productId: string, currencyId: string, level = 0): Promise<CostBreakdownItem[]> {
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
      const children = await this.buildTree(component.child_product_id, currencyId, level + 1);

      let unitCost = 0;
      let source: string | undefined;

      if (children.length) {
        // Nodo padre (semi-terminado): costo viene de los hijos
        const childrenTotal = round2(children.reduce((acc, child) => acc + child.total_cost, 0));

        result.push({
          product_id: component.child_product_id,
          variant_id: component.child_variant_id || undefined,
          product_name: component.child_product.name,
          product_sku: component.child_product.sku,
          variant_name: component.child_variant?.name,
          variant_sku: component.child_variant?.sku,
          quantity: Number(component.quantity),
          unit_cost: 0,
          total_cost: childrenTotal,
          level,
          currency_id: currencyId,
          cost_source: undefined,
          children,
        });
      } else {
        // Nodo hoja (materia prima): resolver costo real
        if (component.child_variant_id) {
          const resolved = await this.variantCostResolver.resolve(component.child_variant_id, currencyId);
          unitCost = resolved.converted_cost;
          source = resolved.source;
        } else {
          // Sin variante: buscar costo en product_costs con moneda correcta
          const productCost = await this.prisma.product_costs.findFirst({
            where: {
              product_id: component.child_product_id,
              active: true,
              deleted_at: null,
            },
            include: { currencies: true },
            orderBy: { created_at: 'desc' },
          });

          if (productCost) {
            if (productCost.currency_id === currencyId) {
              unitCost = Number(productCost.total_cost);
            } else {
              // Convertir via currency_rates
              const rate = await this.prisma.currency_rates.findFirst({
                where: {
                  from_currency_id: productCost.currency_id,
                  to_currency_id: currencyId,
                },
                orderBy: { effective_date: 'desc' },
              });
              unitCost = rate
                ? Number(productCost.total_cost) * Number(rate.rate)
                : Number(component.child_product.current_cost || 0);
            }
          } else {
            // Sin product_costs: usar current_cost (fallback)
            unitCost = Number(component.child_product.current_cost || 0);
          }
        }

        const quantity = this.calculateEngineeringQuantity(component);
        const totalCost = round2(quantity * unitCost);

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
          children: [],
        });
      }
    }

    return result;
  }

  // ─────────────────────────────────────────────
  // FLATTEN — todos los nodos (para snapshot)
  // ─────────────────────────────────────────────

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

  // ─────────────────────────────────────────────
  // FLATTEN LEAVES — solo hojas (para Pareto)
  // ─────────────────────────────────────────────

  flattenLeaves(items: CostBreakdownItem[]): CostBreakdownItem[] {
    const result: CostBreakdownItem[] = [];

    for (const item of items) {
      if (item.children?.length) {
        result.push(...this.flattenLeaves(item.children));
      } else {
        result.push(item);
      }
    }

    return result;
  }

  // ─────────────────────────────────────────────
  // CONSOLIDATE — agrupa hojas sin duplicar padres
  // ─────────────────────────────────────────────

  consolidateTree(items: CostBreakdownItem[]): Map<string, ConsolidatedCostItem> {
    const flat = this.flattenLeaves(items);
    const map = new Map<string, ConsolidatedCostItem>();

    for (const item of flat) {
      const key = `${item.product_id}::${item.variant_id ?? 'base'}`;

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.total_quantity = round2(existing.total_quantity + item.quantity);
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
