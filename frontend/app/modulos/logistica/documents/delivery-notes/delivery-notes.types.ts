export interface DeliveryNote {
  id: string
  companyId: string
  type: 'OUTBOUND' | 'INBOUND'
  pointOfSale: string
  partyId: string
  pickingOrderId?: string
  tripId?: string
  number?: string
  status?: string
  created_at?: string
  updated_at?: string
}

export interface QueryDeliveryNoteInput {
  company_id?: string
  status?: string
  type?: string
  number?: string
}

export type CreateDeliveryNoteInput = Omit<
  DeliveryNote,
  'id' | 'number' | 'status' | 'created_at' | 'updated_at'
>

export type UpdateDeliveryNoteInput = Partial<CreateDeliveryNoteInput>
