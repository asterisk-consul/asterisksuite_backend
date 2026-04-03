import type {
  DispatchOrder,
  CreateDispatchOrderDto,
  UpdateDispatchOrderDto
} from '../types/dispatch-orders.types'

export const useDispatchOrdersService = () => {
  const urlBase = '/api/logistica/dispatch-orders'
  const fetch = useRequestFetch() // mantiene cookies / auth

  const create = (data: CreateDispatchOrderDto) =>
    fetch<DispatchOrder>(`${urlBase}`, {
      method: 'POST',
      body: data
    })

  const findAll = () => fetch<DispatchOrder[]>(`${urlBase}`)

  const findOne = (id: string) => fetch<DispatchOrder>(`${urlBase}/${id}`)

  const update = (id: string, data: UpdateDispatchOrderDto) =>
    fetch<DispatchOrder>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body: data
    })

  const remove = (id: string) =>
    fetch<void>(`${urlBase}/${id}`, {
      method: 'DELETE'
    })

  return {
    create,
    findAll,
    findOne,
    update,
    remove
  }
}
