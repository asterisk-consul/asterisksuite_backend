// types/transfer.ts

export interface Transfer {
  id: string
  fromTripId: string | null
  toTripId: string | null
  locationId: string | null
  notes: string | null
  createdAt: string

  items?: TransferItem[]
}

export interface TransferItem {
  id: string
  transferId: string
  palletId?: string | null
  deliveryNoteId?: string | null
  quantity?: number | null
}

export interface CreateTransferInput {
  fromTripId?: string
  toTripId?: string
  locationId?: string
  notes?: string
}

export interface AddTransferItemInput {
  palletId?: string
  deliveryNoteId?: string
  quantity?: number
}
