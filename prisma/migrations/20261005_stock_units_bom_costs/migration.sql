ALTER TABLE tenant.products
  ADD COLUMN IF NOT EXISTS purchase_unit_id UUID,
  ADD COLUMN IF NOT EXISTS purchase_to_stock_factor DECIMAL(18,6) NOT NULL DEFAULT 1;

ALTER TABLE tenant.document_items
  ADD COLUMN IF NOT EXISTS purchase_unit_id UUID,
  ADD COLUMN IF NOT EXISTS unit_conversion_factor DECIMAL(18,6) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS stock_quantity DECIMAL(18,6);

UPDATE tenant.document_items
SET stock_quantity = quantity
WHERE stock_quantity IS NULL;

ALTER TABLE tenant.products
  ADD CONSTRAINT products_purchase_unit_id_fkey
  FOREIGN KEY (purchase_unit_id) REFERENCES tenant.units(id)
  ON DELETE SET NULL;

ALTER TABLE tenant.document_items
  ADD CONSTRAINT document_items_purchase_unit_id_fkey
  FOREIGN KEY (purchase_unit_id) REFERENCES tenant.units(id)
  ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS products_purchase_unit_id_idx ON tenant.products(purchase_unit_id);
CREATE INDEX IF NOT EXISTS document_items_purchase_unit_id_idx ON tenant.document_items(purchase_unit_id);
