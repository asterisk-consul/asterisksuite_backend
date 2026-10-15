CREATE TABLE IF NOT EXISTS "tenant"."sales_commission_assignments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "document_id" UUID NOT NULL,
  "seller_id" UUID NOT NULL,
  "participation_rate" DECIMAL(5,2) NOT NULL DEFAULT 100,
  "commission_rate" DECIMAL(5,2) NOT NULL,
  "commission_base" VARCHAR(20) NOT NULL DEFAULT 'INVOICED',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6),
  "created_by" UUID,
  "updated_by" UUID,
  CONSTRAINT "sales_commission_assignments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sales_commission_assignments_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "tenant"."documents"("id") ON DELETE CASCADE,
  CONSTRAINT "sales_commission_assignments_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "tenant"."employees"("id") ON DELETE NO ACTION
);

CREATE UNIQUE INDEX IF NOT EXISTS "sales_commission_assignments_document_id_seller_id_key"
  ON "tenant"."sales_commission_assignments"("document_id", "seller_id");
CREATE INDEX IF NOT EXISTS "sales_commission_assignments_seller_id_active_idx"
  ON "tenant"."sales_commission_assignments"("seller_id", "active");
CREATE INDEX IF NOT EXISTS "sales_commission_assignments_document_id_active_idx"
  ON "tenant"."sales_commission_assignments"("document_id", "active");

INSERT INTO "tenant"."sales_commission_assignments" (
  "document_id", "seller_id", "participation_rate", "commission_rate", "commission_base"
)
SELECT
  ov."document_id",
  ov."seller_id",
  100,
  ov."commission_rate",
  COALESCE(ov."commission_base", e."commission_base", 'INVOICED')
FROM "tenant"."orden_venta_documents" ov
JOIN "tenant"."employees" e ON e."id" = ov."seller_id"
WHERE ov."seller_id" IS NOT NULL
  AND ov."commission_rate" IS NOT NULL
ON CONFLICT ("document_id", "seller_id") DO NOTHING;

INSERT INTO "tenant"."permissions" ("id", "code", "description", "active", "created_at", "updated_at")
VALUES
  (gen_random_uuid(), 'commissions.view', 'Ver documentos, vendedores e importes de comisiones', true, now(), now()),
  (gen_random_uuid(), 'commissions.manage', 'Asignar vendedores, participación y reglas de comisión', true, now(), now()),
  (gen_random_uuid(), 'commissions.settle', 'Generar vales para liquidar comisiones', true, now(), now())
ON CONFLICT ("code") DO UPDATE
SET "description" = EXCLUDED."description", "active" = true, "updated_at" = now();

INSERT INTO "tenant"."business_role_permissions" ("role_id", "permission_id")
SELECT role."id", permission."id"
FROM "tenant"."business_roles" role
CROSS JOIN "tenant"."permissions" permission
WHERE role."code" IN ('admin', 'manager')
  AND permission."code" IN ('commissions.view', 'commissions.manage', 'commissions.settle')
ON CONFLICT ("role_id", "permission_id") DO NOTHING;
