import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { CostingTreeService } from './costing-tree.service';
import {
  CostingCalculatorService,
  TemplateComponent,
} from './costing-calculator.service';
import { CostingHistoryService } from './costing-history.service';

import { BomCostStrategy } from './strategies/bom-cost.strategy';
import { EngineeringCostStrategy } from './strategies/engineering-cost.strategy';
import { ManualCostStrategy } from './strategies/manual-cost.strategy';
import { PurchaseCostStrategy } from './strategies/purchase-cost.strategy';
import { RateCostStrategy } from './strategies/rate-cost.strategy';

import { CalculatedCost } from './interfaces/calculated-cost.interface';
import { CostStrategyOptions } from './interfaces/cost-strategy.interface';
import {
  CostParetoResult,
  ParetoItem,
} from './interfaces/cost-pareto.interface';
import { round2 } from './utils/costing.utils';

import {
  cost_components,
  cost_template_components,
} from '@/generated/prisma/client';

type PrismaTemplateComponent = cost_template_components & {
  component: cost_components;
};

@Injectable()
export class CostingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly treeService: CostingTreeService,
    private readonly calculatorService: CostingCalculatorService,
    private readonly historyService: CostingHistoryService,
    private readonly bomStrategy: BomCostStrategy,
    private readonly engineeringStrategy: EngineeringCostStrategy,
    private readonly manualStrategy: ManualCostStrategy,
    private readonly purchaseStrategy: PurchaseCostStrategy,
    private readonly rateStrategy: RateCostStrategy,
  ) {}

  // ─────────────────────────────────────────────────────────────
  // MAPPERS
  // ─────────────────────────────────────────────────────────────

  private mapTemplateComponent(
    item: PrismaTemplateComponent,
  ): TemplateComponent {
    return {
      ...item,
      value_override:
        item.value_override !== null ? Number(item.value_override) : null,
      component: {
        ...item.component,
        value:
          item.component.value !== null ? Number(item.component.value) : null,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────
  // CALCULATE
  // ─────────────────────────────────────────────────────────────

  async calculateProductCost(
    productId: string,
    currencyId: string,
    saveSnapshot = true,
  ): Promise<CalculatedCost> {
    // 1. Cargar producto + template
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        cost_template: {
          include: {
            components: {
              include: { component: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    // 2. Resolver template
    const rawComponents =
      product.cost_template?.components ??
      (await this.getRawDefaultTemplateComponents());

    const templateComponents: TemplateComponent[] = rawComponents.map((item) =>
      this.mapTemplateComponent(item),
    );

    const costTemplateId =
      product.cost_template_id ?? (await this.getDefaultTemplateId());

    // 3. Armar opciones para la estrategia
    const options: CostStrategyOptions = {
      productId,
      currencyId,
      templateComponents,
      costTemplateId,
    };

    // 4. Delegar en la estrategia correcta
    let result: CalculatedCost;

    switch (product.cost_source) {
      case 'MANUAL':
        result = await this.manualStrategy.calculate(options);
        break;
      case 'PURCHASE':
        result = await this.purchaseStrategy.calculate(options);
        break;
      case 'ENGINEERING':
        result = await this.engineeringStrategy.calculate(options);
        break;
      case 'RATE':
        result = await this.rateStrategy.calculate(options);
        break;
      case 'BOM':
      default:
        result = await this.bomStrategy.calculate(options);
        break;
    }

    // 5. Guardar snapshot
    if (saveSnapshot) {
      const flat = this.treeService.flattenTree(result.breakdown);

      await this.historyService.saveSnapshot({
        product_id: productId,
        currency_id: currencyId,
        cost_source: product.cost_source,
        material_cost: result.material_cost,
        labor_cost: result.labor_cost,
        overhead_cost: result.overhead_cost,
        total_cost: result.total_cost,
        cost_template_id: costTemplateId,
        cost_rates_snapshot: result.rates_snapshot,
        breakdown: flat.map((item) => ({
          component_product_id: item.product_id,
          component_variant_id: item.variant_id,
          quantity: item.quantity,
          unit_cost: item.unit_cost,
          total_cost: item.total_cost,
          level: item.level,
        })),
      });

      await this.prisma.products.update({
        where: { id: productId },
        data: {
          current_cost: result.total_cost,
          last_cost_calculated_at: new Date(),
          needs_cost_recalculation: false,
        },
      });
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────
  // PARETO
  // ─────────────────────────────────────────────────────────────

  async getCostPareto(
    productId: string,
    currencyId: string,
    mode: 'materials' | 'full' = 'materials',
  ): Promise<CostParetoResult> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },

      include: {
        cost_template: {
          include: {
            components: {
              include: {
                component: true,
              },

              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // ─────────────────────────────────────────────
    // MATERIALES
    // ─────────────────────────────────────────────

    const breakdown = await this.treeService.buildTree(productId, currencyId);

    const consolidated = this.treeService.consolidateTree(breakdown);

    const items: ParetoItem[] = Array.from(
      consolidated.values(),
    ) as ParetoItem[];

    // ─────────────────────────────────────────────
    // FULL MODE
    // ─────────────────────────────────────────────

    if (mode === 'full') {
      const materialCost = round2(
        items.reduce((acc, item) => acc + item.total_cost, 0),
      );

      // MAPEAR DECIMAL → NUMBER
      const templateComponents: TemplateComponent[] = (
        product.cost_template?.components ?? []
      ).map((item) => ({
        ...item,

        value_override:
          item.value_override !== null ? Number(item.value_override) : null,

        component: {
          ...item.component,

          value:
            item.component.value !== null ? Number(item.component.value) : null,
        },
      }));

      const calculated = this.calculatorService.calculateFromComponents(
        materialCost,
        templateComponents,
      );

      // ─────────────────────────────────────────
      // LABOR
      // ─────────────────────────────────────────

      if (calculated.labor_cost > 0) {
        items.push({
          product_id: 'LABOR',
          variant_id: null,

          product_name: 'Mano de Obra',
          product_sku: null,

          variant_name: null,
          variant_sku: null,

          total_quantity: 1,

          total_cost: calculated.labor_cost,

          occurrences: 1,

          cost_source: 'LABOR',

          percentage: 0,
          cumulative: 0,
          is_vital: false,
        });
      }

      // ─────────────────────────────────────────
      // OVERHEAD
      // ─────────────────────────────────────────

      if (calculated.overhead_cost > 0) {
        items.push({
          product_id: 'OVERHEAD',
          variant_id: null,

          product_name: 'Costos Indirectos',
          product_sku: null,

          variant_name: null,
          variant_sku: null,

          total_quantity: 1,

          total_cost: calculated.overhead_cost,

          occurrences: 1,

          cost_source: 'OVERHEAD',

          percentage: 0,
          cumulative: 0,
          is_vital: false,
        });
      }

      // ─────────────────────────────────────────
      // OTHER
      // ─────────────────────────────────────────

      if (calculated.other_cost > 0) {
        items.push({
          product_id: 'OTHER',
          variant_id: null,

          product_name: 'Otros Costos',
          product_sku: null,

          variant_name: null,
          variant_sku: null,

          total_quantity: 1,

          total_cost: calculated.other_cost,

          occurrences: 1,

          cost_source: 'OTHER',

          percentage: 0,
          cumulative: 0,
          is_vital: false,
        });
      }
    }

    // ─────────────────────────────────────────────
    // SORT
    // ─────────────────────────────────────────────

    const sorted = items.sort((a, b) => b.total_cost - a.total_cost);

    const totalCost = round2(
      sorted.reduce((acc, item) => acc + item.total_cost, 0),
    );

    // ─────────────────────────────────────────────
    // PERCENTAGES
    // ─────────────────────────────────────────────

    let cumulative = 0;

    const finalItems: ParetoItem[] = sorted.map((item) => {
      const percentage =
        totalCost > 0 ? round2((item.total_cost / totalCost) * 100) : 0;

      cumulative = round2(cumulative + percentage);

      return {
        ...item,

        percentage,

        cumulative,

        is_vital: cumulative <= 80,
      };
    });

    const vitalItems = finalItems.filter((i) => i.is_vital);

    return {
      product_id: productId,

      currency_id: currencyId,

      total_cost: totalCost,

      items: finalItems,

      vital_items_count: vitalItems.length,

      vital_items_percentage:
        finalItems.length > 0
          ? round2((vitalItems.length / finalItems.length) * 100)
          : 0,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────────────

  async getCostHistory(productId: string) {
    return this.prisma.product_costs.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' },
      include: {
        breakdowns: {
          include: {
            component_product: { select: { name: true, sku: true } },
            component_variant: { select: { name: true, sku: true } },
          },
        },
        currencies: true,
        products: { select: { name: true, sku: true } },
      },
    });
  }

  // ─────────────────────────────────────────────────────────────
  // DEFAULT TEMPLATE
  // ─────────────────────────────────────────────────────────────

  private async getRawDefaultTemplateComponents(): Promise<
    PrismaTemplateComponent[]
  > {
    const template = await this.prisma.cost_templates.findFirst({
      where: { is_default: true, active: true },
      include: {
        components: {
          include: { component: true },
          orderBy: { order: 'asc' },
        },
      },
    });
    return template?.components ?? [];
  }

  private async getDefaultTemplateId(): Promise<string | null> {
    const template = await this.prisma.cost_templates.findFirst({
      where: { is_default: true, active: true },
      select: { id: true },
    });
    return template?.id ?? null;
  }
}
