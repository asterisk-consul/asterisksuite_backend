-- Fix: Asignar tax_category_id correcto a todos los productos
-- Usa el ID de GRAV_21 que exista en la DB (no hardcodea IDs)

UPDATE tenant.products
SET tax_category_id = (
  SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_21' LIMIT 1
)
WHERE tax_category_id IS NULL
   OR tax_category_id != (SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_21' LIMIT 1);

SELECT id, name, tax_category_id FROM tenant.products;
