// ==========================================
// LOCATION
// ==========================================

import type { Location } from '~/modulos/logistica/master-data/locations/types/locations.types'

// ==========================================
// STOPS
// ==========================================

export interface CorridorStopDto {
  location_id: string
  stop_order: number
  stop_type?: string
}

export interface CorridorStop extends CorridorStopDto {
  location?: Location
}

// ==========================================
// DTOs
// ==========================================

export interface CreateCorridorDto {
  name?: string
  origin_location_id: string
  destination_location_id: string
  is_template?: boolean
  stops: CorridorStopDto[]
}

export type UpdateCorridorDto = Partial<CreateCorridorDto>

// ==========================================
// MODELO BASE
// ==========================================

export interface Corridor {
  id: string
  company_id: string
  name?: string

  origin_location_id: string
  destination_location_id: string

  total_distance_km?: number
  estimated_minutes?: number
  origin_location?: Location
  destination_location?: Location
  corridorStops?: CorridorStop[]
  is_template: boolean
}

// ==========================================
// MODELO CON RELACIONES
// ==========================================

export interface CorridorWithRelations extends Corridor {
  origin_location?: Location
  destination_location?: Location
  corridorStops?: CorridorStop[]
}

interface BaseLocation {
  id: string
  name: string
  latitude: number
  longitude: number
}

export interface RoutePoint {
  name?: string
  address?: string | null
  city?: string | null
  province?: string | null
  type: 'origin' | 'stop' | 'destination'
}

export interface CorridorRoute {
  id: string
  name: string
  latitude: number
  longitude: number
  total_distance_km: number
  estimated_minutes: number
  route: RoutePoint[]
}
