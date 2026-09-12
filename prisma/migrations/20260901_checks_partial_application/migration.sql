-- Aplicación parcial de cheques
ALTER TABLE "tenant"."checks" ADD COLUMN IF NOT EXISTS "available_amount" DECIMAL(15,2);

-- Backfill: cheques existentes conservan todo su saldo disponible
UPDATE "tenant"."checks" SET "available_amount" = "amount" WHERE "available_amount" IS NULL;

CREATE TABLE IF NOT EXISTS "tenant"."payment_checks" (
  "payment_id" UUID NOT NULL,
  "check_id" UUID NOT NULL,
  "amount_applied" DECIMAL(15,2) NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "created_by" UUID,
  CONSTRAINT "payment_checks_pkey" PRIMARY KEY ("payment_id", "check_id")
);

ALTER TABLE "tenant"."payment_checks" DROP CONSTRAINT IF EXISTS "fk_pc_payment";
ALTER TABLE "tenant"."payment_checks"
  ADD CONSTRAINT "fk_pc_payment" FOREIGN KEY ("payment_id") REFERENCES "tenant"."payments"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE "tenant"."payment_checks" DROP CONSTRAINT IF EXISTS "fk_pc_check";
ALTER TABLE "tenant"."payment_checks"
  ADD CONSTRAINT "fk_pc_check" FOREIGN KEY ("check_id") REFERENCES "tenant"."checks"("id")
  ON DELETE CASCADE ON UPDATE NO ACTION;

CREATE INDEX IF NOT EXISTS "idx_payment_checks_check" ON "tenant"."payment_checks"("check_id");
