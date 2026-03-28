export interface TransferRate {
  id: string
  company_id: string
  name: string
  rate_type: string
  description?: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface CreateTransferRateInput {
  company_id: string
  name: string
  rate_type: string
  description?: string
  active?: boolean
}

export interface UpdateTransferRateInput extends Partial<CreateTransferRateInput> {}
