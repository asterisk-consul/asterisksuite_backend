import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EngineeringTreeService {
  constructor(private readonly db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async buildTree(productId: string, level = 0) {
    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,
        deleted_at: null,
        active: true,
      },
      include: {
        child_product: true,
        child_variant: true,
        units: true,
      },
      orderBy: { order: 'asc' },
    });

    // Resolve variant costs for each component
    const variantIds = components
      .filter(c => c.child_variant_id)
      .map(c => c.child_variant_id!);

    const variantCosts = variantIds.length > 0
      ? await this.prisma.product_variant_costs.findMany({
          where: {
            variant_id: { in: variantIds },
            deleted_at: null,
          },
          include: { currency: true },
        })
      : [];

    // Group costs by variant_id
    const costsByVariant = new Map<string, any[]>();
    for (const cost of variantCosts) {
      const existing = costsByVariant.get(cost.variant_id) || [];
      existing.push(cost);
      costsByVariant.set(cost.variant_id, existing);
    }

    return Promise.all(
      components.map(async (component) => ({
        ...component,
        productVariantCosts: component.child_variant_id
          ? (costsByVariant.get(component.child_variant_id) || [])
          : [],
        level,
        children: await this.buildTree(component.child_product_id, level + 1),
      })),
    );
  }
}
