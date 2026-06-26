import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CostingCalculatorService } from '../costing-calculator.service';
import { ICostStrategy, CostStrategyOptions } from '../interfaces/cost-strategy.interface';
import { CalculatedCost } from '../interfaces/calculated-cost.interface';
import { round2 } from '../utils/costing.utils';

@Injectable()
export class RateCostStrategy implements ICostStrategy {
  constructor(
    private readonly db: PrismaService,
    private readonly calculatorService: CostingCalculatorService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async calculate({
    productId,
    currencyId,
    templateComponents,
    costTemplateId,
  }: CostStrategyOptions): Promise<CalculatedCost> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
      include: {
        transfer_rate: {
          include: {
            dispatch_rates: {
              where: { deleted_by: null, deleted_at: null },
              orderBy: { created_at: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    // Toma el valor del último dispatch_rate activo,
    // con fallback a current_cost si no tiene dispatch configurado
    const latestDispatch = product.transfer_rate?.dispatch_rates?.[0];
    const materialCost = round2(latestDispatch ? Number(latestDispatch.value) : Number(product.current_cost || 0));

    const result = this.calculatorService.calculateFromComponents(materialCost, templateComponents);

    return {
      product_id: productId,
      material_cost: result.material_cost,
      labor_cost: result.labor_cost,
      overhead_cost: result.overhead_cost,
      other_cost: result.other_cost,
      total_cost: result.total_cost,
      breakdown: [],
      rates_snapshot: result.rates_snapshot,
      cost_template_id: costTemplateId,
    };
  }
}
