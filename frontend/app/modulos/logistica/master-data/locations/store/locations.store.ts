import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocationsService } from '~/modulos/logistica/master-data/locations/locations.service'
import type {
  Location,
  CreateLocationInput,
  UpdateLocationInput
} from '~/modulos/logistica/master-data/locations/types/locations.types'

export const useLocationsStore = defineStore('locations', () => {
  const service = useLocationsService()

  const items = ref<Location[]>([])
  const current = ref<Location | null>(null)
  const loading = ref(false)

  // =========================
  // LOAD ALL
  // =========================
  const fetchAll = async () => {
    try {
      loading.value = true
      items.value = await service.getAll()
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
      const data = await service.getOne(id)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // =========================
  // CREATE
  // =========================
  const create = async (payload: CreateLocationInput) => {
    const created = await service.create(payload)
    items.value.unshift(created)
    return created
  }

  // =========================
  // UPDATE
  // =========================
  const update = async (id: string, payload: UpdateLocationInput) => {
    try {
      const updated = await service.update(id, payload)

      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1) items.value[index] = updated
      if (current.value?.id === id) current.value = updated

      return updated
    } catch (error: any) {
      console.log('Error detalle:', error.data) // 👈 mensaje exacto del backend
      throw error
    }
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
    items,
    current,
    loading,
    fetchAll,
    fetchOne,
    create,
    update,
    remove
  }
})
