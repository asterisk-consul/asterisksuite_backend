-- Add NACIONALIZACION to InternationalExpenseType
ALTER TYPE "tenant"."InternationalExpenseType" ADD VALUE IF NOT EXISTS 'NACIONALIZACION' AFTER 'CUSTOMS_DUTIES';

-- Add container_id to international_operation_payments
ALTER TABLE "tenant"."international_operation_payments" ADD COLUMN IF NOT EXISTS "container_id" UUID;

ALTER TABLE "tenant"."international_operation_payments" DROP CONSTRAINT IF EXISTS "fk_iop_container";
ALTER TABLE "tenant"."international_operation_payments"
  ADD CONSTRAINT "fk_iop_container"
  FOREIGN KEY ("container_id") REFERENCES "tenant"."international_containers"("id")
  ON DELETE SET NULL ON UPDATE NO ACTION;

CREATE INDEX IF NOT EXISTS "idx_iop_container" ON "tenant"."international_operation_payments"("container_id");
