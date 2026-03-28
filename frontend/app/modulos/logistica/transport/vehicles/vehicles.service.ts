import type {
  Vehicle,
  CreateVehicleInput,
  UpdateVehicleInput
} from '~/modulos/logistica/transport/vehicles/vehicles.types'

export const useVehiclesService = () => {
  const baseUrl = '/api/logistica/transport/vehicles'
  const getAll = (companyId: string) =>
    $fetch<Vehicle[]>(`${baseUrl}`, {
      query: { companyId }
    })

  const getOne = (id: string) => $fetch<Vehicle>(`${baseUrl}/${id}`)

  const create = (body: CreateVehicleInput) =>
    $fetch<Vehicle>(`${baseUrl}`, {
      method: 'POST',
      body
    })

  const update = (id: string, body: UpdateVehicleInput) =>
    $fetch<Vehicle>(`${baseUrl}/${id}`, {
      method: 'PATCH',
      body
    })

  const deactivate = (id: string) =>
    $fetch<void>(`${baseUrl}/${id}/deactivate`, {
      method: 'PATCH'
    })

  const activate = (id: string) =>
    $fetch<void>(`${baseUrl}/${id}/active`, {
      method: 'PATCH'
    })

  return {
    getAll,
    getOne,
    create,
    update,
    deactivate,
    activate
  }
}
