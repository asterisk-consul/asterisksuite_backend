import type {
  Corridor,
  CreateCorridorDto,
  UpdateCorridorDto,
  CorridorRoute
} from './types/corridors.types'

export const useCorridorsService = () => {
  const urlBase = '/api/logistica/transport/corridors'
  const fetch = useRequestFetch() // ← propaga cookies automáticamente

  const create = (data: CreateCorridorDto) =>
    fetch<Corridor>(`${urlBase}`, {
      method: 'POST',
      body: data
    })

  const findAll = () => fetch<Corridor[]>(`${urlBase}`)

  const findTemplates = () => fetch<Corridor[]>(`${urlBase}/templates`)

  const findOne = (id: string) => fetch<Corridor>(`${urlBase}/${id}`)

  const getRoute = (id: string) =>
    fetch<CorridorRoute>(`${urlBase}/${id}/route`)

  const update = (id: string, data: UpdateCorridorDto) =>
    fetch<Corridor>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body: data
    })

  const remove = (id: string) =>
    fetch<void>(`${urlBase}/${id}`, {
      method: 'DELETE'
    })

  return { create, findAll, findTemplates, findOne, getRoute, update, remove }
}
