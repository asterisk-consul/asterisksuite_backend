import { reactive, computed } from 'vue'
import type {
  Corridor,
  CreateCorridorDto,
  CorridorStop
} from '../types/corridors.types'
import { mapStopsToDto } from '../corridors.mappers'

export interface SelectMenuItem {
  label: string
  value: string
}

export function useCorridorForm(
  corridor?: Corridor, // ✅ uno solo, para el form
  corridors?: Ref<Corridor[]> // ✅ array, para el select
) {
  const form = reactive<CreateCorridorDto>({
    name: corridor?.name ?? '',
    origin_location_id: corridor?.origin_location_id ?? '',
    destination_location_id: corridor?.destination_location_id ?? '',
    is_template: corridor?.is_template ?? true,
    stops: mapStopsToDto(corridor?.corridorStops)
  })

  const items = computed<SelectMenuItem[]>(() =>
    (corridors?.value ?? []).map((c) => ({
      label: c.name ?? `Corredor ${c.id.slice(0, 8)}`,
      value: c.id
    }))
  )

  return {
    form,
    items
  }
}
