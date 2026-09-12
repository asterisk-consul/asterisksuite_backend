-- Migración aditiva: no modifica documentos, pagos ni saldos históricos.
CREATE TABLE IF NOT EXISTS tenant.sales_flow_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_key VARCHAR(30) NOT NULL DEFAULT 'default' UNIQUE,
  accounting_basis VARCHAR(30) NOT NULL DEFAULT 'INVOICE',
  payment_document_basis VARCHAR(30) NOT NULL DEFAULT 'INVOICE',
  require_payment_for_delivery BOOLEAN NOT NULL DEFAULT false,
  delivery_payment_percentage DECIMAL(5,2) NOT NULL DEFAULT 100,
  require_invoice_for_delivery BOOLEAN NOT NULL DEFAULT false,
  auto_create_delivery_note BOOLEAN NOT NULL DEFAULT false,
  allow_partial_delivery BOOLEAN NOT NULL DEFAULT true,
  active_from TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT sales_flow_settings_percentage_chk CHECK (delivery_payment_percentage BETWEEN 0 AND 100),
  CONSTRAINT sales_flow_settings_accounting_chk CHECK (accounting_basis IN ('INVOICE','ORDER','ORDER_THEN_INVOICE')),
  CONSTRAINT sales_flow_settings_payment_chk CHECK (payment_document_basis IN ('INVOICE','ORDER','BOTH'))
);

INSERT INTO tenant.sales_flow_settings (settings_key)
VALUES ('default')
ON CONFLICT (settings_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS tenant.commercial_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  root_document_id UUID NOT NULL UNIQUE,
  party_id UUID,
  currency_code VARCHAR(10),
  accounting_basis VARCHAR(30) NOT NULL,
  payment_document_basis VARCHAR(30) NOT NULL,
  require_payment_for_delivery BOOLEAN NOT NULL,
  delivery_payment_percentage DECIMAL(5,2) NOT NULL,
  require_invoice_for_delivery BOOLEAN NOT NULL,
  auto_create_delivery_note BOOLEAN NOT NULL,
  allow_partial_delivery BOOLEAN NOT NULL,
  ordered_total DECIMAL(15,2) NOT NULL,
  invoiced_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  paid_total DECIMAL(15,2) NOT NULL DEFAULT 0,
  delivery_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  released_at TIMESTAMP(6),
  delivery_note_id UUID,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by UUID,
  updated_by UUID,
  CONSTRAINT commercial_operations_root_fk FOREIGN KEY (root_document_id) REFERENCES tenant.documents(id) ON DELETE RESTRICT,
  CONSTRAINT commercial_operations_party_fk FOREIGN KEY (party_id) REFERENCES tenant.business_parties(id) ON DELETE SET NULL
);

ALTER TABLE tenant.documents ADD COLUMN IF NOT EXISTS commercial_operation_id UUID;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'documents_commercial_operation_fk'
      AND conrelid = 'tenant.documents'::regclass
  ) THEN
    ALTER TABLE tenant.documents
      ADD CONSTRAINT documents_commercial_operation_fk
      FOREIGN KEY (commercial_operation_id) REFERENCES tenant.commercial_operations(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS commercial_operations_delivery_status_idx ON tenant.commercial_operations(delivery_status);
CREATE INDEX IF NOT EXISTS commercial_operations_party_id_idx ON tenant.commercial_operations(party_id);
CREATE INDEX IF NOT EXISTS documents_commercial_operation_id_idx ON tenant.documents(commercial_operation_id);

COMMENT ON TABLE tenant.commercial_operations IS 'Sólo operaciones nuevas; no recalcula ni reemplaza saldos históricos.';
