// types/logistica/warehouse/stock.ts

// ===============================
// Stock actual por producto
// ===============================

export interface WarehouseStockItem {
  product_id: string
  product_name?: string
  quantity: string // decimal -> string
}

// ===============================
// Movimientos
// ===============================

export interface StockMovement {
  id: string
  warehouse_id: string
  product_id: string

  movement_type: string
  direction: 'IN' | 'OUT'

  quantity: string

  reference_type?: string | null
  reference_id?: string | null

  notes?: string | null
  created_by?: string | null

  created_at: string
}

// ===============================
// Crear movimiento
// ===============================

export interface CreateStockMovementInput {
  warehouse_id: string
  product_id: string
  movement_type: string
  direction: 'IN' | 'OUT'
  quantity: string
  reference_type?: string
  reference_id?: string
  notes?: string
  created_by?: string
}
