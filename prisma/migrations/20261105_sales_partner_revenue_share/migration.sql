ALTER TABLE "tenant"."partners"
  ADD COLUMN IF NOT EXISTS "default_commission_rate" DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS "commission_base" VARCHAR(20) NOT NULL DEFAULT 'INVOICED',
  ADD COLUMN IF NOT EXISTS "is_salesperson" BOOLEAN NOT NULL DEFAULT false;

-- Preserve the eligibility partners already had in commission assignment screens.
UPDATE "tenant"."partners"
SET "is_salesperson" = true
WHERE "deleted_at" IS NULL AND "is_active" = true;

ALTER TABLE "tenant"."sales_flow_settings"
  ADD COLUMN IF NOT EXISTS "partner_share_basis" VARCHAR(20) NOT NULL DEFAULT 'ORDER';

CREATE TABLE IF NOT EXISTS "tenant"."sales_partner_share_assignments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "document_id" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "share_percentage" DECIMAL(5,2) NOT NULL,
  "calculation_basis" VARCHAR(20) NOT NULL DEFAULT 'ORDER',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6),
  "created_by" UUID,
  "updated_by" UUID,
  CONSTRAINT "sales_partner_share_assignments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "sales_partner_share_assignments_document_id_fkey"
    FOREIGN KEY ("document_id") REFERENCES "tenant"."documents"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "sales_partner_share_assignments_partner_id_fkey"
    FOREIGN KEY ("partner_id") REFERENCES "tenant"."partners"("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "sales_partner_share_assignments_document_id_partner_id_key"
  ON "tenant"."sales_partner_share_assignments"("document_id", "partner_id");
CREATE INDEX IF NOT EXISTS "sales_partner_share_assignments_partner_id_active_idx"
  ON "tenant"."sales_partner_share_assignments"("partner_id", "active");
CREATE INDEX IF NOT EXISTS "sales_partner_share_assignments_document_id_active_idx"
  ON "tenant"."sales_partner_share_assignments"("document_id", "active");

CREATE TABLE IF NOT EXISTS "tenant"."hr_vale_partner_share_details" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "hr_vale_id" UUID NOT NULL,
  "document_id" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "base_amount" DECIMAL(15,2) NOT NULL,
  "share_percentage" DECIMAL(5,2) NOT NULL,
  "share_amount" DECIMAL(15,2) NOT NULL,
  "calculation_basis" VARCHAR(20) NOT NULL DEFAULT 'ORDER',
  "date" DATE NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "hr_vale_partner_share_details_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "hr_vale_partner_share_details_hr_vale_id_fkey"
    FOREIGN KEY ("hr_vale_id") REFERENCES "tenant"."hr_vales"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "hr_vale_partner_share_details_document_id_fkey"
    FOREIGN KEY ("document_id") REFERENCES "tenant"."documents"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT "hr_vale_partner_share_details_partner_id_fkey"
    FOREIGN KEY ("partner_id") REFERENCES "tenant"."partners"("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "hr_vale_partner_share_details_hr_vale_id_idx"
  ON "tenant"."hr_vale_partner_share_details"("hr_vale_id");
CREATE INDEX IF NOT EXISTS "hr_vale_partner_share_details_document_id_partner_id_idx"
  ON "tenant"."hr_vale_partner_share_details"("document_id", "partner_id");
CREATE INDEX IF NOT EXISTS "hr_vale_partner_share_details_partner_id_idx"
  ON "tenant"."hr_vale_partner_share_details"("partner_id");
