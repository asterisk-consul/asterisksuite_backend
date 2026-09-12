ALTER TABLE tenant.document_items
ADD COLUMN IF NOT EXISTS discount_percentage DECIMAL(8, 4) NOT NULL DEFAULT 0;
