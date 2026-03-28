export interface VehicleDocument {
  id: string
  document_type_id?: string // para compatibilidad con el primer type
  expiration_date: string
  transport_document_types: {
    id?: string // del primer type
    name: string
    entity?: 'VEHICLE' // opcional, solo si viene
    active?: boolean // opcional
  }
}

export interface Vehicle {
  id: string
  company_id?: string // opcional, para compatibilidad
  plate: string
  type: string
  brand?: string | null
  model?: string | null
  year?: number // opcional, algunos records no lo tienen
  max_weight?: number
  max_volume?: number
  refrigeration: boolean
  active?: boolean
  created_at: string
  vehicleDocuments: VehicleDocument[]
}
export interface CreateVehicleDocumentInput {
  documentTypeId: string
  expirationDate?: string
}

export interface CreateVehicleInput {
  companyId: string
  type: string
  plate: string
  brand: string
  model: string
  year: number
  maxWeight: number
  maxVolume: number
  refrigeration?: boolean
  documents?: CreateVehicleDocumentInput[]
}

export interface UpdateVehicleDocumentInput {
  id?: string
  documentTypeId?: string
  expirationDate?: string
  remove?: boolean
}

export interface UpdateVehicleInput {
  plate?: string
  type?: string
  brand?: string
  model?: string
  year?: number
  maxWeight?: number
  maxVolume?: number
  refrigeration?: boolean
  active?: boolean
  documents?: UpdateVehicleDocumentInput[]
}
