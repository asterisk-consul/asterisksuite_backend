import type { CompanyTaxSettings } from './tax-entities.interface'

export interface TaxResolutionResult {
  settings: ResolvedTaxSettings
  productTaxes: Map<string, ResolvedTax[]>
  operationTaxes: ResolvedTax[]
}

export interface ResolvedTaxSettings {
  fiscal_mode: string
  calculateVat: boolean
  calculateIibb: boolean
  pricesIncludeTax: boolean
  showTaxBreakdown: boolean
  country: string
}

export interface ResolvedTax {
  tax_id: string
  code: string
  name: string
  rate: number
  tax_type: string
  calculation_level: string
  is_included_in_price: boolean
  source: 'PRODUCT' | 'OPERATION'
  reason: string
}

export interface TaxCalculationResult {
  document: CalculatedDocument
}

export interface CalculatedDocument {
  settings: ResolvedTaxSettings
  items: CalculatedItem[]
  documentTaxes: CalculatedDocumentTax[]
  subtotal: number
  exemptAmount: number
  taxableBase: number
  totalTaxes: number
  total: number
}

export interface CalculatedItem {
  productId?: string
  quantity: number
  unitPrice: number
  price: number
  exemptAmount: number
  taxableBase: number
  taxes: CalculatedItemTax[]
  totalTaxes: number
  total: number
}

export interface CalculatedItemTax {
  tax_id: string
  code: string
  name: string
  rate: number
  amount: number
  taxableBase: number
  isIncludedInPrice: boolean
  source: 'PRODUCT' | 'OPERATION'
  reason: string
}

export interface CalculatedDocumentTax {
  tax_id: string
  code: string
  name: string
  rate: number
  taxableBase: number
  amount: number
  source: 'PRODUCT' | 'OPERATION'
  reason: string
}
