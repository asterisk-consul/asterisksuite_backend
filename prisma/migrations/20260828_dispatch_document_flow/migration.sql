ALTER TABLE "tenant"."dispatch_orders"
  ADD COLUMN "source_document_id" UUID;

ALTER TABLE "tenant"."documents"
  ADD COLUMN "dispatch_order_id" UUID;

ALTER TABLE "tenant"."dispatch_orders"
  ADD CONSTRAINT "dispatch_orders_source_document_id_fkey"
  FOREIGN KEY ("source_document_id") REFERENCES "tenant"."documents"("id") ON DELETE SET NULL;

ALTER TABLE "tenant"."documents"
  ADD CONSTRAINT "documents_dispatch_order_id_fkey"
  FOREIGN KEY ("dispatch_order_id") REFERENCES "tenant"."dispatch_orders"("id") ON DELETE SET NULL;

CREATE INDEX "dispatch_orders_source_document_id_idx"
  ON "tenant"."dispatch_orders"("source_document_id");
CREATE INDEX "documents_dispatch_order_id_idx"
  ON "tenant"."documents"("dispatch_order_id");

CREATE TABLE "tenant"."dispatch_order_items" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "dispatch_order_id" UUID NOT NULL,
  "product_id" UUID,
  "source_document_item_id" UUID,
  "quantity" DECIMAL(12,3) NOT NULL,
  "unit_price" DECIMAL(15,2) NOT NULL,
  "currency_code" VARCHAR(10),
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dispatch_order_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "dispatch_order_items_dispatch_order_id_fkey" FOREIGN KEY ("dispatch_order_id") REFERENCES "tenant"."dispatch_orders"("id") ON DELETE CASCADE,
  CONSTRAINT "dispatch_order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenant"."products"("id") ON DELETE SET NULL
);

CREATE INDEX "dispatch_order_items_dispatch_order_id_idx" ON "tenant"."dispatch_order_items"("dispatch_order_id");
CREATE INDEX "dispatch_order_items_product_id_idx" ON "tenant"."dispatch_order_items"("product_id");
