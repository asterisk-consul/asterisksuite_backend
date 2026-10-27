ALTER TABLE tenant.document_types
ADD COLUMN IF NOT EXISTS accepts_commercial_adjustments BOOLEAN NOT NULL DEFAULT false;

-- Preserve the existing invoice behavior; other document types stay disabled
-- until an administrator enables the option in the document type settings.
UPDATE tenant.document_types
SET accepts_commercial_adjustments = true
WHERE category = 'INVOICE';
