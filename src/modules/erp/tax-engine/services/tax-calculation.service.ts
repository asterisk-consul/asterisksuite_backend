import { Injectable } from '@nestjs/common'
import type { TaxResolutionResult, TaxCalculationResult, CalculatedItem, CalculatedItemTax, CalculatedDocumentTax } from '../interfaces/tax-result.interface'
import type { TaxContextItem } from '../interfaces/tax-context.interface'

@Injectable()
export class TaxCalculationService {
  calculate(resolution: TaxResolutionResult, items: TaxContextItem[]): TaxCalculationResult {
    console.log('[TaxCalculation] calculate() called')
    console.log('[TaxCalculation] pricesIncludeTax:', resolution.settings.pricesIncludeTax)
    console.log('[TaxCalculation] items:', items)

    const calcItems: CalculatedItem[] = []
    const allItemTaxes: CalculatedItemTax[] = []

    for (const item of items) {
      console.log('[TaxCalculation] Processing item:', item)
      const productTaxes = resolution.productTaxes.get(item.productId ?? '') ?? []
      const allTaxes = [...productTaxes, ...resolution.operationTaxes]
      console.log('[TaxCalculation] productTaxes:', productTaxes)
      console.log('[TaxCalculation] allTaxes:', allTaxes)

      const price = item.quantity * item.unitPrice
      const itemTaxes: CalculatedItemTax[] = []
      let addedTaxes = 0
      let includedTaxes = 0

      for (const tax of allTaxes) {
        if (tax.calculation_level !== 'line') {
          console.log('[TaxCalculation] Skipping tax (not line level):', tax.name, tax.calculation_level)
          continue
        }

        if (tax.is_included_in_price) {
          const amount = price - price / (1 + tax.rate / 100)
          console.log('[TaxCalculation] Included tax:', tax.name, 'rate:', tax.rate, 'amount:', amount)
          itemTaxes.push({
            tax_id: tax.tax_id,
            code: tax.code,
            name: tax.name,
            rate: tax.rate,
            amount,
            taxableBase: price - amount,
            isIncludedInPrice: true,
            source: tax.source,
            reason: tax.reason,
          })
          includedTaxes += amount
        } else {
          const amount = price * (tax.rate / 100)
          console.log('[TaxCalculation] Added tax:', tax.name, 'rate:', tax.rate, 'amount:', amount)
          itemTaxes.push({
            tax_id: tax.tax_id,
            code: tax.code,
            name: tax.name,
            rate: tax.rate,
            amount,
            taxableBase: price,
            isIncludedInPrice: false,
            source: tax.source,
            reason: tax.reason,
          })
          addedTaxes += amount
        }
      }

      const totalTaxes = addedTaxes + includedTaxes
      const calcItem = {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        price: price - includedTaxes,
        exemptAmount: 0,
        taxableBase: price - includedTaxes,
        taxes: itemTaxes,
        totalTaxes,
        total: price + addedTaxes,
      }
      console.log('[TaxCalculation] calcItem:', calcItem)
      calcItems.push(calcItem)

      allItemTaxes.push(...itemTaxes)
    }

    const documentTaxes = this.groupTaxesByTaxId(allItemTaxes)
    console.log('[TaxCalculation] documentTaxes:', documentTaxes)

    const result = {
      document: {
        settings: resolution.settings,
        items: calcItems,
        documentTaxes,
        subtotal: calcItems.reduce((s, i) => s + i.price, 0),
        exemptAmount: 0,
        taxableBase: calcItems.reduce((s, i) => s + i.taxableBase, 0),
        totalTaxes: allItemTaxes.reduce((s, t) => s + t.amount, 0),
        total: calcItems.reduce((s, i) => s + i.total, 0),
      },
    }
    console.log('[TaxCalculation] Final result:', result)
    return result
  }

  private groupTaxesByTaxId(taxes: CalculatedItemTax[]): CalculatedDocumentTax[] {
    const map = new Map<string, CalculatedDocumentTax>()

    for (const t of taxes) {
      const existing = map.get(t.tax_id)
      if (existing) {
        existing.taxableBase += t.taxableBase
        existing.amount += t.amount
      } else {
        map.set(t.tax_id, {
          tax_id: t.tax_id,
          code: t.code,
          name: t.name,
          rate: t.rate,
          taxableBase: t.taxableBase,
          amount: t.amount,
          source: t.source,
          reason: t.reason,
        })
      }
    }

    return Array.from(map.values())
  }
}
