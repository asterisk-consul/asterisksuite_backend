CREATE INDEX IF NOT EXISTS "idx_documents_deleted_created"
  ON "tenant"."documents" ("deleted_at", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_documents_type_status_created"
  ON "tenant"."documents" ("document_type_id", "status", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_documents_party_date"
  ON "tenant"."documents" ("party_id", "date" DESC);

CREATE INDEX IF NOT EXISTS "idx_products_deleted_created"
  ON "tenant"."products" ("deleted_at", "created_at" DESC);

CREATE INDEX IF NOT EXISTS "idx_products_deleted_name"
  ON "tenant"."products" ("deleted_at", "name");

CREATE INDEX IF NOT EXISTS "idx_products_sku"
  ON "tenant"."products" ("sku");
