ALTER TYPE "tenant"."BankOperationType" ADD VALUE IF NOT EXISTS 'INVESTMENT';

CREATE TYPE "tenant"."FinancialInvestmentType" AS ENUM ('FIXED_TERM', 'INVESTMENT_FUND', 'OTHER');
CREATE TYPE "tenant"."FinancialInvestmentStatus" AS ENUM ('DRAFT', 'ACTIVE', 'MATURED_PENDING_SETTLEMENT', 'REDEMPTION_REQUESTED', 'REDEEMED', 'RENEWED', 'CANCELLED');
CREATE TYPE "tenant"."InvestmentTransactionType" AS ENUM ('SUBSCRIPTION', 'VALUATION', 'REDEMPTION', 'MATURITY', 'RENEWAL', 'ADJUSTMENT');

CREATE TABLE "tenant"."financial_investments" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" "tenant"."FinancialInvestmentType" NOT NULL,
  "status" "tenant"."FinancialInvestmentStatus" NOT NULL DEFAULT 'ACTIVE',
  "name" VARCHAR(120) NOT NULL,
  "institution_name" VARCHAR(120),
  "currency_code" VARCHAR(10) NOT NULL,
  "source_bank_account_id" UUID NOT NULL,
  "destination_bank_account_id" UUID,
  "capital_amount" DECIMAL(18,2) NOT NULL,
  "start_date" DATE NOT NULL,
  "maturity_date" DATE,
  "annual_nominal_rate" DECIMAL(9,4),
  "day_count_basis" INTEGER DEFAULT 365,
  "units" DECIMAL(24,8),
  "initial_unit_value" DECIMAL(18,8),
  "current_unit_value" DECIMAL(18,8),
  "current_unit_value_date" DATE,
  "expected_final_amount" DECIMAL(18,2),
  "realized_return" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "auto_renew" BOOLEAN NOT NULL DEFAULT false,
  "reference" VARCHAR(100),
  "notes" VARCHAR(500),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6),
  "deleted_at" TIMESTAMP(3),
  "created_by" UUID,
  "updated_by" UUID,
  "deleted_by" UUID,
  CONSTRAINT "financial_investments_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "financial_investments_source_bank_account_id_fkey" FOREIGN KEY ("source_bank_account_id") REFERENCES "tenant"."bank_accounts"("id"),
  CONSTRAINT "financial_investments_destination_bank_account_id_fkey" FOREIGN KEY ("destination_bank_account_id") REFERENCES "tenant"."bank_accounts"("id")
);

CREATE INDEX "financial_investments_status_maturity_date_idx" ON "tenant"."financial_investments"("status", "maturity_date");
CREATE INDEX "financial_investments_source_bank_account_id_idx" ON "tenant"."financial_investments"("source_bank_account_id");

CREATE TABLE "tenant"."financial_investment_valuations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "investment_id" UUID NOT NULL,
  "valuation_date" DATE NOT NULL,
  "unit_value" DECIMAL(18,8) NOT NULL,
  "units" DECIMAL(24,8) NOT NULL,
  "total_value" DECIMAL(18,2) NOT NULL,
  "unrealized_return" DECIMAL(18,2) NOT NULL,
  "notes" VARCHAR(255),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "created_by" UUID,
  CONSTRAINT "financial_investment_valuations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "financial_investment_valuations_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "tenant"."financial_investments"("id")
);
CREATE UNIQUE INDEX "financial_investment_valuations_investment_id_valuation_date_key" ON "tenant"."financial_investment_valuations"("investment_id", "valuation_date");
CREATE INDEX "financial_investment_valuations_investment_id_valuation_date_idx" ON "tenant"."financial_investment_valuations"("investment_id", "valuation_date");

CREATE TABLE "tenant"."financial_investment_transactions" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "investment_id" UUID NOT NULL,
  "type" "tenant"."InvestmentTransactionType" NOT NULL,
  "date" DATE NOT NULL,
  "amount" DECIMAL(18,2) NOT NULL,
  "capital_amount" DECIMAL(18,2),
  "return_amount" DECIMAL(18,2),
  "bank_account_movement_id" UUID,
  "reference" VARCHAR(100),
  "notes" VARCHAR(255),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "created_by" UUID,
  CONSTRAINT "financial_investment_transactions_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "financial_investment_transactions_investment_id_fkey" FOREIGN KEY ("investment_id") REFERENCES "tenant"."financial_investments"("id")
);
CREATE INDEX "financial_investment_transactions_investment_id_date_idx" ON "tenant"."financial_investment_transactions"("investment_id", "date");
CREATE INDEX "financial_investment_transactions_bank_account_movement_id_idx" ON "tenant"."financial_investment_transactions"("bank_account_movement_id");
