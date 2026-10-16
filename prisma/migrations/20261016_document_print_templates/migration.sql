CREATE TABLE IF NOT EXISTS tenant.document_print_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  category VARCHAR(20) NOT NULL,
  title VARCHAR(120) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(6),
  created_by UUID,
  updated_by UUID,
  CONSTRAINT document_print_templates_category_check CHECK (category IN ('QUOTE', 'ORDER'))
);

CREATE INDEX IF NOT EXISTS document_print_templates_category_active_idx
  ON tenant.document_print_templates(category, active);

ALTER TABLE tenant.presupuesto_documents
  ADD COLUMN IF NOT EXISTS product_specifications TEXT;
