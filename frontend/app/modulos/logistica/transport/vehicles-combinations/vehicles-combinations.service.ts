import type {
  VehicleCombination,
  CreateVehicleCombinationInput,
  UpdateVehicleCombinationInput
} from '~/modulos/logistica/transport/vehicles-combinations/types/vehicles-combinations.types'

export const useVehicleCombinationsService = () => {
  const getAll = () =>
    $fetch<VehicleCombination[]>(
      '/api/logistica/transport/vehicles-combinations'
    )

  const getActive = (company_id: string) =>
    $fetch<VehicleCombination[]>(
      '/api/logistica/transport/vehicles-combinations/active',
      {
        query: { company_id }
      }
    )

  const getById = (id: string) =>
    $fetch<VehicleCombination>(
      `/api/logistica/transport/vehicles-combinations/${id}`
    )

  const create = (body: CreateVehicleCombinationInput) =>
    $fetch<VehicleCombination>(
      '/api/logistica/transport/vehicles-combinations',
      {
        method: 'POST',
        body
      }
    )

  const update = (id: string, body: UpdateVehicleCombinationInput) =>
    $fetch<VehicleCombination>(
      `/api/logistica/transport/vehicles-combinations/${id}`,
      {
        method: 'PATCH',
        body
      }
    )

  const finish = (id: string) =>
    $fetch<VehicleCombination>(
      `/api/logistica/transport/vehicles-combinations/${id}/finish`,
      {
        method: 'PATCH'
      }
    )

  const activate = (id: string) =>
    $fetch<VehicleCombination>(
      `/api/logistica/transport/vehicles-combinations/${id}/activate`,
      {
        method: 'PATCH'
      }
    )
  const getAvailable = (date: string) =>
    $fetch<VehicleCombination[]>(
      '/api/logistica/transport/vehicles-combinations/available',
      {
        query: {
          date
        }
      }
    )

  const remove = (id: string) =>
    $fetch<{ deleted: boolean }>(
      `/api/logistica/transport/vehicles-combinations/${id}`,
      {
        method: 'DELETE'
      }
    )

  const historyByVehicle = (vehicle_id: string) =>
    $fetch<VehicleCombination[]>(
      `/api/logistica/transport/vehicles-combinations/vehicle/${vehicle_id}`
    )

  return {
    getAll,
    getActive,
    getById,
    create,
    update,
    finish,
    remove,
    activate,
    historyByVehicle,
    getAvailable
  }
}
