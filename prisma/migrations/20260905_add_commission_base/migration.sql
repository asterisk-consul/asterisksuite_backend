-- These fields were added to the Prisma schema without a tenant migration.
-- IF NOT EXISTS keeps the migration safe for newly-created tenants that
-- already received the current schema through the company bootstrap process.
ALTER TABLE "tenant"."orden_venta_documents"
  ADD COLUMN IF NOT EXISTS "commission_base" VARCHAR(20);

ALTER TABLE "tenant"."employees"
  ADD COLUMN IF NOT EXISTS "commission_base" VARCHAR(20) NOT NULL DEFAULT 'INVOICED';

ALTER TABLE "tenant"."hr_vale_commission_details"
  ADD COLUMN IF NOT EXISTS "commission_base" VARCHAR(20) NOT NULL DEFAULT 'INVOICED';
