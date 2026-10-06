ALTER TABLE tenant.products
ADD COLUMN sale_margin_percentage DECIMAL(7, 2) NOT NULL DEFAULT 0;

ALTER TABLE tenant.products
ADD COLUMN current_cost_currency_id UUID;

ALTER TABLE tenant.products
ADD CONSTRAINT products_current_cost_currency_id_fkey
FOREIGN KEY (current_cost_currency_id) REFERENCES tenant.currencies(id)
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX products_current_cost_currency_id_idx
ON tenant.products(current_cost_currency_id);
