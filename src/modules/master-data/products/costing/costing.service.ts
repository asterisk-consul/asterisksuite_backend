import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

import { CostingTreeService } from './costing-tree.service';
import { CostingCalculatorService, TemplateComponent } from './costing-calculator.service';
import { CostingHistoryService, BreakdownInput } from './costing-history.service';

import { BomCostStrategy } from './strategies/bom-cost.strategy';
import { EngineeringCostStrategy } from './strategies/engineering-cost.strategy';
import { ManualCostStrategy } from './strategies/manual-cost.strategy';
import { PurchaseCostStrategy } from './strategies/purchase-cost.strategy';
import { RateCostStrategy } from './strategies/rate-cost.strategy';

import { CalculatedCost } from './interfaces/calculated-cost.interface';
import { CostStrategyOptions } from './interfaces/cost-strategy.interface';
import { CostBreakdownItem } from './interfaces/cost-breakdown.interface';
import { CostParetoResult, ParetoItem } from './interfaces/cost-pareto.interface';
import { round2 } from './utils/costing.utils';
import { UpdateManualCostDto } from './dto/update-manual-cost.dto';

import { cost_components, cost_template_components } from '@/generated/prisma/client';

type PrismaTemplateComponent = cost_template_components & {
  component: cost_components;
};

