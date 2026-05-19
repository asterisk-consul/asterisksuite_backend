import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class VariantCostResolverService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(variantId: string, targetCurrencyId: string) {
    const directCost = await this.prisma.product_variant_costs.findFirst({
      where: {
        variant_id: variantId,

        currency_id: targetCurrencyId,

        active: true,

        deleted_at: null,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    if (directCost) {
      return {
        original_currency_id: directCost.currency_id,

        converted_currency_id: targetCurrencyId,

        original_cost: Number(directCost.cost),

        converted_cost: Number(directCost.cost),

        source: directCost.source,
      };
    }

    const fallbackCost = await this.prisma.product_variant_costs.findFirst({
      where: {
        variant_id: variantId,

        active: true,

        deleted_at: null,
      },
      include: {
        currency: true,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    if (!fallbackCost) {
      throw new NotFoundException('No se encontró costo para la variante');
    }

    const rate = await this.prisma.currency_rates.findFirst({
      where: {
        from_currency_id: fallbackCost.currency_id,

        to_currency_id: targetCurrencyId,
      },
      orderBy: {
        effective_date: 'desc',
      },
    });

    if (!rate) {
      throw new NotFoundException('No existe cotización entre monedas');
    }

    const converted = Number(fallbackCost.cost) * Number(rate.rate);

    return {
      original_currency_id: fallbackCost.currency_id,

      converted_currency_id: targetCurrencyId,

      original_cost: Number(fallbackCost.cost),

      converted_cost: converted,

      source: fallbackCost.source,
    };
  }
}
