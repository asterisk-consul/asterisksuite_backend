CREATE TABLE "tenant"."withholding_remittances" (
    "id" UUID NOT NULL,
    "company_id" UUID NOT NULL,
    "tax_type" VARCHAR(30) NOT NULL,
    "tax_regime_code" VARCHAR(30),
    "jurisdiction_id" UUID,
    "period_key" VARCHAR(7) NOT NULL,
    "vep_number" VARCHAR(100) NOT NULL,
    "vep_amount" DECIMAL(15,2) NOT NULL,
    "currency_code" VARCHAR(10) NOT NULL DEFAULT 'ARS',
    "due_date" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'REGISTERED',
    "paid_at" DATE,
    "notes" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    CONSTRAINT "withholding_remittances_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "tenant"."withholdings" ADD COLUMN "remittance_id" UUID;
ALTER TABLE "tenant"."payments" ADD COLUMN "withholding_remittance_id" UUID;

CREATE UNIQUE INDEX "withholding_remittances_vep_number_key" ON "tenant"."withholding_remittances"("vep_number");
CREATE INDEX "withholding_remittances_company_id_status_period_key_idx" ON "tenant"."withholding_remittances"("company_id", "status", "period_key");
CREATE INDEX "withholding_remittances_tax_type_jurisdiction_id_period_key_idx" ON "tenant"."withholding_remittances"("tax_type", "jurisdiction_id", "period_key");
CREATE INDEX "withholdings_remittance_id_idx" ON "tenant"."withholdings"("remittance_id");
CREATE INDEX "payments_withholding_remittance_id_idx" ON "tenant"."payments"("withholding_remittance_id");

ALTER TABLE "tenant"."withholding_remittances" ADD CONSTRAINT "withholding_remittances_jurisdiction_id_fkey" FOREIGN KEY ("jurisdiction_id") REFERENCES "tenant"."tax_jurisdictions"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
ALTER TABLE "tenant"."withholdings" ADD CONSTRAINT "withholdings_remittance_id_fkey" FOREIGN KEY ("remittance_id") REFERENCES "tenant"."withholding_remittances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "tenant"."payments" ADD CONSTRAINT "payments_withholding_remittance_id_fkey" FOREIGN KEY ("withholding_remittance_id") REFERENCES "tenant"."withholding_remittances"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
