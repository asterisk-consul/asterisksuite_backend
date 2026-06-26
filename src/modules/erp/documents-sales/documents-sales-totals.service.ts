import { Injectable } from '@nestjs/common';

import { ItemInput, TaxInput } from './interfaces/item-input.interface';

import { CalculatedTotals } from './interfaces/calculated-totals.interface';

@Injectable()
export class DocumentsSalesTotalsService {
  calculate(items: ItemInput[]): CalculatedTotals {
    const subtotal = round2(items.reduce((acc, i) => acc + i.price, 0));

    const exemptAmount = round2(
      items.reduce((acc, i) => acc + i.exempt_amount, 0),
    );

    const taxableBase = round2(
      items.reduce((acc, i) => acc + i.taxable_base, 0),
    );

    const totalTaxes = round2(items.reduce((acc, i) => acc + i.total_taxes, 0));

    const total = round2(items.reduce((acc, i) => acc + i.total, 0));

    const taxMap = new Map<
      string,
      {
        tax_id: string;
        tax_rate: number;
        taxable_base: number;
        tax_amount: number;
      }
    >();

    for (const item of items) {
      for (const tax of item.taxes) {
        if (tax.is_included_in_price) {
          continue;
        }

        const existing = taxMap.get(tax.tax_id);

        if (existing) {
          existing.tax_amount = round2(existing.tax_amount + tax.tax_amount);

          existing.taxable_base = round2(
            existing.taxable_base + item.taxable_base,
          );
        } else {
          taxMap.set(tax.tax_id, {
            tax_id: tax.tax_id,

            tax_rate: tax.tax_rate,

            taxable_base: item.taxable_base,

            tax_amount: tax.tax_amount,
          });
        }
      }
    }

    return {
      subtotal,

      exempt_amount: exemptAmount,

      taxable_base: taxableBase,

      total_taxes: totalTaxes,

      total,

      documentTaxes: [...taxMap.values()],
    };
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
