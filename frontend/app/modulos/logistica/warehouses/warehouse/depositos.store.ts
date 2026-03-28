import { defineStore } from 'pinia'
import { useDepositosService } from '~/modulos/logistica/warehouses/warehouse/depositos.service'
import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  Warehouse
} from '~/modulos/logistica/warehouses/warehouse/warehouse.types'

export const useDepositosStore = defineStore('warehouses', () => {
  const warehouses = ref<Warehouse[]>([])
  const current = ref<Warehouse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const service = useDepositosService()

  const fetchAll = async () => {
    loading.value = true
    error.value = null
    try {
      warehouses.value = await service.getAll()
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: string) => {
    loading.value = true
    try {
      current.value = await service.getById(id)
    } finally {
      loading.value = false
    }
  }

  const createWarehouse = async (data: CreateWarehouseInput) => {
    const newItem = await service.create(data)
    warehouses.value.push(newItem)
  }

  const updateWarehouse = async (id: string, data: UpdateWarehouseInput) => {
    const updated = await service.update(id, data)
    const index = warehouses.value.findIndex((w) => w.id === id)
    if (index !== -1) {
      warehouses.value[index] = updated
    }
  }

  const desactivate = async (id: string) => {
    await service.desactivate(id)
  }

  const active = async (id: string) => {
    await service.active(id)
  }

  return {
    warehouses,
    current,
    loading,
    error,
    fetchAll,
    fetchById,
    createWarehouse,
    updateWarehouse,
    desactivate,
    active
  }
})
