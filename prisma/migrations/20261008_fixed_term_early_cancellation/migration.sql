DO $$
BEGIN
  CREATE TYPE "tenant"."FixedTermLiquidityType" AS ENUM ('NON_CANCELABLE', 'PRE_CANCELABLE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "tenant"."financial_investments"
  ADD COLUMN IF NOT EXISTS "liquidity_type" "tenant"."FixedTermLiquidityType" DEFAULT 'NON_CANCELABLE',
  ADD COLUMN IF NOT EXISTS "early_cancel_available_from" DATE,
  ADD COLUMN IF NOT EXISTS "early_cancel_annual_rate" DECIMAL(9,4);
