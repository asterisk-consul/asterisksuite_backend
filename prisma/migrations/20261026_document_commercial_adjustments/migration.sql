ALTER TABLE tenant.documents
ADD COLUMN IF NOT EXISTS commercial_adjustments JSONB;
