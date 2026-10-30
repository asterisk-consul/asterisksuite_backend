ALTER TABLE "tenant"."document_sequences"
  ADD COLUMN IF NOT EXISTS "sales_order_tax_mode" VARCHAR(20) NOT NULL DEFAULT 'STANDARD';
