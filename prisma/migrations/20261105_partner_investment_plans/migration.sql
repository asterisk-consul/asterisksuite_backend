ALTER TABLE "tenant"."partners"
  ADD COLUMN IF NOT EXISTS "partner_kind" VARCHAR(20) NOT NULL DEFAULT 'PARTNER';

ALTER TABLE "tenant"."partners"
  ADD CONSTRAINT "partners_partner_kind_check"
  CHECK ("partner_kind" IN ('PARTNER', 'INVESTOR'));

CREATE TABLE "tenant"."hr_partner_investment_plans" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "idempotency_key" UUID NOT NULL,
  "partner_id" UUID NOT NULL,
  "currency_code" VARCHAR(10) NOT NULL,
  "total_amount" DECIMAL(15,2) NOT NULL,
  "description" VARCHAR(255),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" UUID,
  CONSTRAINT "hr_partner_investment_plans_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "hr_partner_investment_plans_total_amount_check" CHECK ("total_amount" > 0),
  CONSTRAINT "hr_partner_investment_plans_idempotency_key_key" UNIQUE ("idempotency_key"),
  CONSTRAINT "hr_partner_investment_plans_partner_id_fkey"
    FOREIGN KEY ("partner_id") REFERENCES "tenant"."partners"("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE INDEX "hr_partner_investment_plans_partner_id_currency_code_created_at_idx"
  ON "tenant"."hr_partner_investment_plans"("partner_id", "currency_code", "created_at");

CREATE TABLE "tenant"."hr_partner_investment_installments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "plan_id" UUID NOT NULL,
  "installment_number" INTEGER NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "due_date" DATE NOT NULL,
  "vale_id" UUID NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "hr_partner_investment_installments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "hr_partner_investment_installments_amount_check" CHECK ("amount" > 0),
  CONSTRAINT "hr_partner_investment_installments_plan_id_fkey"
    FOREIGN KEY ("plan_id") REFERENCES "tenant"."hr_partner_investment_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "hr_partner_investment_installments_vale_id_fkey"
    FOREIGN KEY ("vale_id") REFERENCES "tenant"."hr_vales"("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "hr_partner_investment_installments_vale_id_key"
  ON "tenant"."hr_partner_investment_installments"("vale_id");
CREATE UNIQUE INDEX "hr_partner_investment_installments_plan_id_installment_number_key"
  ON "tenant"."hr_partner_investment_installments"("plan_id", "installment_number");
CREATE INDEX "hr_partner_investment_installments_plan_id_due_date_idx"
  ON "tenant"."hr_partner_investment_installments"("plan_id", "due_date");
