import { computed, type Ref } from 'vue'
import type { Vehicle } from '~/modulos/logistica/transport/vehicles/vehicles.types'

export interface SelectItem {
  label: string
  value: string
}

export function useVehicles(vehicles: Ref<Vehicle[]>) {
  const tractorOptions = computed(() =>
    vehicles.value
      .filter((v) => v.type === 'CAMION')
      .map((v) => ({
        label: `${v.plate} ${v.brand ?? ''} ${v.model ?? ''}`,
        value: v.id
      }))
  )

  const trailerOptions = computed(() =>
    vehicles.value
      .filter((v) => v.type === 'SEMI')
      .map((v) => ({
        label: `${v.plate}`,
        value: v.id
      }))
  )

  return {
    tractorOptions,
    trailerOptions
  }
}
