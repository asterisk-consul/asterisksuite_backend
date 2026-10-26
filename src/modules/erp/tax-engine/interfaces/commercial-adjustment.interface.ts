export type CommercialAdjustmentValueType = 'PERCENTAGE' | 'AMOUNT'
export type CommercialAdjustmentBasis = 'NET' | 'GROSS'

/** Input supplied by an invoice draft. Values are applied sequentially. */
export interface CommercialAdjustmentInput {
  concept: string
  value_type: CommercialAdjustmentValueType
  basis: CommercialAdjustmentBasis
  value: number
}

/** Immutable calculation snapshot stored with the document. */
export interface AppliedCommercialAdjustment extends CommercialAdjustmentInput {
  base_amount: number
  calculated_amount: number
  net_discount: number
  tax_reduction: number
  total_reduction: number
}
