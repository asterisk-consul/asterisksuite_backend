import type {
  Driver,
  CreateDriverInput,
  UpdateDriverInput
} from '~/modulos/logistica/transport/drivers/drivers.types'

export const useChoferesService = () => {
  const baseUrl = '/api/logistica/transport/drivers'
  const getAll = () => $fetch<Driver[]>(`${baseUrl}`)
  const getById = (id: string) => $fetch<Driver>(`${baseUrl}/${id}`)

  const create = (body: CreateDriverInput) =>
    $fetch<Driver>(`${baseUrl}`, {
      method: 'POST',
      body
    })

  const update = (id: string, body: UpdateDriverInput) =>
    $fetch<Driver>(`${baseUrl}/${id}`, {
      method: 'PATCH',
      body
    })

  const activate = (id: string) =>
    $fetch<void>(`${baseUrl}/${id}/activate`, {
      method: 'PATCH'
    })
  const desactivate = (id: string) =>
    $fetch<void>(`${baseUrl}/${id}/desactivate`, {
      method: 'PATCH'
    })

  return {
    getAll,
    getById,
    create,
    update,
    activate,
    desactivate
  }
}
