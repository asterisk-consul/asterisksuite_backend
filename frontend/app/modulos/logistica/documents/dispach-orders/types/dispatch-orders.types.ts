export interface DispatchOrder {
  id: string
  order_number: string
  status: string
  requires_stock?: boolean

  customer_id?: string
  origin_location_id?: string
  destination_location_id?: string

  planned_date?: string

  created_by: string

  // relaciones (según tu include de Prisma)
  customers?: any
  origin_location?: any
  destination_location?: any
  trips?: any[]

  created_at?: string
  updated_at?: string
}

export interface CreateDispatchOrderDto {
  order_number: string
  status?: string
  requires_stock?: boolean
  customer_id?: string
  origin_location_id?: string
  destination_location_id?: string
  planned_date?: string
}

export type UpdateDispatchOrderDto = Partial<CreateDispatchOrderDto>
