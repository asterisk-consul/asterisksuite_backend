ALTER TABLE "tenant"."document_types"
ADD COLUMN IF NOT EXISTS "hidden_amount_statuses" JSONB;

INSERT INTO "tenant"."permissions" ("id", "code", "description", "active", "created_at", "updated_at")
VALUES (
  gen_random_uuid(),
  'sales.orders.view_amounts',
  'Ver precios, totales y comisiones de órdenes de venta restringidas',
  true,
  now(),
  now()
)
ON CONFLICT ("code") DO UPDATE
SET "description" = EXCLUDED."description", "active" = true, "updated_at" = now();

INSERT INTO "tenant"."business_role_permissions" ("role_id", "permission_id")
SELECT role."id", permission."id"
FROM "tenant"."business_roles" role
CROSS JOIN "tenant"."permissions" permission
WHERE role."code" IN ('admin', 'manager')
  AND permission."code" = 'sales.orders.view_amounts'
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
