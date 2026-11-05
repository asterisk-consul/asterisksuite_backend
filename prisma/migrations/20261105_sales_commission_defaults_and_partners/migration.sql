ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "default_commission_assignments" JSONB NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE "tenant"."sales_commission_assignments"
  ALTER COLUMN "seller_id" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "seller_type" VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE',
  ADD COLUMN IF NOT EXISTS "partner_id" UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sales_commission_assignments_partner_id_fkey'
      AND conrelid = 'tenant.sales_commission_assignments'::regclass
  ) THEN
    ALTER TABLE "tenant"."sales_commission_assignments"
      ADD CONSTRAINT "sales_commission_assignments_partner_id_fkey"
      FOREIGN KEY ("partner_id") REFERENCES "tenant"."partners"("id") ON DELETE NO ACTION;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sales_commission_assignments_seller_identity_check'
      AND conrelid = 'tenant.sales_commission_assignments'::regclass
  ) THEN
    ALTER TABLE "tenant"."sales_commission_assignments"
      ADD CONSTRAINT "sales_commission_assignments_seller_identity_check"
      CHECK (
        ("seller_type" = 'EMPLOYEE' AND "seller_id" IS NOT NULL AND "partner_id" IS NULL)
        OR ("seller_type" = 'PARTNER' AND "seller_id" IS NULL AND "partner_id" IS NOT NULL)
      );
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'sales_commission_assignments_seller_id_fkey'
      AND conrelid = 'tenant.sales_commission_assignments'::regclass
  ) THEN
    ALTER TABLE "tenant"."sales_commission_assignments"
      ADD CONSTRAINT "sales_commission_assignments_seller_id_fkey"
      FOREIGN KEY ("seller_id") REFERENCES "tenant"."employees"("id") ON DELETE NO ACTION;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "sales_commission_assignments_document_id_partner_id_key"
  ON "tenant"."sales_commission_assignments"("document_id", "partner_id");
CREATE INDEX IF NOT EXISTS "sales_commission_assignments_partner_id_active_idx"
  ON "tenant"."sales_commission_assignments"("partner_id", "active");

ALTER TABLE "tenant"."hr_vale_commission_details"
  ADD COLUMN IF NOT EXISTS "seller_type" VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE',
  ADD COLUMN IF NOT EXISTS "partner_id" UUID;

CREATE INDEX IF NOT EXISTS "hr_vale_commission_details_partner_id_idx"
  ON "tenant"."hr_vale_commission_details"("partner_id");
