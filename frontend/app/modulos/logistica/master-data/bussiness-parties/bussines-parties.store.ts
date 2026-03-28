import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useBusinessPartiesService } from '~/modulos/logistica/master-data/bussiness-parties/bussines-parties.service'
import type {
  BusinessParty,
  CreateBusinessPartyInput,
  UpdateBusinessPartyInput
} from '~/modulos/logistica/master-data/bussiness-parties/types/bussines-parties.types'

export const useBusinessPartiesStore = defineStore('businessParties', () => {
  const service = useBusinessPartiesService()

  const items = ref<BusinessParty[]>([])
  const current = ref<BusinessParty | null>(null)
  const loading = ref(false)

  const currentCompanyId = ref<string | null>(null)

  // =========================
  // COMPUTEDS
  // =========================
  const activeItems = computed(() =>
    items.value.filter((i) => i.active !== false)
  )

  const clients = computed(() => items.value.filter((i) => i.type === 'client'))

  const suppliers = computed(() =>
    items.value.filter((i) => i.type === 'supplier')
  )

  // =========================
  // LOAD ALL
  // =========================
  const fetchAll = async (companyId: string) => {
    try {
      loading.value = true
      currentCompanyId.value = companyId
      items.value = await service.findAll(companyId)
    } finally {
      loading.value = false
    }
  }

  // =========================
  // LOAD ONE
  // =========================
  const fetchOne = async (id: string) => {
    try {
      loading.value = true
      const data = await service.findOne(id)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // =========================
  // CREATE
  // =========================
  const create = async (payload: CreateBusinessPartyInput) => {
    const created = await service.create(payload)

    // si corresponde a la empresa cargada
    if (payload.company_id === currentCompanyId.value) {
      items.value.unshift(created)
    }

    return created
  }

  // =========================
  // UPDATE
  // =========================
  const update = async (id: string, payload: UpdateBusinessPartyInput) => {
    const updated = await service.update(id, payload)

    const index = items.value.findIndex((i) => i.id === id)
    if (index !== -1) {
      items.value[index] = updated
    }

    if (current.value?.id === id) {
      current.value = updated
    }

    return updated
  }

  // =========================
  // DELETE
  // =========================
  const remove = async (id: string) => {
    await service.remove(id)

    items.value = items.value.filter((i) => i.id !== id)

    if (current.value?.id === id) {
      current.value = null
    }
  }

  return {
    // state
    items,
    current,
    loading,
    currentCompanyId,

    // computed
    activeItems,
    clients,
    suppliers,

    // actions
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
})
