export interface PlannerOrder {
  id: string
  order_number: string
  origin_location_id?: string
  destination_location_id?: string
  customers?: {
    name: string
  }
}
export interface PlannerStop {
  id: string // uuid temporal
  location_id: string
  stop_order: number
  stop_type?: 'PICKUP' | 'DELIVERY'
  orders: PlannerStopOrder[]
}

export interface PlannerStopOrder {
  dispatch_order_id: string
  order_number: string
  customer_name?: string
  action: 'PICKUP' | 'DELIVERY'
}
