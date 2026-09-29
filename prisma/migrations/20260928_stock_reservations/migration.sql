ALTER TABLE tenant.sales_flow_settings
  ADD COLUMN IF NOT EXISTS reserve_stock_on_order_confirmation BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_partial_stock_reservation BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS allow_backorder_without_stock BOOLEAN NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS tenant.stock_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES tenant.warehouses(id) ON DELETE RESTRICT,
  product_id UUID NOT NULL REFERENCES tenant.products(id) ON DELETE RESTRICT,
  quantity_reserved NUMERIC(12,3) NOT NULL,
  quantity_consumed NUMERIC(12,3) NOT NULL DEFAULT 0,
  quantity_released NUMERIC(12,3) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  reservation_type VARCHAR(30) NOT NULL DEFAULT 'SALES_ORDER',
  source_type VARCHAR(30),
  source_id UUID,
  source_item_id UUID,
  party_id UUID,
  reason TEXT,
  expires_at TIMESTAMP(6),
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  deleted_at TIMESTAMP(3),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT stock_reservations_positive CHECK (quantity_reserved > 0),
  CONSTRAINT stock_reservations_balanced CHECK (quantity_consumed + quantity_released <= quantity_reserved)
);

CREATE INDEX IF NOT EXISTS idx_stock_reservation_warehouse_product_status
  ON tenant.stock_reservations(warehouse_id, product_id, status);
CREATE INDEX IF NOT EXISTS idx_stock_reservation_source
  ON tenant.stock_reservations(source_type, source_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservation_source_item
  ON tenant.stock_reservations(source_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_reservation_expiration
  ON tenant.stock_reservations(expires_at, status);

CREATE TABLE IF NOT EXISTS tenant.stock_reservation_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES tenant.stock_reservations(id) ON DELETE RESTRICT,
  document_id UUID NOT NULL,
  quantity NUMERIC(12,3) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'CONSUMED',
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reversed_at TIMESTAMP(6),
  created_by UUID
);
CREATE INDEX IF NOT EXISTS idx_stock_reservation_allocation_document
  ON tenant.stock_reservation_allocations(document_id, status);
CREATE INDEX IF NOT EXISTS idx_stock_reservation_allocation_reservation
  ON tenant.stock_reservation_allocations(reservation_id);
