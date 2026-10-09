-- ══════════════════════════════════════════════════════════════════
-- Banco: conceptos operativos, movimientos con snapshot, operaciones
-- agrupadoras y cargos/retenciones de pago.
-- Aplica sobre el esquema "tenant" de cada base de empresa.
-- ══════════════════════════════════════════════════════════════════

-- ── 1. Enums del dominio bancario ────────────────────────────────

CREATE TYPE "tenant"."BankMovementNature" AS ENUM ('DEBIT', 'CREDIT');

CREATE TYPE "tenant"."BankMovementType" AS ENUM (
  'OPENING_BALANCE', 'DEPOSIT', 'WITHDRAWAL', 'TRANSFER', 'PAYMENT',
  'COLLECTION', 'CHECK_ISSUED', 'CHECK_RECEIVED', 'FEE', 'INTEREST',
  'TAX', 'RETENTION', 'ADJUSTMENT'
);

CREATE TYPE "tenant"."BankOperationType" AS ENUM (
  'MANUAL', 'PAYMENT', 'COLLECTION', 'CARD_SETTLEMENT', 'CHECK',
  'CASH_TRANSFER', 'HR_VALE'
);

-- ── 2. bank_concepts — catálogo operativo ────────────────────────

ALTER TABLE "tenant"."bank_concepts"
  ADD COLUMN "nature" "tenant"."BankMovementNature" NOT NULL DEFAULT 'DEBIT',
  ADD COLUMN "affects_balance" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "requires_receipt" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "available_manual" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN "available_payments" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "available_settlements" BOOLEAN NOT NULL DEFAULT false;

-- ── 3. bank_operations — operación agrupadora ────────────────────

CREATE TABLE "tenant"."bank_operations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "bank_account_id" UUID NOT NULL,
  "operation_type" "tenant"."BankOperationType" NOT NULL,
  "source_type" VARCHAR(50),
  "source_id" UUID,
  "date" DATE NOT NULL DEFAULT now(),
  "currency_code" VARCHAR(10) NOT NULL,
  "gross_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "charges_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "retentions_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "net_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "description" VARCHAR(255),
  "reference" VARCHAR(100),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6),
  "deleted_at" TIMESTAMP(6),
  "created_by" UUID,
  "updated_by" UUID,
  "deleted_by" UUID,
  CONSTRAINT "bank_operations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "bank_operations_bank_account_id_idx" ON "tenant"."bank_operations"("bank_account_id");
CREATE INDEX "bank_operations_source_type_source_id_idx" ON "tenant"."bank_operations"("source_type", "source_id");

-- ── 4. bank_account_movements — nuevas columnas ──────────────────

ALTER TABLE "tenant"."bank_account_movements"
  ADD COLUMN "bank_operation_id" UUID,
  ADD COLUMN "nature" "tenant"."BankMovementNature",
  ADD COLUMN "base_amount" DECIMAL(15,2),
  ADD COLUMN "tax_amount" DECIMAL(15,2),
  ADD COLUMN "total_amount" DECIMAL(15,2),
  ADD COLUMN "amount_account_currency" DECIMAL(18,2),
  ADD COLUMN "reference" VARCHAR(100),
  ADD COLUMN "attachment_file_id" UUID,
  ADD COLUMN "bank_concept_id" UUID,
  ADD COLUMN "concept_code_snapshot" VARCHAR(30),
  ADD COLUMN "concept_name_snapshot" VARCHAR(100),
  ADD COLUMN "card_settlement_id" UUID,
  ADD COLUMN "document_date" DATE,
  ADD COLUMN "effective_date" DATE;

-- ── 5. Conversión de type: AccountEntryType → BankMovementType ────

ALTER TABLE "tenant"."bank_account_movements"
  ALTER COLUMN "type" TYPE TEXT;

UPDATE "tenant"."bank_account_movements"
SET "type" = CASE "type"
  WHEN 'OPENING_BALANCE' THEN 'OPENING_BALANCE'
  WHEN 'TRANSFER'        THEN 'TRANSFER'
  WHEN 'PAYMENT'         THEN 'PAYMENT'
  WHEN 'COLLECTION'      THEN 'COLLECTION'
  WHEN 'CHECK_ISSUED'    THEN 'CHECK_ISSUED'
  WHEN 'CHECK_RECEIVED'  THEN 'CHECK_RECEIVED'
  WHEN 'ADJUSTMENT'      THEN 'ADJUSTMENT'
  WHEN 'WITHHOLDING'     THEN 'RETENTION'
  WHEN 'DEBIT'           THEN 'WITHDRAWAL'
  WHEN 'CREDIT'          THEN 'DEPOSIT'
  ELSE 'ADJUSTMENT'
