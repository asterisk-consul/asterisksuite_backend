import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CalculatedCost } from '../interfaces/calculated-cost.interface';

@Injectable()
export class ManualCostStrategy {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(productId: string): Promise<CalculatedCost> {
    const product = await this.prisma.products.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const totalCost = Number(product.current_cost || 0);

    return {
      product_id: productId,

      material_cost: totalCost,

      labor_cost: 0,

      overhead_cost: 0,

      total_cost: totalCost,

      breakdown: [],
    };
  }
}
