import { BadRequestException, Injectable } from '@nestjs/common'
import type { TaxResolutionResult, TaxCalculationResult, CalculatedItem, CalculatedItemTax, CalculatedDocumentTax } from '../interfaces/tax-result.interface'
import type { TaxContextItem } from '../interfaces/tax-context.interface'
import type { AppliedCommercialAdjustment, CommercialAdjustmentInput } from '../interfaces/commercial-adjustment.interface'

@Injectable()
export class TaxCalculationService {
  calculateWithCommercialAdjustments(
    resolution: TaxResolutionResult,
    sourceItems: TaxContextItem[],
    adjustments: CommercialAdjustmentInput[] = [],
  ): { calculation: TaxCalculationResult; adjustments: AppliedCommercialAdjustment[]; originalSubtotal: number } {
    let items = sourceItems.map((item) => ({ ...item }))
    let calculation = this.calculate(resolution, items)
    const originalSubtotal = calculation.document.subtotal
    const applied: AppliedCommercialAdjustment[] = []

    for (const adjustment of adjustments) {
      const concept = String(adjustment.concept ?? '').trim()
      const value = Number(adjustment.value)
      const valueType = String(adjustment.value_type ?? '').toUpperCase()
      const basis = String(adjustment.basis ?? '').toUpperCase()

      if (!concept) throw new BadRequestException('Cada concepto de descuento necesita una descripción.')
      if (!Number.isFinite(value) || value <= 0) {
        throw new BadRequestException(`El importe de "${concept}" debe ser mayor que cero.`)
      }
      if (!['PERCENTAGE', 'AMOUNT'].includes(valueType)) {
        throw new BadRequestException(`El tipo de cálculo de "${concept}" no es válido.`)
      }
      if (!['NET', 'GROSS'].includes(basis)) {
        throw new BadRequestException(`La base de cálculo de "${concept}" no es válida.`)
      }
      if (valueType === 'PERCENTAGE' && value > 100) {
        throw new BadRequestException(`El porcentaje de "${concept}" no puede superar el 100%.`)
      }

      const before = calculation.document
      const baseAmount = basis === 'NET' ? before.subtotal : before.total
      if (baseAmount <= 0) {
        throw new BadRequestException(`No hay una base disponible para aplicar "${concept}".`)
      }

      const requestedAmount = valueType === 'PERCENTAGE'
        ? baseAmount * value / 100
        : value
      if (requestedAmount > baseAmount + 0.005) {
        throw new BadRequestException(`"${concept}" no puede superar la base de cálculo.`)
      }

      // Distribute the adjustment proportionally across lines while retaining
      // sub-cent unit-price precision inside the calculation. Persisted line
      // amounts are rounded to cents later; rounding each unit price here made
      // fixed discounts miss the amount entered by the user.
      const reductionRatio = Math.min(1, requestedAmount / baseAmount)
      items = items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice * (1 - reductionRatio),
      }))
      calculation = this.calculate(resolution, items)

      if (valueType === 'AMOUNT') {
        // Correct floating-point drift so an entered fixed amount remains exact
        // after proportional allocation, including line and document taxes.
        for (let attempt = 0; attempt < 2; attempt++) {
          const actualReduction = basis === 'NET'
            ? before.subtotal - calculation.document.subtotal
            : before.total - calculation.document.total
          const residual = requestedAmount - actualReduction
          if (Math.abs(residual) < 0.000001) break

          let candidateIndex = -1
          for (let index = items.length - 1; index >= 0; index--) {
            if (items[index].quantity > 0 && (items[index].unitPrice > 0 || residual < 0)) {
              candidateIndex = index
              break
            }
          }
          if (candidateIndex < 0) break

          const candidate = items[candidateIndex]
          const lineTaxes = [
            ...(resolution.productTaxes.get(candidate.productId ?? '') ?? []),
            ...resolution.operationTaxes,
          ].filter((tax) => tax.calculation_level.toLowerCase() === 'line')
          const includedFactor = Math.max(0.000001, 1 - lineTaxes
            .filter((tax) => tax.is_included_in_price)
            .reduce((sum, tax) => sum + tax.rate / (100 + tax.rate), 0))
          const priceFactor = basis === 'NET'
            ? includedFactor
            : 1
              + lineTaxes.filter((tax) => !tax.is_included_in_price)
                .reduce((sum, tax) => sum + tax.rate / 100, 0)
              + includedFactor * resolution.operationTaxes
                .filter((tax) => tax.calculation_level.toLowerCase() === 'document')
                .reduce((sum, tax) => sum + tax.rate / 100, 0)
          const nextItems = [...items]
          nextItems[candidateIndex] = {
            ...candidate,
            unitPrice: Math.max(0, candidate.unitPrice - residual / (candidate.quantity * priceFactor)),
          }
          items = nextItems
          calculation = this.calculate(resolution, items)
        }
      }

      const after = calculation.document
      const selectedBaseAfter = basis === 'NET' ? after.subtotal : after.total

      applied.push({
        concept,
        value_type: valueType as CommercialAdjustmentInput['value_type'],
        basis: basis as CommercialAdjustmentInput['basis'],
        value,
        base_amount: round2(baseAmount),
        calculated_amount: round2(baseAmount - selectedBaseAfter),
        net_discount: round2(before.subtotal - after.subtotal),
        tax_reduction: round2(before.totalTaxes - after.totalTaxes),
        total_reduction: round2(before.total - after.total),
      })
    }

    return { calculation, adjustments: applied, originalSubtotal }
  }

  calculate(resolution: TaxResolutionResult, items: TaxContextItem[]): TaxCalculationResult {
    const calcItems: CalculatedItem[] = []
    const allItemTaxes: CalculatedItemTax[] = []

    for (const item of items) {
      const productTaxes = resolution.productTaxes.get(item.productId ?? '') ?? []
      const allTaxes = [...productTaxes, ...resolution.operationTaxes]

      const price = item.quantity * item.unitPrice
      const itemTaxes: CalculatedItemTax[] = []
      let addedTaxes = 0
      let includedTaxes = 0

      for (const tax of allTaxes) {
        if (tax.calculation_level !== 'line') continue

        if (tax.is_included_in_price) {
          const amount = price - price / (1 + tax.rate / 100)
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
      calcItems.push(calcItem)

      allItemTaxes.push(...itemTaxes)
    }

    const documentTaxes = this.groupTaxesByTaxId(allItemTaxes)
    const documentTaxableBase = calcItems.reduce((s, i) => s + i.taxableBase, 0)
    const documentLevelTaxes = resolution.operationTaxes
      .filter(tax => tax.calculation_level.toLowerCase() === 'document')
      .map(tax => ({
        tax_id: tax.tax_id,
        code: tax.code,
        name: tax.name,
        rate: tax.rate,
        taxableBase: documentTaxableBase,
        amount: documentTaxableBase * (tax.rate / 100),
        source: tax.source,
        reason: tax.reason,
      }))
    documentTaxes.push(...documentLevelTaxes)
    const documentLevelTaxTotal = documentLevelTaxes.reduce((sum, tax) => sum + tax.amount, 0)

    return {
      document: {
        settings: resolution.settings,
        items: calcItems,
        documentTaxes,
        subtotal: calcItems.reduce((s, i) => s + i.price, 0),
        exemptAmount: 0,
        taxableBase: calcItems.reduce((s, i) => s + i.taxableBase, 0),
        totalTaxes: allItemTaxes.reduce((s, t) => s + t.amount, 0) + documentLevelTaxTotal,
        total: calcItems.reduce((s, i) => s + i.total, 0) + documentLevelTaxTotal,
      },
    }
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

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
