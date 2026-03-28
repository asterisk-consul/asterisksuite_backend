import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useTransferRatesService } from '~/modulos/logistica/transport/transfer-rates/transfer-rates.service'
import type {
  TransferRate,
  CreateTransferRateInput,
  UpdateTransferRateInput
} from '~/modulos/logistica/transport/transfer-rates/transfer-rates.types'

export const useTransferRatesStore = defineStore('transferRates', () => {
  const items = ref<TransferRate[]>([])
  const current = ref<TransferRate | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useTransferRatesService()

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
      const rate = await service.getById(id)
      current.value = rate
      const index = items.value.findIndex((r) => r.id === id)
      if (index !== -1) items.value[index] = rate
      return rate
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (payload: CreateTransferRateInput) => {
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

  const update = async (id: string, payload: UpdateTransferRateInput) => {
    loading.value = true
    error.value = null
    try {
      const updated = await service.update(id, payload)
      const index = items.value.findIndex((r) => r.id === id)
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

  const deactivate = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await service.deactivate(id)
      const item = items.value.find((r) => r.id === id)
      if (item) item.active = false // ✅ sin riesgo de undefined
      if (current.value?.id === id) current.value.active = false
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
      const item = items.value.find((r) => r.id === id)
      if (item) item.active = true // ✅ sin riesgo de undefined
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
    activate,
    deactivate,
    clearError
  }
})
