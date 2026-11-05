ALTER TABLE "tenant"."bank_accounts"
  ADD COLUMN IF NOT EXISTS "accounting_account_id" UUID;

ALTER TABLE "tenant"."bank_accounts"
  ADD CONSTRAINT "bank_accounts_accounting_account_id_fkey"
  FOREIGN KEY ("accounting_account_id") REFERENCES "tenant"."accounts"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "bank_accounts_accounting_account_id_idx"
  ON "tenant"."bank_accounts"("accounting_account_id");

ALTER TABLE "tenant"."bank_account_movements"
  ADD COLUMN IF NOT EXISTS "import_key" VARCHAR(150);

CREATE UNIQUE INDEX IF NOT EXISTS "bank_account_movements_import_key_key"
  ON "tenant"."bank_account_movements"("import_key");

CREATE TABLE IF NOT EXISTS "tenant"."bank_movement_accounting_entries" (
  "id" UUID NOT NULL,
  "bank_account_movement_id" UUID,
  "reversal_of_entry_id" UUID,
  "entry_date" DATE NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "currency_code" VARCHAR(10) NOT NULL,
  "exchange_rate" DECIMAL(18,6),
  "base_amount" DECIMAL(18,2) NOT NULL,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_by" UUID,
  "reversed_at" TIMESTAMP(6),
  "reversed_by" UUID,
  CONSTRAINT "bank_movement_accounting_entries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bank_movement_accounting_entries_bank_account_movement_id_fkey"
    FOREIGN KEY ("bank_account_movement_id") REFERENCES "tenant"."bank_account_movements"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "bank_movement_accounting_entries_reversal_of_entry_id_fkey"
    FOREIGN KEY ("reversal_of_entry_id") REFERENCES "tenant"."bank_movement_accounting_entries"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "bank_movement_accounting_entries_bank_account_movement_id_key"
  ON "tenant"."bank_movement_accounting_entries"("bank_account_movement_id");
CREATE UNIQUE INDEX IF NOT EXISTS "bank_movement_accounting_entries_reversal_of_entry_id_key"
  ON "tenant"."bank_movement_accounting_entries"("reversal_of_entry_id");
CREATE INDEX IF NOT EXISTS "bank_movement_accounting_entries_entry_date_idx"
  ON "tenant"."bank_movement_accounting_entries"("entry_date");

CREATE TABLE IF NOT EXISTS "tenant"."bank_movement_accounting_lines" (
  "id" UUID NOT NULL,
  "entry_id" UUID NOT NULL,
  "line_number" INTEGER NOT NULL,
  "account_id" UUID NOT NULL,
  "description" VARCHAR(255) NOT NULL,
  "debit" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "credit" DECIMAL(18,2) NOT NULL DEFAULT 0,
  "currency_code" VARCHAR(10) NOT NULL,
  "foreign_amount" DECIMAL(18,2),
  CONSTRAINT "bank_movement_accounting_lines_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "bank_movement_accounting_lines_entry_id_fkey"
    FOREIGN KEY ("entry_id") REFERENCES "tenant"."bank_movement_accounting_entries"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "bank_movement_accounting_lines_account_id_fkey"
    FOREIGN KEY ("account_id") REFERENCES "tenant"."accounts"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "bank_movement_accounting_lines_debit_credit_check"
    CHECK (("debit" >= 0) AND ("credit" >= 0) AND NOT ("debit" > 0 AND "credit" > 0))
);

CREATE UNIQUE INDEX IF NOT EXISTS "bank_movement_accounting_lines_entry_id_line_number_key"
  ON "tenant"."bank_movement_accounting_lines"("entry_id", "line_number");
CREATE INDEX IF NOT EXISTS "bank_movement_accounting_lines_account_id_idx"
  ON "tenant"."bank_movement_accounting_lines"("account_id");
