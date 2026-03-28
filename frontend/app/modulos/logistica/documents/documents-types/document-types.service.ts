import type {
  DocumentType,
  CreateDocumentTypeInput,
  DocumentEntity,
  UpdateDocumentTypeInput
} from '~/modulos/logistica/documents/documents-types/document-types.types'

export const useDocumentTypesService = () => {
  const urlBase = '/api/transport-document'
  /**
   * Obtener todos (opcional filtrar por entity)
   */
  const getAll = (entity?: DocumentEntity) =>
    $fetch<DocumentType[]>(`${urlBase}`, {
      query: entity ? { entity } : undefined
    })

  /**
   * Crear tipo de documento
   */
  const create = (body: CreateDocumentTypeInput) =>
    $fetch<DocumentType>(`${urlBase}`, {
      method: 'POST',
      body
    })

  const update = (id: string, body: UpdateDocumentTypeInput) =>
    $fetch<DocumentType>(`${urlBase}/${id}`, {
      method: 'PATCH',
      body
    })

  /**
   * Desactivar (soft delete)
   */
  const deactivate = (id: string) =>
    $fetch<void>(`${urlBase}/${id}/deactivate`, {
      method: 'PATCH'
    })
  const activate = (id: string) =>
    $fetch<void>(`${urlBase}/${id}/activate`, {
      method: 'PATCH'
    })

  return {
    getAll,
    create,
    deactivate,
    activate,
    update
  }
}
