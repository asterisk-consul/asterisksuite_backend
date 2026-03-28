// types/logistica/warehouse/pallets.ts

export interface Pallet {
  id: string
  company_id: string
  code: string

  warehouse_id?: string | null

  status: string

  created_by?: string | null

  active: boolean
  created_at: string
  updated_at?: string | null
}

export interface CreatePalletInput {
  company_id: string
  code: string
  warehouse_id?: string
  status: string
  created_by?: string
}

export type UpdatePalletInput = Partial<CreatePalletInput>
