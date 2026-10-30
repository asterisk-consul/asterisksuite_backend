ALTER TYPE "tenant"."PaymentMethod" ADD VALUE IF NOT EXISTS 'MIXED';

CREATE TABLE IF NOT EXISTS "tenant"."payment_tenders" (
  "id" UUID NOT NULL,
  "payment_id" UUID NOT NULL,
  "method" "tenant"."PaymentMethod" NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "cash_box_id" UUID,
  "bank_account_id" UUID,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6),
  "deleted_at" TIMESTAMP(6),
  "created_by" UUID,
  "updated_by" UUID,
  "deleted_by" UUID,
  CONSTRAINT "payment_tenders_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "payment_tenders_payment_id_fkey" FOREIGN KEY ("payment_id")
    REFERENCES "tenant"."payments"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "payment_tenders_cash_box_id_fkey" FOREIGN KEY ("cash_box_id")
    REFERENCES "tenant"."cash_boxes"("id") ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT "payment_tenders_bank_account_id_fkey" FOREIGN KEY ("bank_account_id")
    REFERENCES "tenant"."bank_accounts"("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_tenders_payment_id_method_key"
  ON "tenant"."payment_tenders"("payment_id", "method");
CREATE INDEX IF NOT EXISTS "payment_tenders_cash_box_id_idx"
  ON "tenant"."payment_tenders"("cash_box_id");
CREATE INDEX IF NOT EXISTS "payment_tenders_bank_account_id_idx"
  ON "tenant"."payment_tenders"("bank_account_id");
