-- Add enabled_statuses column to document_types
ALTER TABLE tenant.document_types
ADD COLUMN IF NOT EXISTS enabled_statuses JSONB;
