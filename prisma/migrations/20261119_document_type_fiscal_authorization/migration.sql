ALTER TABLE tenant.document_types
  ADD COLUMN IF NOT EXISTS requires_fiscal_authorization BOOLEAN NULL;
