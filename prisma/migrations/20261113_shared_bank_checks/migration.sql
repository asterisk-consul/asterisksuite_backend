ALTER TABLE "tenant"."checks"
  ADD COLUMN "bank_account_company_id" UUID,
  ADD COLUMN "bank_account_external_id" UUID;

ALTER TABLE "tenant"."checks"
  ADD CONSTRAINT "checks_shared_bank_pair_check"
    CHECK (("bank_account_company_id" IS NULL) = ("bank_account_external_id" IS NULL)),
  ADD CONSTRAINT "checks_bank_target_exclusive_check"
    CHECK ("bank_account_id" IS NULL OR "bank_account_company_id" IS NULL);

CREATE INDEX "checks_bank_account_company_id_bank_account_external_id_idx"
  ON "tenant"."checks" ("bank_account_company_id", "bank_account_external_id");

-- Un cheque solo puede tener un movimiento interempresa activo, incluso ante
-- dos solicitudes simultáneas hacia cuentas diferentes.
CREATE UNIQUE INDEX "intercompany_one_active_check_operation"
  ON "public"."intercompany_treasury_operations" ("source_company_id", "source_id")
  WHERE "source_type" = 'check' AND "status" IN ('PROCESSING', 'COMPLETED');
