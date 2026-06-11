import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EngineeringService } from '../../engineering/engineering.service';
import { VariantCostResolverService } from '../../variant-costs/services/variant-cost-resolver.service';
import { CostingCalculatorService } from '../costing-calculator.service';
import { CostingTreeService } from '../costing-tree.service';
import { ICostStrategy, CostStrategyOptions } from '../interfaces/cost-strategy.interface';
import { CalculatedCost } from '../interfaces/calculated-cost.interface';
import { CostBreakdownItem } from '../interfaces/cost-breakdown.interface';
import { round2 } from '../utils/costing.utils';
import { EngineeringCalculatedComponent } from '../../engineering/interface/engineering-calculated-component.interface';

@Injectable()
export class EngineeringCostStrategy implements ICostStrategy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engineeringService: EngineeringService,
    private readonly variantCostResolver: VariantCostResolverService,
    private readonly calculatorService: CostingCalculatorService,
    private readonly treeService: CostingTreeService,
  ) {}

  async calculate({
    productId,
    currencyId,
    templateComponents,
    costTemplateId,
  }: CostStrategyOptions): Promise<CalculatedCost> {
    // 1. Obtener árbol de ingeniería (pesos/cantidades calculados)
    const engineering = await this.engineeringService.calculate(productId);

    // 2. Resolver costos reales en las hojas y propagar hacia arriba
    await this.resolveLeafCosts(engineering.tree, currencyId);

    // 3. Armar breakdown jerárquico (compatible con flattenTree)
    const breakdown: CostBreakdownItem[] = this.toBreakdown(engineering.tree, currencyId);

    // 4. materialCost = suma de los nodos raíz (ya incluyen hijos)
    const materialCost = round2(breakdown.reduce((acc, node) => acc + node.total_cost, 0));

    // 5. Aplicar template (mano de obra, overhead, etc.)
    const result = this.calculatorService.calculateFromComponents(materialCost, templateComponents);

    return {
      product_id: productId,
      material_cost: result.material_cost,
      labor_cost: result.labor_cost,
      overhead_cost: result.overhead_cost,
      other_cost: result.other_cost,
      total_cost: result.total_cost,
      breakdown,
      rates_snapshot: result.rates_snapshot,
      cost_template_id: costTemplateId,
    };
  }

  // ─────────────────────────────────────────────
  // Resolver costos bottom-up
  // ─────────────────────────────────────────────

  private async resolveLeafCosts(nodes: EngineeringCalculatedComponent[], currencyId: string): Promise<void> {
    for (const node of nodes) {
      if (node.children?.length) {
        // Primero resolver hijos recursivamente
        await this.resolveLeafCosts(node.children, currencyId);

        // Padre acumula lo que vienen de abajo
        node.children_cost = round2(node.children.reduce((acc, child) => acc + child.total_cost, 0));
        node.own_material_cost = 0;
        node.total_cost = node.children_cost;
      } else {
        // Hoja: resolver costo real de variante o producto
        let unitCost = 0;

        if (node.variant_id) {
          const resolved = await this.variantCostResolver.resolve(node.variant_id, currencyId);
          unitCost = resolved.converted_cost;
        } else {
          const product = await this.prisma.products.findUnique({
            where: { id: node.product_id },
            select: { current_cost: true },
          });
          unitCost = Number(product?.current_cost || 0);
        }

        const qty = node.calculated_quantity > 0 ? node.calculated_quantity : node.quantity;

        node.unit_cost = unitCost;
        node.own_material_cost = round2(unitCost * qty);
        node.children_cost = 0;
        node.total_cost = node.own_material_cost;
      }
    }
  }

  // ─────────────────────────────────────────────
  // Convertir árbol resuelto a CostBreakdownItem[]
  // (compatible con CostingTreeService.flattenTree)
  // ─────────────────────────────────────────────

  private toBreakdown(nodes: EngineeringCalculatedComponent[], currencyId: string): CostBreakdownItem[] {
    return nodes.map((node) => ({
      product_id: node.product_id,
      variant_id: node.variant_id || undefined,
      product_name: node.variant_name || node.product_name || 'Producto',
      product_sku: node.variant_sku || node.product_sku || 'SIN-SKU',
      quantity: node.calculated_quantity > 0 ? node.calculated_quantity : node.quantity,
      unit_cost: node.unit_cost,
      total_cost: node.total_cost,
      level: node.level,
      currency_id: currencyId,
      children: node.children?.length ? this.toBreakdown(node.children, currencyId) : undefined,
    }));
  }
}
