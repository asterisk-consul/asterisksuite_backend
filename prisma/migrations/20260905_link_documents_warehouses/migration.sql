ALTER TABLE "tenant"."documents"
  ADD COLUMN IF NOT EXISTS "warehouse_id" UUID;

ALTER TABLE "tenant"."document_items"
  ADD COLUMN IF NOT EXISTS "warehouse_id" UUID;

CREATE INDEX IF NOT EXISTS "documents_warehouse_id_idx"
  ON "tenant"."documents"("warehouse_id");

CREATE INDEX IF NOT EXISTS "document_items_warehouse_id_idx"
  ON "tenant"."document_items"("warehouse_id");

DO $$ BEGIN
  ALTER TABLE "tenant"."documents"
    ADD CONSTRAINT "documents_warehouse_id_fkey"
    FOREIGN KEY ("warehouse_id") REFERENCES "tenant"."warehouses"("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "tenant"."document_items"
    ADD CONSTRAINT "document_items_warehouse_id_fkey"
    FOREIGN KEY ("warehouse_id") REFERENCES "tenant"."warehouses"("id")
    ON DELETE NO ACTION ON UPDATE NO ACTION;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
