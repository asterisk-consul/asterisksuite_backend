-- Historical quotes remain unassigned until the user chooses their container.
ALTER TABLE "tenant"."international_operation_quotes"
  ADD COLUMN "container_id" UUID,
  ADD COLUMN "expense_type" "tenant"."InternationalExpenseType" NOT NULL DEFAULT 'MERCHANDISE',
  ADD COLUMN "custom_expense_description" VARCHAR(255),
  ADD COLUMN "exchange_rate" DECIMAL(18,6),
  ADD COLUMN "converted_document_id" UUID;

CREATE UNIQUE INDEX "international_operation_quotes_converted_document_id_key"
  ON "tenant"."international_operation_quotes"("converted_document_id");
CREATE INDEX "idx_ioq_container_expense"
  ON "tenant"."international_operation_quotes"("container_id", "expense_type");
ALTER TABLE "tenant"."international_operation_quotes"
  ADD CONSTRAINT "international_operation_quotes_container_id_fkey"
    FOREIGN KEY ("container_id") REFERENCES "tenant"."international_containers"("id") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "international_operation_quotes_converted_document_id_fkey"
    FOREIGN KEY ("converted_document_id") REFERENCES "tenant"."documents"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;
