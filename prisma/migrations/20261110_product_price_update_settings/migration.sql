ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "update_sales_party_prices" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "update_sales_global_prices" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "update_purchases_party_prices" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "update_purchases_global_costs" BOOLEAN NOT NULL DEFAULT true;

INSERT INTO tenant.permissions (id, code, description, active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'product-prices.read', 'Ver precios generales y acordados', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'product-prices.create', 'Crear precios generales y acordados', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'product-prices.update', 'Actualizar precios generales y acordados', TRUE, NOW(), NOW()),
  (gen_random_uuid(), 'product-prices.delete', 'Eliminar precios generales y acordados', TRUE, NOW(), NOW())
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description, active = TRUE, updated_at = NOW();

INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT business_role.id, permission.id
FROM tenant.business_roles AS business_role
CROSS JOIN tenant.permissions AS permission
WHERE business_role.code IN ('admin', 'manager')
  AND permission.code IN (
    'product-prices.read',
    'product-prices.create',
    'product-prices.update',
    'product-prices.delete'
  )
ON CONFLICT DO NOTHING;

INSERT INTO tenant.business_role_permissions (role_id, permission_id)
SELECT business_role.id, permission.id
FROM tenant.business_roles AS business_role
JOIN tenant.permissions AS permission ON permission.code = 'product-prices.read'
WHERE business_role.code IN ('user', 'viewer')
ON CONFLICT DO NOTHING;
