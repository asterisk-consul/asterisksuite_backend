ALTER TABLE "tenant"."document_items"
  ADD COLUMN IF NOT EXISTS "item_instructions" TEXT;
