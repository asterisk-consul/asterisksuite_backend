import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTripsService } from '~/modulos/logistica/transport/trips/trips.service'
import type {
  Trip,
  CreateTripInput,
  UpdateTripInput,
  TripRate,
  CreateTripRateInput,
  UpdateTripRateInput
} from '~/modulos/logistica/transport/trips/types/trips.types'

export const useTripsStore = defineStore('trips', () => {
  const items = ref<Trip[]>([])
  const current = ref<Trip | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useTripsService()

  const fetchAll = async (company_id: string) => {
    loading.value = true
    error.value = null
    try {
      items.value = await service.getAll(company_id)
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

  // trip rates
  const addRate = async (trip_id: string, payload: CreateTripRateInput) => {
    loading.value = true
    error.value = null
    try {
      const rate = await service.addRate(trip_id, payload)
      const trip = items.value.find((t) => t.id === trip_id)
      if (trip) trip.trip_rates = [...(trip.trip_rates || []), rate]
      return rate
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateRate = async (id: string, payload: UpdateTripRateInput) => {
    loading.value = true
    error.value = null
    try {
      const updated = await service.updateRate(id, payload)
      items.value.forEach((trip) => {
        trip.trip_rates?.forEach((rate) => {
          if (rate.id === id) Object.assign(rate, updated)
        })
      })
      return updated
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const removeRate = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await service.removeRate(id)
      items.value.forEach((trip) => {
        trip.trip_rates = trip.trip_rates?.filter((rate) => rate.id !== id)
      })
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
    addRate,
    updateRate,
    removeRate,
    clearError,
    updateStatus
  }
})
