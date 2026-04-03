import type { Trip, CreateTripInput } from '../types/trips.types'

export interface SelectMenuItem {
  label: string
  value: string
}

export type StatusOption = {
  label: string
  value: string
}

export const statusOptions: StatusOption[] = [
  { label: 'Planificado', value: 'PLANNED' },
  { label: 'En progreso', value: 'IN_PROGRESS' },
  { label: 'Completado', value: 'COMPLETED' },
  { label: 'Cancelado', value: 'CANCELLED' }
]

export type TripForm = Omit<CreateTripInput, 'status'> & {
  status?: string // opcional en el form, se resuelve desde statusOption
  statusOption?: StatusOption
  business_party?: SelectMenuItem | null
}

const toDatetimeLocal = (iso?: string | null): string | null => {
  if (!iso) return null
  return iso.slice(0, 16)
}

export const clean = (value?: string) =>
  value?.trim() !== '' ? value : undefined

/**
 * Entity → Form
 */
export const mapTripToForm = (t: Trip): TripForm => ({
  reference_number: t.reference_number ?? undefined,
  week: t.week ?? undefined,
  vehicle_combination_id: t.vehicle_combination_id ?? undefined,
  origin_location_id: t.origin_location_id ?? undefined,
  destination_location_id: t.destination_location_id ?? undefined,

  departure_time: toDatetimeLocal(t.departure_time),
  arrival_time: toDatetimeLocal(t.arrival_time),
  status: t.status,
  statusOption: statusOptions.find((s) => s.value === t.status),
  kilometers: t.kilometers ?? undefined
})

/**
 * Form → DTO
 */
export const mapFormToDto = (f: TripForm): CreateTripInput => ({
  reference_number: clean(f.reference_number),

  week: f.week,

  vehicle_combination_id: f.vehicle_combination_id ?? null,
  origin_location_id: f.origin_location_id ?? null,
  destination_location_id: f.destination_location_id ?? null,

  departure_time: f.departure_time
    ? new Date(f.departure_time).toISOString()
    : null,

  arrival_time: f.arrival_time ? new Date(f.arrival_time).toISOString() : null,

  status: f.statusOption?.value ?? f.status ?? 'PLANNED',

  kilometers: f.kilometers ?? null
})
