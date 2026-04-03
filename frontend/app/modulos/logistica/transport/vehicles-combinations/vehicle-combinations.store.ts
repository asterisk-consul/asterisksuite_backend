import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useVehicleCombinationsService } from '~/modulos/logistica/transport/vehicles-combinations/vehicles-combinations.service'
import type {
  VehicleCombination,
  CreateVehicleCombinationInput,
  UpdateVehicleCombinationInput
} from '~/modulos/logistica/transport/vehicles-combinations/types/vehicles-combinations.types'

export const useVehicleCombinationsStore = defineStore(
  'vehicleCombinations',
  () => {
    const items = ref<VehicleCombination[]>([])
    const available = ref<VehicleCombination[]>([])
    const current = ref<VehicleCombination | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    const service = useVehicleCombinationsService()

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

    const fetchActive = async (company_id: string) => {
      loading.value = true
      error.value = null
      try {
        items.value = await service.getActive(company_id)
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
        const vehicle = await service.getById(id)
        current.value = vehicle
        const index = items.value.findIndex((v) => v.id === id)
        if (index !== -1) items.value[index] = vehicle
        return vehicle
      } catch (err: any) {
        error.value = err?.data?.message || err.message
        throw err
      } finally {
        loading.value = false
      }
    }

    const create = async (payload: CreateVehicleCombinationInput) => {
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
    const fetchAvailable = async (date: string) => {
      loading.value = true
      error.value = null

      try {
        available.value = await service.getAvailable(date)
      } catch (err: any) {
        error.value = err?.data?.message || err.message
      } finally {
        loading.value = false
      }
    }

    const update = async (
      id: string,
      payload: UpdateVehicleCombinationInput
    ) => {
      loading.value = true
      error.value = null
      try {
        const updated = await service.update(id, payload)
        const index = items.value.findIndex((v) => v.id === id)
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

    const finish = async (id: string) => {
      loading.value = true
      error.value = null
      try {
        const finished = await service.finish(id)
        const index = items.value.findIndex((v) => v.id === id)
        if (index !== -1) items.value[index] = finished
        if (current.value?.id === id) current.value = finished
        return finished
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
      } catch (err: any) {
        error.value = err?.data?.message || err.message
        throw err
      } finally {
        loading.value = false
      }
    }

    const remove = async (id: string) => {
      loading.value = true
      error.value = null
      try {
        await service.remove(id)
        items.value = items.value.filter((v) => v.id !== id)
        if (current.value?.id === id) current.value = null
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
      available,
      current,
      loading,
      error,
      fetchAll,
      fetchActive,
      fetchOne,
      create,
      update,
      finish,
      activate,
      remove,
      clearError,
      fetchAvailable
    }
  }
)
