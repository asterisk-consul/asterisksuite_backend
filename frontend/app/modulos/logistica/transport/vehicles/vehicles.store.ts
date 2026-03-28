import { defineStore } from 'pinia'
import { useVehiclesService } from '~/modulos/logistica/transport/vehicles/vehicles.service'
import type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput
} from '~/modulos/logistica/transport/vehicles/vehicles.types'

export const useVehiclesStore = defineStore('vehicles', () => {
  // ================= STATE =================
  const items = ref<Vehicle[]>([])
  const current = ref<Vehicle | null>(null)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useVehiclesService()

  // ================= GETTERS =================

  const activeItems = computed(() => items.value.filter((v) => v.active))

  const getById = (id: string) =>
    computed(() => items.value.find((v) => v.id === id) ?? null)

  // ================= ACTIONS =================

  const fetchAll = async (companyId: string) => {
    loading.value = true
    error.value = null

    try {
      items.value = await service.getAll(companyId)
    } catch (err: any) {
      error.value = err?.data?.message || err.message
    } finally {
      loading.value = false
    }
  }

  const fetchOne = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      const vehicle = await service.getOne(id)
      current.value = vehicle

      const index = items.value.findIndex((v) => v.id === id)
      if (index !== -1) {
        items.value[index] = vehicle
      }

      return vehicle
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateVehicleInput) => {
    loading.value = true
    error.value = null

    try {
      const created = await service.create(payload)
      items.value.unshift(created)
      return created
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, payload: UpdateVehicleInput) => {
    loading.value = true
    error.value = null

    try {
      const updated = await service.update(id, payload)

      const index = items.value.findIndex((v) => v.id === id)
      if (index !== -1) {
        items.value[index] = updated
      }

      if (current.value?.id === id) {
        current.value = updated
      }

      return updated
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deactivate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await service.deactivate(id)

      const vehicle = items.value.find((v) => v.id === id)
      if (vehicle) {
        vehicle.active = false
      }

      if (current.value?.id === id) {
        current.value.active = false
      }
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const activate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await service.activate(id)

      const vehicle = items.value.find((v) => v.id === id)
      if (vehicle) {
        vehicle.active = true
      }
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const setCurrent = (id: string | null) => {
    current.value = id ? (items.value.find((v) => v.id === id) ?? null) : null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // state
    items,
    current,
    loading,
    error,

    // getters
    activeItems,
    getById,

    // actions
    fetchAll,
    fetchOne,
    create,
    update,
    deactivate,
    activate,
    setCurrent,
    clearError
  }
})
