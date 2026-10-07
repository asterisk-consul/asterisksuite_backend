import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { VariantCostResolverService } from '../variant-costs/services/variant-cost-resolver.service';

@Injectable()
export class EngineeringTreeService {
  constructor(private readonly db: PrismaService, private readonly variantCostResolver: VariantCostResolverService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async buildTree(productId: string, structureVariantId?: string, level = 0, currencyId?: string) {
    const useVariantStructure = level === 0 && !!structureVariantId && await this.prisma.product_components.count({
      where: { parent_product_id: productId, structure_variant_id: structureVariantId, deleted_at: null, active: true },
    }) > 0;
    const components = await this.prisma.product_components.findMany({
      where: {
        parent_product_id: productId,
        structure_variant_id: useVariantStructure ? structureVariantId : null,
        deleted_at: null,
        active: true,
      },
      include: {
        child_product: { include: { current_cost_currency: true } },
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
            active: true,
          },
          include: { currency: true },
          orderBy: [{ effective_date: 'desc' }, { created_at: 'desc' }],
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
      components.map(async (component) => {
        const costs = component.child_variant_id ? (costsByVariant.get(component.child_variant_id) || []) : [];
        let resolvedVariantCost: any = null;
        let conversionError: string | null = null;
        if (component.child_variant_id && currencyId) {
          try {
            resolvedVariantCost = await this.variantCostResolver.resolve(component.child_variant_id, currencyId);
          } catch (error: any) {
            conversionError = error?.message || 'No se pudo convertir el costo';
          }
        }
        return {
          ...component,
          productVariantCosts: costs,
          resolvedVariantCost,
          conversionError,
          level,
          children: await this.buildTree(component.child_product_id, undefined, level + 1, currencyId),
        };
      }),
    );
  }
}
