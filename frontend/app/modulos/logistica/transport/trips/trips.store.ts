import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTripsService } from '~/modulos/logistica/transport/trips/trips.service'
import type {
  Trip,
  CreateTripInput,
  UpdateTripInput,
  AssignOrdersDto
} from '~/modulos/logistica/transport/trips/types/trips.types'

export const useTripsStore = defineStore('trips', () => {
  const items = ref<Trip[]>([])
  const current = ref<Trip | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useTripsService()

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      items.value = await service.getAll()
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
      const trip = await service.getById(id)
      current.value = trip
      const index = items.value.findIndex((t) => t.id === id)
      if (index !== -1) items.value[index] = trip
      return trip
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateTripInput) => {
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

  const update = async (id: string, payload: UpdateTripInput) => {
    loading.value = true
    error.value = null
    try {
      const updated = await service.update(id, payload)
      const index = items.value.findIndex((t) => t.id === id)
      if (index !== -1) items.value[index] = updated
      if (current.value?.id === id) current.value = updated
      return updated
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const updateStatus = async (id: string, status: Trip['status']) => {
    error.value = null

    const trip = items.value.find((t) => t.id === id)
    if (!trip) return

    const prev = trip.status
    trip.status = status // optimistic update
    try {
      await service.updateStatus(id, status)
    } catch (err: any) {
      trip.status = prev // rollback
      error.value = err?.data?.message || err.message
      throw err
    }
  }

  const remove = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await service.remove(id)
      items.value = items.value.filter((t) => t.id !== id)
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }
  const assignOrders = async (tripId: string, payload: AssignOrdersDto) => {
    loading.value = true
    error.value = null

    try {
      await service.assignOrders(tripId, payload)

      // 🔥 MUY IMPORTANTE → refrescar trip actualizado
      const updated = await service.getById(tripId)

      // actualizar lista
      const index = items.value.findIndex((t) => t.id === tripId)
      if (index !== -1) items.value[index] = updated

      // actualizar current
      if (current.value?.id === tripId) {
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
  const clearError = () => {
    error.value = null
  }

  return {
    items,
    current,
    loading,
    error,
    fetchAll,
    fetchOne,
    create,
    update,
    remove,
    clearError,
    assignOrders,
    updateStatus
  }
})
