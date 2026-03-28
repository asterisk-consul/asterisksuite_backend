export interface Warehouse {
  id: string
  companyId: string
  locationId?: string | null
  name: string
  code?: string | null
  active: boolean
  createdAt: string // Date serializada desde backend (ISO string)
}

export interface CreateWarehouseInput {
  companyId: string
  name: string
  code?: string
  locationId?: string
  active?: boolean
}
export type UpdateWarehouseInput = Partial<CreateWarehouseInput>
