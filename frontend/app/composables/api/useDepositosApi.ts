import type {
  CreateWarehouseInput,
  UpdateWarehouseInput,
  Warehouse
} from '~/modulos/logistica/warehouses/warehouse/warehouse.types'

export const useDepositosApi = () => {
  const getAll = () =>
    useFetch<Warehouse[]>('/api/logistica/warehouse/warehouses')

  const getById = (id: string) =>
    useFetch<Warehouse>(`/api/logistica/warehouse/warehouses/${id}`)

  const create = (data: CreateWarehouseInput) =>
    useFetch<Warehouse>('/api/logistica/warehouse/warehouses', {
      method: 'POST',
      body: data
    })

  const update = (id: string, data: UpdateWarehouseInput) =>
    useFetch<Warehouse>(`/api/logistica/warehouse/warehouses/${id}`, {
      method: 'PATCH',
      body: data
    })

  const remove = (id: string) =>
    useFetch<void>(`/api/logistica/warehouse/warehouses/${id}`, {
      method: 'DELETE' as any
    })

  return { getAll, getById, create, update, remove }
}
