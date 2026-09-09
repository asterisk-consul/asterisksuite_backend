import { TaxCalculationService } from './tax-calculation.service'

describe('TaxCalculationService', () => {
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
