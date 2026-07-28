-- Crear productos de prueba con tax_category_id correcto (usando subqueries)

INSERT INTO tenant.products (id, name, sku, tax_category_id, active, created_at)
VALUES
  ('f4a9ec9c-cdde-4563-a8e5-85c66def6a6c', 'Prod Test IVA 21', 'TEST-IVA21', (SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_21' LIMIT 1), true, NOW()),
  ('b7f71351-d9a2-4cc4-a73c-283e76196565', 'Prod Test IVA 10.5', 'TEST-IVA105', (SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_105' LIMIT 1), true, NOW()),
  ('425faaa2-9774-4fbe-96bb-15c58ddca74b', 'Prod Test IVA 27', 'TEST-IVA27', (SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_27' LIMIT 1), true, NOW()),
  ('817cfb23-4f92-46e6-9f5e-97fc91774224', 'Prod Test Exento', 'TEST-EXENTO', (SELECT id FROM tenant.tax_categories WHERE code = 'EXENTO' LIMIT 1), true, NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sku = EXCLUDED.sku,
  tax_category_id = EXCLUDED.tax_category_id,
  active = true;

-- Verificar
SELECT id, name, sku, tax_category_id FROM tenant.products WHERE sku LIKE 'TEST-%';