END;

-- Completar naturaleza histórica según el signo del movimiento.
UPDATE "tenant"."bank_account_movements"
SET "nature" = CASE WHEN "amount" < 0 THEN 'DEBIT'::"tenant"."BankMovementNature"
                    ELSE 'CREDIT'::"tenant"."BankMovementNature" END
WHERE "nature" IS NULL;

ALTER TABLE "tenant"."bank_account_movements"
  ALTER COLUMN "type" TYPE "tenant"."BankMovementType"
  USING "type"::"tenant"."BankMovementType";

CREATE INDEX "bank_account_movements_bank_operation_id_idx" ON "tenant"."bank_account_movements"("bank_operation_id");
CREATE INDEX "bank_account_movements_bank_concept_id_idx" ON "tenant"."bank_account_movements"("bank_concept_id");
CREATE INDEX "bank_account_movements_card_settlement_id_idx" ON "tenant"."bank_account_movements"("card_settlement_id");

ALTER TABLE "tenant"."bank_account_movements"
  ADD CONSTRAINT "bank_account_movements_bank_operation_id_fkey"
    FOREIGN KEY ("bank_operation_id") REFERENCES "tenant"."bank_operations"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "bank_account_movements_bank_concept_id_fkey"
    FOREIGN KEY ("bank_concept_id") REFERENCES "tenant"."bank_concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tenant"."bank_operations"
  ADD CONSTRAINT "bank_operations_bank_account_id_fkey"
    FOREIGN KEY ("bank_account_id") REFERENCES "tenant"."bank_accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ── 6. payment_bank_charges — detalle de cargos y retenciones ────

CREATE TABLE "tenant"."payment_bank_charges" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "payment_id" UUID NOT NULL,
  "bank_operation_id" UUID,
  "bank_account_movement_id" UUID,
  "bank_concept_id" UUID,
  "concept_code_snapshot" VARCHAR(30),
  "concept_name_snapshot" VARCHAR(100),
  "nature" "tenant"."BankMovementNature" NOT NULL DEFAULT 'DEBIT',
  "base_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "percentage_applied" DECIMAL(6,3),
  "tax_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "total_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "affects_balance" BOOLEAN NOT NULL DEFAULT true,
  "jurisdiction" VARCHAR(50),
  "tax_code" VARCHAR(30),
  "certificate_number" VARCHAR(50),
  "period" VARCHAR(20),
  "reference" VARCHAR(100),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP(6),
  "deleted_at" TIMESTAMP(6),
  "created_by" UUID,
  "updated_by" UUID,
  "deleted_by" UUID,
  CONSTRAINT "payment_bank_charges_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "payment_bank_charges_bank_account_movement_id_key" ON "tenant"."payment_bank_charges"("bank_account_movement_id");
CREATE INDEX "payment_bank_charges_payment_id_idx" ON "tenant"."payment_bank_charges"("payment_id");
CREATE INDEX "payment_bank_charges_bank_operation_id_idx" ON "tenant"."payment_bank_charges"("bank_operation_id");
CREATE INDEX "payment_bank_charges_bank_concept_id_idx" ON "tenant"."payment_bank_charges"("bank_concept_id");

ALTER TABLE "tenant"."payment_bank_charges"
  ADD CONSTRAINT "payment_bank_charges_payment_id_fkey"
    FOREIGN KEY ("payment_id") REFERENCES "tenant"."payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "payment_bank_charges_bank_operation_id_fkey"
    FOREIGN KEY ("bank_operation_id") REFERENCES "tenant"."bank_operations"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "payment_bank_charges_bank_account_movement_id_fkey"
    FOREIGN KEY ("bank_account_movement_id") REFERENCES "tenant"."bank_account_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT "payment_bank_charges_bank_concept_id_fkey"
    FOREIGN KEY ("bank_concept_id") REFERENCES "tenant"."bank_concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
