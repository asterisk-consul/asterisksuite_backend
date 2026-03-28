import type {
  DeliveryNote,
  CreateDeliveryNoteInput,
  UpdateDeliveryNoteInput,
  QueryDeliveryNoteInput
} from '~/modulos/logistica/documents/delivery-notes/delivery-notes.types'

export const useDeliveryNotesService = () => {
  const findAll = (query?: QueryDeliveryNoteInput) =>
    $fetch<DeliveryNote[]>('/api/delivery-notes', {
      query
    })

  const findOne = (id: string) =>
    $fetch<DeliveryNote>(`/api/delivery-notes/${id}`)

  const create = (payload: CreateDeliveryNoteInput) =>
    $fetch<DeliveryNote>('/api/delivery-notes', {
      method: 'POST',
      body: payload
    })

  const update = (id: string, payload: UpdateDeliveryNoteInput) =>
    $fetch<DeliveryNote>(`/api/delivery-notes/${id}`, {
      method: 'PATCH',
      body: payload
    })

  const remove = (id: string) =>
    $fetch<void>(`/api/delivery-notes/${id}`, {
      method: 'DELETE'
    })

  const confirm = (id: string) =>
    $fetch<DeliveryNote>(`/api/delivery-notes/${id}/confirm`, {
      method: 'POST'
    })

  return {
    findAll,
    findOne,
    create,
    update,
    remove,
    confirm
  }
}
