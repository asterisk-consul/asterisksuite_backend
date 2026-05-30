import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { EngineeringService } from '../../engineering/engineering.service';
import { VariantCostResolverService } from '../../variant-costs/services/variant-cost-resolver.service';
import { CostingCalculatorService } from '../costing-calculator.service';
import {
  ICostStrategy,
  CostStrategyOptions,
} from '../interfaces/cost-strategy.interface';
import { CalculatedCost } from '../interfaces/calculated-cost.interface';
import { CostBreakdownItem } from '../interfaces/cost-breakdown.interface';
import { round2 } from '../utils/costing.utils';

@Injectable()
export class EngineeringCostStrategy implements ICostStrategy {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engineeringService: EngineeringService,
    private readonly variantCostResolver: VariantCostResolverService,
    private readonly calculatorService: CostingCalculatorService,
  ) {}

  async calculate({
    productId,
    currencyId,
    templateComponents,
    costTemplateId,
  }: CostStrategyOptions): Promise<CalculatedCost> {
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

      // ✅ usar cantidad calculada real
      const calculatedQty =
        item.calculated_quantity > 0 ? item.calculated_quantity : item.quantity;

      const totalCost = round2(unitCost * calculatedQty);

      materialCost += totalCost;

      breakdown.push({
        product_id: item.product_id,

        variant_id: item.variant_id || undefined,

        product_name: item.variant_name || item.product_name || 'Producto',

        product_sku: item.variant_sku || item.product_sku || 'SIN-SKU',

        quantity: calculatedQty,

        unit_cost: unitCost,

        total_cost: totalCost,

        level: 0,

        currency_id: currencyId,

        cost_source: source,
      });
    }

    materialCost = round2(materialCost);

    // ← antes tenía 0.15 y 0.10 hardcodeados, ahora usa el template
    const result = this.calculatorService.calculateFromComponents(
      materialCost,
      templateComponents,
    );

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
}
