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

-- Inicializa el costo de productos existentes desde su última factura de
-- compra confirmada. No usa product_price porque representa precio de venta.
WITH latest_purchase AS (
  SELECT DISTINCT ON (di.product_id)
    di.product_id,
    di.unit_price / GREATEST(di.unit_conversion_factor, 0.000001) AS unit_cost,
    c.id AS currency_id,
    d.date,
    di.created_at
  FROM tenant.document_items di
  JOIN tenant.documents d ON d.id = di.document_id
  JOIN tenant.document_types dt ON dt.id = d.document_type_id
  LEFT JOIN tenant.currencies c ON c.code = COALESCE(di.currency_code, d.currency_code)
  WHERE di.product_id IS NOT NULL
    AND di.variant_id IS NULL
    AND di.deleted_at IS NULL
    AND d.deleted_at IS NULL
    AND dt.deleted_at IS NULL
    AND dt.direction = -1
    AND dt.category = 'INVOICE'
    AND d.status IN (1, 2)
  ORDER BY di.product_id, d.date DESC, di.created_at DESC
)
UPDATE tenant.products p
SET current_cost = lp.unit_cost,
    current_cost_currency_id = lp.currency_id,
    cost_source = 'PURCHASE',
    last_cost_calculated_at = NOW(),
    updated_at = NOW()
FROM latest_purchase lp
WHERE p.id = lp.product_id;