@Injectable()
export class CostingService {
  constructor(
    private readonly db: PrismaService,
    private readonly treeService: CostingTreeService,
    private readonly calculatorService: CostingCalculatorService,
    private readonly historyService: CostingHistoryService,
    private readonly bomStrategy: BomCostStrategy,
    private readonly engineeringStrategy: EngineeringCostStrategy,
    private readonly manualStrategy: ManualCostStrategy,
    private readonly purchaseStrategy: PurchaseCostStrategy,
    private readonly rateStrategy: RateCostStrategy,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async setManualCost(productId: string, dto: UpdateManualCostDto) {
    const [product, currency] = await Promise.all([
      this.prisma.products.findFirst({ where: { id: productId, deleted_at: null } }),
      this.prisma.currencies.findUnique({ where: { id: dto.currency_id } }),
    ]);
    if (!product) throw new NotFoundException('Producto no encontrado');
    if (!currency) throw new NotFoundException('Moneda no encontrada');
    if (product.product_type !== 'RAW_MATERIAL') {
      throw new BadRequestException('La carga manual desde el producto está disponible para materias primas');
    }

    const snapshot = await this.historyService.saveSnapshot({
      product_id: productId,
      currency_id: dto.currency_id,
      cost_source: dto.cost_source ?? 'MANUAL',
      material_cost: dto.current_cost,
      labor_cost: 0,
      overhead_cost: 0,
      total_cost: dto.current_cost,
      cost_rates_snapshot: {},
      breakdown: [],
    });

    await this.prisma.product_costs.update({
      where: { id: snapshot!.id },
      data: { notes: dto.notes ?? 'Costo inicial cargado manualmente' },
    });
    await this.prisma.products.update({
      where: { id: productId },
      data: {
        current_cost: dto.current_cost,
        current_cost_currency_id: dto.currency_id,
        cost_source: dto.cost_source ?? 'MANUAL',
        last_cost_calculated_at: new Date(),
        needs_cost_recalculation: false,
      },
    });

    return this.getCostHistory(productId);
  }

  // ─────────────────────────────────────────────────────────────
  // MAPPERS
  // ─────────────────────────────────────────────────────────────

  private mapTemplateComponent(item: PrismaTemplateComponent): TemplateComponent {
    return {
      ...item,
      value_override: item.value_override !== null ? Number(item.value_override) : null,
      component: {
        ...item.component,
        value: item.component.value !== null ? Number(item.component.value) : null,
      },
    };
  }

  private mapBreakdownToInput(items: CostBreakdownItem[]): BreakdownInput[] {
    return items.map((item) => ({
      component_product_id: item.product_id,
      component_variant_id: item.variant_id,
      quantity: item.quantity,
      unit_cost: item.unit_cost,
      total_cost: item.total_cost,
      level: item.level,
      children: item.children?.length ? this.mapBreakdownToInput(item.children) : undefined,
    }));
  }

  // ─────────────────────────────────────────────────────────────
  // CALCULATE
  // ─────────────────────────────────────────────────────────────

  async calculateProductCost(productId: string, currencyId: string, saveSnapshot = true, variantId?: string): Promise<CalculatedCost> {
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

    if (variantId) {
      const variant = await this.prisma.product_variants.findFirst({
        where: { id: variantId, product_id: productId, deleted_at: null, active: true },
        select: { id: true },
      });
      if (!variant) throw new NotFoundException('La variante no pertenece al producto');
    }

    const rawComponents = product.cost_template?.components ?? (await this.getRawDefaultTemplateComponents());

    const templateComponents: TemplateComponent[] = rawComponents.map((item) => this.mapTemplateComponent(item));

    const costTemplateId = product.cost_template_id ?? (await this.getDefaultTemplateId());

    const options: CostStrategyOptions = {
      productId,
      currencyId,
      templateComponents,
      costTemplateId,
      variantId,
    };

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

    if (saveSnapshot && variantId) {
      await this.prisma.product_variant_costs.create({
        data: {
          variant_id: variantId,
          currency_id: currencyId,
          source: 'ENGINEERING',
          cost: result.total_cost,
          notes: 'Costo calculado desde BOM y plantilla',
        },
      });
    } else if (saveSnapshot) {
      // Pasar el árbol jerárquico directamente — el history service
      // se encarga de insertar con parent_breakdown_id
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
        breakdown: this.mapBreakdownToInput(result.breakdown),
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
    mode: 'materials' | 'assemblies' | 'full' = 'materials',
  ): Promise<CostParetoResult> {
    if (!currencyId) {
      throw new NotFoundException('Se requiere una moneda para el análisis Pareto');
    }

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

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const breakdown = await this.treeService.buildTree(productId, currencyId);

    // ─────────────────────────────────────────────
    // ASSEMBLIES — solo semi-terminados (level 0 con hijos)
    // ─────────────────────────────────────────────

    if (mode === 'assemblies') {
      const assemblyItems: ParetoItem[] = breakdown
        .filter((node) => node.children?.length)
        .map((node) => ({
          product_id: node.product_id,
          variant_id: node.variant_id ?? null,
          product_name: node.product_name,
          product_sku: node.product_sku ?? null,
          variant_name: node.variant_name ?? null,
          variant_sku: node.variant_sku ?? null,
          total_quantity: node.quantity,
          total_cost: node.total_cost,
          occurrences: 1,
          cost_source: 'SEMI_FINISHED',
          percentage: 0,
          cumulative: 0,
          is_vital: false,
        }));

      return this.buildParetoResult(productId, currencyId, assemblyItems);
    }

    // ─────────────────────────────────────────────
    // MATERIALS — solo hojas consolidadas
    // ─────────────────────────────────────────────

    const consolidatedLeaves = this.treeService.consolidateTree(breakdown);
    const leafItems: ParetoItem[] = Array.from(consolidatedLeaves.values()) as ParetoItem[];

    if (mode === 'materials') {
      return this.buildParetoResult(productId, currencyId, leafItems);
    }

    // ─────────────────────────────────────────────
    // FULL — materiales + labor/overhead/otros
    // ─────────────────────────────────────────────

    const materialCost = round2(leafItems.reduce((acc, item) => acc + item.total_cost, 0));

    const templateComponents: TemplateComponent[] = (product.cost_template?.components ?? []).map((item) => ({
      ...item,
      value_override: item.value_override !== null ? Number(item.value_override) : null,
      component: {
        ...item.component,
        value: item.component.value !== null ? Number(item.component.value) : null,
      },
    }));

    const calculated = this.calculatorService.calculateFromComponents(materialCost, templateComponents);

    const fullItems: ParetoItem[] = [...leafItems];

    if (calculated.labor_cost > 0) {
      fullItems.push({
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

    if (calculated.overhead_cost > 0) {
      fullItems.push({
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

    if (calculated.other_cost > 0) {
      fullItems.push({
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

    return this.buildParetoResult(productId, currencyId, fullItems);
  }

  // ─────────────────────────────────────────────
  // HELPER — calcular porcentajes y acumulado
  // ─────────────────────────────────────────────

  private buildParetoResult(productId: string, currencyId: string, items: ParetoItem[]): CostParetoResult {
    const sorted = [...items].sort((a, b) => b.total_cost - a.total_cost);

    const totalCost = round2(sorted.reduce((acc, item) => acc + item.total_cost, 0));

    let cumulative = 0;

    const finalItems: ParetoItem[] = sorted.map((item) => {
      const percentage = totalCost > 0 ? round2((item.total_cost / totalCost) * 100) : 0;

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
      vital_items_percentage: finalItems.length > 0 ? round2((vitalItems.length / finalItems.length) * 100) : 0,
    };
  }

  // ─────────────────────────────────────────────────────────────
  // HISTORY
  // ─────────────────────────────────────────────────────────────

  async getCostHistory(productId: string) {
    const snapshots = await this.prisma.product_costs.findMany({
      where: { product_id: productId },
      orderBy: { created_at: 'desc' },
      include: {
        breakdowns: {
          where: { parent_breakdown_id: null }, // solo raíces
          include: {
            component_product: { select: { name: true, sku: true } },
            component_variant: { select: { name: true, sku: true } },
            children: {
              include: {
                component_product: { select: { name: true, sku: true } },
                component_variant: { select: { name: true, sku: true } },
                children: {
                  include: {
                    component_product: { select: { name: true, sku: true } },
                    component_variant: { select: { name: true, sku: true } },
                  },
                },
              },
            },
          },
        },
        currencies: true,
        products: { select: { name: true, sku: true } },
      },
    });

    return snapshots;
  }

  // ─────────────────────────────────────────────────────────────
  // DEFAULT TEMPLATE
  // ─────────────────────────────────────────────────────────────

  private async getRawDefaultTemplateComponents(): Promise<PrismaTemplateComponent[]> {
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
