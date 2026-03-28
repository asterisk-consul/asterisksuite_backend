import type {
  CorridorStop,
  CorridorStopDto,
  CorridorWithRelations
} from './types/corridors.types'

// ==========================================
// STOP → DTO
// ==========================================

export function mapStopToDto(stop: CorridorStop): CorridorStopDto {
  return {
    location_id: stop.location_id,
    stop_order: stop.stop_order,
    stop_type: stop.stop_type
  }
}

export function mapStopsToDto(stops?: CorridorStop[]): CorridorStopDto[] {
  if (!stops) return []

  return stops.map(mapStopToDto)
}

// ==========================================
// CORRIDOR → FORM
// ==========================================

export function corridorToForm(corridor?: CorridorWithRelations) {
  if (!corridor) return null

  return {
    name: corridor.name ?? '',
    origin_location_id: corridor.origin_location_id,
    destination_location_id: corridor.destination_location_id,
    is_template: corridor.is_template,
    stops: mapStopsToDto(corridor.corridorStops)
  }
}
