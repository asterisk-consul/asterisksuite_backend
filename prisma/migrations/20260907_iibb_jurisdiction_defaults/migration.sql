ALTER TABLE "tenant"."company_tax_jurisdictions"
  ADD COLUMN IF NOT EXISTS "default_perception_rate" DECIMAL(8,4),
  ADD COLUMN IF NOT EXISTS "default_retention_rate" DECIMAL(8,4),
  ADD COLUMN IF NOT EXISTS "valid_from" DATE,
  ADD COLUMN IF NOT EXISTS "valid_to" DATE;
