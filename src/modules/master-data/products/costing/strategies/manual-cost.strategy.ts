import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ICostStrategy, CostStrategyOptions } from '../interfaces/cost-strategy.interface';
import { CalculatedCost } from '../interfaces/calculated-cost.interface';

@Injectable()
export class ManualCostStrategy implements ICostStrategy {
  constructor(private readonly db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async calculate({ productId, costTemplateId }: CostStrategyOptions): Promise<CalculatedCost> {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    // Manual: el usuario ingresó el costo total directamente,
    // no se aplican labor ni overhead encima
    const totalCost = Number(product.current_cost || 0);

    return {
      product_id: productId,
      material_cost: totalCost,
      labor_cost: 0,
      overhead_cost: 0,
      other_cost: 0,
      total_cost: totalCost,
      breakdown: [],
      rates_snapshot: {},
      cost_template_id: costTemplateId,
    };
  }
}
