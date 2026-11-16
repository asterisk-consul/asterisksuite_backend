ALTER TABLE "tenant"."cash_box_transfers"
  ADD COLUMN "intercompany_purpose" VARCHAR(20);

ALTER TABLE "tenant"."cash_box_transfers"
  ADD CONSTRAINT "cash_box_transfers_intercompany_purpose_check"
  CHECK ("intercompany_purpose" IS NULL OR "intercompany_purpose" IN ('SETTLEMENT', 'OTHER'));

CREATE INDEX "cash_box_transfers_intercompany_overview_idx"
  ON "tenant"."cash_box_transfers" ("source_company_id", "dest_company_id", "status", "intercompany_purpose");

ALTER TABLE "public"."intercompany_treasury_operations"
  ADD COLUMN "description" VARCHAR(255),
  ADD COLUMN "effective_date" DATE;

CREATE INDEX "intercompany_treasury_operations_pair_status_idx"
  ON "public"."intercompany_treasury_operations" ("source_company_id", "fund_company_id", "status", "currency_code");
