import type {
  Warehouse,
  CreateWarehouseInput,
  UpdateWarehouseInput
} from '~/modulos/logistica/warehouses/warehouse/warehouse.types' // services/warehouse.service.ts

export const useDepositosService = () => {
  const urlBase = '/api/logistica/warehouse/warehouses'
  const getAll = () => $fetch<Warehouse[]>(`${urlBase}`)

  const getById = (id: string) => $fetch<Warehouse>(`${urlBase}/${id}`)

  const create = (body: CreateWarehouseInput) =>
    $fetch<Warehouse>(`${urlBase}`, {
      method: 'POST',
      body
    })

  const update = (id: string, body: UpdateWarehouseInput) =>
    $fetch<Warehouse>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body
    })

  const desactivate = (id: string) =>
    $fetch<Warehouse>(`${urlBase}/${id}/desactivate`, {
      method: 'PATCH'
    })
  const active = (id: string) =>
    $fetch<Warehouse>(`${urlBase}/${id}/activate`, {
      method: 'PATCH'
    })

  return { getAll, getById, create, update, desactivate, active }
}
