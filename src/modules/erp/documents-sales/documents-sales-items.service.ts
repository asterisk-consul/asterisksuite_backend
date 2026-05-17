import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { ProductPricingFacadeService } from '../pricing/product-pricing/product-pricing-facade.service';

import { CreateDocumentDto } from '../documents/dto/create-document.dto';

import { ItemInput, TaxInput } from './interfaces/item-input.interface';

@Injectable()
export class DocumentsSalesItemsService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly pricingFacade: ProductPricingFacadeService,
  ) {}

  async resolveItems(
    dtoItems: CreateDocumentDto['items'],

    documentTypeId: string,

    currencyCode: string,
  ): Promise<ItemInput[]> {
    const docTypeTaxes = await this.loadDocTypeTaxes(documentTypeId);

    const resolved: ItemInput[] = [];

    for (const item of dtoItems) {
      // ITEM LIBRE
      if (!item.product_id) {
        const price = round2(item.unit_price * item.quantity);

        resolved.push({
          product_id: null,

          quantity: item.quantity,

          currency: currencyCode,

          exchange_rate: 1,

          original_unit_price: item.unit_price,

          unit_price: item.unit_price,

          price,

          exempt_amount: 0,

          taxable_base: price,

          total_taxes: 0,

          total: price,

          taxes: docTypeTaxes.map((t) => ({
            tax_id: t.tax_id,

            tax_rate: t.tax_rate,

            tax_amount: 0,

            calculation_level: t.calculation_level,

            is_included_in_price: false,
          })),
        });

        continue;
      }

      const overridePrice =
        Number(item.unit_price) > 0 ? Number(item.unit_price) : undefined;

      const resolvedItem = await this.pricingFacade.getSellPrice(
        item.product_id,

        Number(item.quantity),

        currencyCode,
      );

      const productTaxes: TaxInput[] = resolvedItem.taxes.map((t) => ({
        tax_id: t.tax_id,

        tax_rate: t.tax_rate,

        tax_amount: t.tax_amount,

        calculation_level: t.calculation_level,

        is_included_in_price: t.is_included_in_price,
      }));

      const productTaxIds = new Set(productTaxes.map((t) => t.tax_id));

      const fallbackTaxes = docTypeTaxes
        .filter((t) => !productTaxIds.has(t.tax_id))
        .map((t) => ({
          tax_id: t.tax_id,

          tax_rate: t.tax_rate,

          tax_amount: 0,

          calculation_level: t.calculation_level,

          is_included_in_price: false,
        }));

      resolved.push({
        product_id: resolvedItem.product_id,

        quantity: resolvedItem.quantity,

        currency: resolvedItem.currency,

        exchange_rate: resolvedItem.exchange_rate,

        original_unit_price: resolvedItem.original_unit_price,

        unit_price: resolvedItem.unit_price,

        price: resolvedItem.price,

        exempt_amount: resolvedItem.exempt_amount,

        taxable_base: resolvedItem.taxable_base,

        total_taxes: resolvedItem.total_taxes,

        total: resolvedItem.total,

        taxes: [...productTaxes, ...fallbackTaxes],
      });
    }

    return resolved;
  }

  private async loadDocTypeTaxes(documentTypeId: string) {
    const rows = await this.prisma.document_type_taxes.findMany({
      where: {
        document_type_id: documentTypeId,
      },

      include: {
        taxes: true,
      },
    });

    return rows.map((r) => ({
      tax_id: r.tax_id,

      tax_rate: Number(r.taxes.rate),

      calculation_level: r.taxes.calculation_level,
    }));
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
