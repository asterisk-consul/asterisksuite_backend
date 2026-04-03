import type {
  Trip,
  CreateTripInput,
  UpdateTripInput,
  AssignOrdersDto
} from '~/modulos/logistica/transport/trips/types/trips.types'

export const useTripsService = () => {
  const base = '/api/logistica/transport/trips'

  const getAll = () => $fetch<Trip[]>(base)

  const getById = (id: string) => $fetch<Trip>(`${base}/${id}`)

  const create = (body: CreateTripInput) =>
    $fetch<Trip>(base, { method: 'POST', body })

  const update = (id: string, body: UpdateTripInput) =>
    $fetch<Trip>(`${base}/${id}`, { method: 'PATCH', body })

  const remove = (id: string) =>
    $fetch<{ deleted: boolean }>(`${base}/${id}`, { method: 'DELETE' })

  const updateStatus = async (id: string, status: string) => {
    // Añade un log aquí para ver la URL final exacta
    const url = `${base}/${id}/status/${status}`
    return await $fetch<Trip>(url, {
      method: 'PATCH'
    })
  }

  const assignOrders = (tripId: string, body: AssignOrdersDto) =>
    $fetch<Trip>(`${base}/${tripId}/assign-orders`, {
      method: 'POST',
      body
    })
  // rates

  return {
    getAll,
    getById,
    create,
    update,
    remove,
    updateStatus,
    assignOrders
  }
}
