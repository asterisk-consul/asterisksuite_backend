import { computed } from 'vue'
import type { Trip } from '~/modulos/logistica/transport/trips/types/trips.types'
export interface SelectMenuItem {
  label: string
  value: string
}

export function useTripForm(trips?: Ref<Trip[]>) {
  const buildItems = (filter?: (t: Trip) => boolean) =>
    computed<SelectMenuItem[]>(() =>
      (trips?.value ?? [])
        .filter((t) => (filter ? filter(t) : true))
        .map((t) => ({
          label: `${t.reference_number} - ${t.week}`,
          value: t.id
        }))
    )

  const items = buildItems()
  const plannedItems = buildItems((t) => t.status === 'PLANNED')

  return {
    items,
    plannedItems
  }
}
