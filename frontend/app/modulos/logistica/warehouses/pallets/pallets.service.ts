import type {
  Pallet,
  CreatePalletInput,
  UpdatePalletInput
} from '~/modulos/logistica/warehouses/pallets/pallets.types'

export const usePalletsService = () => {
  const getAll = (company_id: string) =>
    $fetch<Pallet[]>('/api/logistica/warehouse/pallets', {
      query: { company_id }
    })

  const getById = (id: string) =>
    $fetch<Pallet>(`/api/logistica/warehouse/pallets/${id}`)

  const create = (body: CreatePalletInput) =>
    $fetch<Pallet>('/api/logistica/warehouse/pallets', {
      method: 'POST',
      body
    })

  const update = (id: string, body: UpdatePalletInput) =>
    $fetch<Pallet>(`/api/logistica/warehouse/pallets/${id}`, {
      method: 'PATCH',
      body
    })

  const remove = (id: string) =>
    $fetch<void>(`/api/logistica/warehouse/pallets/${id}`, {
      method: 'DELETE'
    })

  return {
    getAll,
    getById,
    create,
    update,
    remove
  }
}
