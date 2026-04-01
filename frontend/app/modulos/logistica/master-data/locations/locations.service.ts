import type {
  Location,
  CreateLocationInput,
  UpdateLocationInput
} from '~/modulos/logistica/master-data/locations/types/locations.types'

export const useLocationsService = () => {
  const apiBase = '/api/logistica/transport/locations'
  const getAll = () => $fetch<Location[]>(`${apiBase}`)

  const getOne = (id: string) => $fetch<Location>(`${apiBase}/${id}`)

  const create = (payload: CreateLocationInput) =>
    $fetch<Location>(`${apiBase}`, {
      method: 'POST',
      body: payload
    })

  const update = (id: string, payload: UpdateLocationInput) =>
    $fetch<Location>(`${apiBase}/${id}`, {
      method: 'PATCH',
      body: payload
    })

  const remove = (id: string) =>
    $fetch<void>(`${apiBase}/${id}`, {
      method: 'DELETE'
    })

  return {
    getAll,
    getOne,
    create,
    update,
    remove
  }
}
