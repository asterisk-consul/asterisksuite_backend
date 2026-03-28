import type {
  File,
  CreateFileDto,
  UpdateFileDto,
  QueryFileInput
} from '~/modulos/logistica/media/files/files.types'

export const useFilesService = () => {
  const findAll = (query?: QueryFileInput) =>
    $fetch<File[]>('/api/files', {
      query
    })

  const findOne = (id: string) => $fetch<File>(`/api/files/${id}`)

  const create = (payload: CreateFileDto) =>
    $fetch<File>('/api/files', {
      method: 'POST',
      body: payload
    })

  const update = (id: string, payload: UpdateFileDto) =>
    $fetch<File>(`/api/files/${id}`, {
      method: 'PATCH',
      body: payload
    })

  const remove = (id: string) =>
    $fetch<void>(`/api/files/${id}`, {
      method: 'DELETE'
    })

  return {
    findAll,
    findOne,
    create,
    update,
    remove
  }
}
