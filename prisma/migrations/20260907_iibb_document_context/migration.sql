ALTER TABLE "tenant"."documents"
  ADD COLUMN IF NOT EXISTS "fiscal_jurisdiction_id" UUID;

ALTER TABLE "tenant"."document_taxes"
  ADD COLUMN IF NOT EXISTS "automatic_tax_amount" DECIMAL(15,2),
  ADD COLUMN IF NOT EXISTS "is_manual" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "modification_reason" VARCHAR(250),
  ADD COLUMN IF NOT EXISTS "manual_override_by" UUID;

CREATE INDEX IF NOT EXISTS "idx_documents_fiscal_jurisdiction"
  ON "tenant"."documents"("fiscal_jurisdiction_id");
