import { computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { VehicleCombination } from '~/modulos/logistica/transport/vehicles-combinations/types/vehicles-combinations.types'

export interface SelectMenuItem {
  label: string
  value: string
}

export function useVehiclesCombinations(
  vehicleCombinations: Ref<VehicleCombination[]>
) {
  const items = computed<SelectMenuItem[]>(() =>
    vehicleCombinations.value.map((vc) => ({
      label: vc.unit_number ?? `VC-${vc.id.slice(0, 8)}`,
      value: vc.id
    }))
  )

  return { items }
}
