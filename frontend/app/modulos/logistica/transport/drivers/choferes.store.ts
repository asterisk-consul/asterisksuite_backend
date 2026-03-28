import { defineStore } from 'pinia'
import { useChoferesService } from '~/modulos/logistica/transport/drivers/choferes.service'
import type {
  Driver,
  CreateDriverInput,
  UpdateDriverInput
} from '~/modulos/logistica/transport/drivers/drivers.types'

export const useChoferesStore = defineStore('drivers', () => {
  const service = useChoferesService()

  const drivers = ref<Driver[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchAll = async (company_id: string) => {
    loading.value = true
    error.value = null

    try {
      drivers.value = await service.getAll(company_id)
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      return await service.getById(id)
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (body: CreateDriverInput) => {
    loading.value = true
    error.value = null

    try {
      const created = await service.create(body)
      drivers.value.unshift(created)
      return created
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id: string, body: UpdateDriverInput) => {
    loading.value = true
    error.value = null

    try {
      const updated = await service.update(id, body)

      const index = drivers.value.findIndex((i) => i.id === id)

      if (index !== -1) {
        drivers.value[index] = updated
      }

      return updated
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

  const desactivate = async (id: string) => {
    loading.value = true
    error.value = null

    try {
      await service.desactivate(id)
    } catch (err: any) {
      error.value = err?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    drivers,
    loading,
    error,
    fetchAll,
    fetchById,
    create,
    update,
    activate,
    desactivate
  }
})
