export interface TaxContext {
  issuerCompanyId: string
  issuerVatCondition?: string
  partnerId?: string
  partnerVatCondition?: string
  documentTypeId: string
  documentLetterType?: string
  currency: string
  date: string
  warehouseId?: string
  operationType: 'SALE' | 'PURCHASE'
  items: TaxContextItem[]
}

export interface TaxContextItem {
  productId?: string
  quantity: number
  unitPrice: number
}
