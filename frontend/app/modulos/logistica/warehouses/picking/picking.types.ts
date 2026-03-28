// types/logistica/warehouse/picking.ts

// ===============================
// Picking
// ===============================

export interface PickingItemInput {
  product_id: string
  quantity: string // decimal viene como string
}

export interface CreatePickingInput {
  warehouse_id: string
  company_id: string
  created_by: string
  items: PickingItemInput[]
}

// ===============================
// Transfer pallet
// ===============================

export interface TransferPalletInput {
  pallet_id: string
  from_warehouse_id: string
  to_warehouse_id: string
  user_id: string
}

// ===============================
// Respuesta (puedes ajustarla)
// ===============================

export interface PickingResponse {
  id: string
  warehouse_id: string
  company_id: string
  created_by: string
  created_at: string
}
