import { computed, type Ref } from 'vue'
import type { BusinessParty } from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'

export interface SelectMenuItem {
  label: string
  value: string
}

export function useBusinessParties(businessParties: Ref<BusinessParty[]>) {
  const items = computed<SelectMenuItem[]>(() =>
    businessParties.value.map((party) => ({
      label: party.name,
      value: party.id
    }))
  )

  return {
    items
  }
}
