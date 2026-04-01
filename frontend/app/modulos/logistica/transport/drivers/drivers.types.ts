export interface DriverDocument {
  document_type_id: string
  expiration_date?: string | null
}

export interface Driver {
  id: string

  first_name: string
  last_name: string
  document?: string
  phone?: string
  active: boolean

  driverDocuments?: {
    document_type_id: string
    expiration_date?: string | null
    transport_document_types?: {
      id: string
      name: string
    }
  }[]
}

export interface CreateDriverInput {
  first_name: string
  last_name: string
  document?: string
  phone?: string
  active?: boolean
  documents?: DriverDocument[]
}

export interface UpdateDriverInput extends Partial<CreateDriverInput> {}
