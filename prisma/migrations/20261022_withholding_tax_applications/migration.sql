CREATE TABLE "tenant"."withholding_tax_applications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "company_id" UUID NOT NULL,
    "withholding_id" UUID NOT NULL,
    "tax_type" VARCHAR(30) NOT NULL,
    "tax_period" VARCHAR(7) NOT NULL,
    "application_date" DATE NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "declaration_reference" VARCHAR(100),
    "notes" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'APPLIED',
    "reversed_at" TIMESTAMP(6),
    "reversal_reason" TEXT,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "created_by" UUID,
    "updated_by" UUID,
    "reversed_by" UUID,

    CONSTRAINT "withholding_tax_applications_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "withholding_tax_applications_amount_check" CHECK ("amount" > 0),
    CONSTRAINT "withholding_tax_applications_tax_period_check" CHECK ("tax_period" ~ '^[0-9]{4}(-((0[1-9])|(1[0-2])))?$'),
    CONSTRAINT "withholding_tax_applications_status_check" CHECK ("status" IN ('APPLIED', 'REVERSED'))
);

CREATE INDEX "withholding_tax_applications_company_id_tax_type_tax_period_status_idx"
ON "tenant"."withholding_tax_applications"("company_id", "tax_type", "tax_period", "status");

CREATE INDEX "withholding_tax_applications_withholding_id_status_idx"
ON "tenant"."withholding_tax_applications"("withholding_id", "status");

ALTER TABLE "tenant"."withholding_tax_applications"
ADD CONSTRAINT "withholding_tax_applications_withholding_id_fkey"
FOREIGN KEY ("withholding_id") REFERENCES "tenant"."withholdings"("id")
ON DELETE NO ACTION ON UPDATE CASCADE;
