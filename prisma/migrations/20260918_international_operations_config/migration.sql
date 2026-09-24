-- International operations: settings table + customs fields + transit warehouse
-- 1. Settings table (singleton row per tenant, settings_key = 'default')
CREATE TABLE IF NOT EXISTS tenant.international_operation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key VARCHAR(30) UNIQUE NOT NULL DEFAULT 'default',
  container_fields JSONB NOT NULL DEFAULT '{}',
  operation_fields JSONB NOT NULL DEFAULT '{}',
  operation_statuses JSONB,
  container_statuses JSONB,
  created_at TIMESTAMP(6) NOT NULL DEFAULT now(),
  updated_at TIMESTAMP(6),
  created_by UUID,
  updated_by UUID
);

-- 2. Customs/broker reference fields on operations
ALTER TABLE tenant.international_operations
  ADD COLUMN IF NOT EXISTS customs_broker_op_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS sim_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS supplier_purchase_order VARCHAR(100);

-- 3. Transit warehouse link on containers
ALTER TABLE tenant.international_containers
  ADD COLUMN IF NOT EXISTS transit_warehouse_id UUID;

-- 4. Virtual warehouse flag
ALTER TABLE tenant.warehouses
  ADD COLUMN IF NOT EXISTS is_virtual BOOLEAN NOT NULL DEFAULT FALSE;
