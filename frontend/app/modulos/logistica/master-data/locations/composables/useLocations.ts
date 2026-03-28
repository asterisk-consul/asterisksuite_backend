import { computed, type Ref } from 'vue'
import type { Location } from '~/modulos/logistica/master-data/locations/types/locations.types'

export interface SelectItemMenu {
  label: string
  value: string
}

export function useLocations(locations: Ref<Location[]>) {
  const items = computed<SelectItemMenu[]>(() =>
    locations.value.map((location) => {
      const city = location.city ?? ''
      const address = location.address ?? ''

      const label = address ? `${address} - ${city}` : city

      return {
        label,
        value: location.id
      }
    })
  )

  return {
    items
  }
}
