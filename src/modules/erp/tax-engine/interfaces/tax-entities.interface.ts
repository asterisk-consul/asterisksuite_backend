export interface Tax {
  id: string
  code: string
  name: string
  tax_type: string
  rate: number
  is_percentage: boolean
  active: boolean
  calculation_level: string
}

export interface TaxCategory {
  id: string
  code: string
  name: string
  description: string | null
  active: boolean
}

export interface TaxCategoryTax {
  id: string
  tax_category_id: string
  tax_id: string
  is_included_in_price: boolean
  active: boolean
  tax: Tax
  tax_category: TaxCategory
}

export interface CompanyTaxSettings {
  id: string
  company_id: string
  fiscal_mode: string
  prices_include_tax: boolean
  show_tax_breakdown: boolean
  country: string
}

export interface OperationTax {
  id: string
  tax_id: string
  jurisdiction: string
  document_type: string | null
  rate: number
  min_amount: number | null
  active: boolean
  tax: Tax
}

export interface Product {
  id: string
  name: string
  sku: string | null
  tax_category_id: string | null
  tax_category?: TaxCategory | null
}
