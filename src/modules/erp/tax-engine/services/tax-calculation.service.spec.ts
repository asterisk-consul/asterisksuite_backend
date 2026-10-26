import { TaxCalculationService } from './tax-calculation.service'

describe('TaxCalculationService', () => {
  const vatResolution = {
    settings: {
      fiscal_mode: 'COMPLETE',
      calculateVat: true,
      calculateIibb: false,
      pricesIncludeTax: false,
      showTaxBreakdown: true,
      country: 'AR',
    },
    productTaxes: new Map(),
    operationTaxes: [{
      tax_id: 'iva21',
      code: 'IVA_21',
      name: 'IVA 21%',
      rate: 21,
      tax_type: 'IVA',
      calculation_level: 'line',
      is_included_in_price: false,
      source: 'OPERATION' as const,
      reason: 'test',
    }],
  }

  it('aplica conceptos porcentuales sucesivos y recalcula IVA sobre el neto resultante', () => {
    const service = new TaxCalculationService()
    const result = service.calculateWithCommercialAdjustments(
      vatResolution,
      [{ quantity: 1, unitPrice: 2_195_480 }],
      [
        { concept: 'Descuento comercial', value_type: 'PERCENTAGE', basis: 'NET', value: 15 },
        { concept: 'Bonificación', value_type: 'PERCENTAGE', basis: 'NET', value: 10 },
      ],
    )

    expect(result.adjustments.map((adjustment) => adjustment.calculated_amount)).toEqual([
      329_322,
      186_615.8,
    ])
    expect(result.calculation.document.subtotal).toBeCloseTo(1_679_542.2, 2)
    expect(result.calculation.document.totalTaxes).toBeCloseTo(352_703.86, 2)
    expect(result.calculation.document.total).toBeCloseTo(2_032_246.06, 2)
  })

  it('interpreta un importe fijo sobre neto o bruto y baja el IVA proporcionalmente', () => {
    const service = new TaxCalculationService()
    const netDiscount = service.calculateWithCommercialAdjustments(
      vatResolution,
      [{ quantity: 1, unitPrice: 100 }],
      [{ concept: 'Bonificación neta', value_type: 'AMOUNT', basis: 'NET', value: 10 }],
    )
    const grossDiscount = service.calculateWithCommercialAdjustments(
      vatResolution,
      [{ quantity: 1, unitPrice: 100 }],
      [{ concept: 'Bonificación bruta', value_type: 'AMOUNT', basis: 'GROSS', value: 12.1 }],
    )

    expect(netDiscount.calculation.document.subtotal).toBeCloseTo(90, 2)
    expect(netDiscount.calculation.document.totalTaxes).toBeCloseTo(18.9, 2)
    expect(netDiscount.calculation.document.total).toBeCloseTo(108.9, 2)
    expect(grossDiscount.adjustments[0]?.calculated_amount).toBeCloseTo(12.1, 2)
    expect(grossDiscount.calculation.document.subtotal).toBeCloseTo(90, 2)
    expect(grossDiscount.calculation.document.total).toBeCloseTo(108.9, 2)
  })

  it('calcula IIBB a nivel documento y lo incorpora al total', () => {
    const service = new TaxCalculationService()
    const result = service.calculate({
      settings: {
        fiscal_mode: 'COMPLETE',
        calculateVat: true,
        calculateIibb: true,
        pricesIncludeTax: false,
        showTaxBreakdown: true,
        country: 'AR',
      },
      productTaxes: new Map(),
      operationTaxes: [{
        tax_id: 'iibb',
        code: 'PERC_IIBB',
        name: 'Percepción IIBB',
        rate: 3,
        tax_type: 'PERCEPCION',
        calculation_level: 'document',
        is_included_in_price: false,
        source: 'OPERATION',
        reason: 'Configuración jurisdiccional',
      }],
    }, [{ productId: 'product', quantity: 2, unitPrice: 100 }])

    expect(result.document.documentTaxes).toEqual([
      expect.objectContaining({ tax_id: 'iibb', taxableBase: 200, amount: 6 }),
    ])
    expect(result.document.totalTaxes).toBe(6)
    expect(result.document.total).toBe(206)
  })

  it('mantiene importe cero cuando la alícuota configurada es cero', () => {
    const service = new TaxCalculationService()
    const result = service.calculate({
      settings: {
        fiscal_mode: 'COMPLETE',
        calculateVat: true,
        calculateIibb: true,
        pricesIncludeTax: false,
        showTaxBreakdown: true,
        country: 'AR',
      },
      productTaxes: new Map(),
      operationTaxes: [{
        tax_id: 'iibb',
        code: 'PERC_IIBB',
        name: 'Percepción IIBB',
        rate: 0,
        tax_type: 'PERCEPCION',
        calculation_level: 'document',
        is_included_in_price: false,
        source: 'OPERATION',
        reason: 'Configuración jurisdiccional',
      }],
    }, [{ quantity: 1, unitPrice: 100 }])

    expect(result.document.documentTaxes[0]?.amount).toBe(0)
    expect(result.document.total).toBe(100)
  })
})
