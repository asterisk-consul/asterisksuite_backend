import type {
  Photo,
  CreatePhotoDto
} from '~/modulos/logistica/media/photos/photos.types'

export const usePhotosService = () => {
  const create = (payload: CreatePhotoDto) =>
    $fetch<Photo>('/api/photos', {
      method: 'POST',
      body: payload
    })

  const findByEntity = (entityType: string, entityId: string) =>
    $fetch<Photo[]>(`/api/photos/${entityType}/${entityId}`)

  return {
    create,
    findByEntity
  }
}
