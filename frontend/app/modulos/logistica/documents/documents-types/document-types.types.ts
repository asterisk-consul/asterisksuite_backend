export type DocumentEntity = 'VEHICLE' | 'DRIVER'

export interface DocumentType {
  id: string
  name: string
  entity: DocumentEntity
  active: boolean
  created_at: string
}

export interface CreateDocumentTypeInput {
  name: string
  entity: DocumentEntity
}

export type UpdateDocumentTypeInput = Partial<CreateDocumentTypeInput>
