import type { Location } from '~/modulos/logistica/master-data/locations/types/locations.types'
export interface TripStopOrder {
  dispatch_order_id: string
  order_number?: string | null
  customer_name?: string | null
  action: 'PICKUP' | 'DELIVERY'
  origin_location_id?: string | null // agregado
  destination_location_id?: string | null // agregado
}

export interface TripStop {
  id: string
  location_id: string
  stop_order: number
  stop_type?: string
  trip_orders: TripStopOrder[]
}

export interface Trip {
  id: string
  reference_number?: string | null
  week?: string | null
  vehicle_combination_id?: string | null
  origin_location_id?: string | null
  destination_location_id?: string | null
  departure_time?: string
  arrival_time?: string
  status: string
  kilometers?: number | null
  created_at: string

  // relaciones
  trip_stops?: TripStop[]
  vehicle_combination?: VehicleCombination
  unique_orders: {
    dispatch_order_id: string
    order_number?: string | null
    customer_name?: string | null
    action: 'PICKUP' | 'DELIVERY'
    origin_location_id?: string | null
    destination_location_id?: string | null
  }[]

  // 🔹 agregar campos de relación con ubicación
  locations_trips_origin_location_idTolocations?: Location
  locations_trips_destination_location_idTolocations?: Location
}

export interface VehicleCombination {
  id: string
  unit_number?: string | null
}

export interface CreateTripInput {
  reference_number?: string
  week?: string | null
  vehicle_combination_id?: string | null
  origin_location_id?: string | null
  destination_location_id?: string | null
  departure_time?: string | null
  arrival_time?: string | null
  status: string
  kilometers?: number | null
}

export interface UpdateTripInput extends Partial<CreateTripInput> {}

export interface AssignOrdersDto {
  stops: {
    location_id: string
    stop_order: number
    stop_type?: string
    orders: {
      dispatch_order_id: string
      order_number?: string | null
      customer_name?: string | null
      action: 'PICKUP' | 'DELIVERY'
      origin_location_id?: string | null
      destination_location_id?: string | null
    }[]
  }[]
}
