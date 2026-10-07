CREATE TABLE "tenant"."stock_replenishment_policies" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "warehouse_id" UUID NOT NULL,
    "preferred_supplier_id" UUID,
    "reorder_point" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "target_stock" DECIMAL(18,6) NOT NULL DEFAULT 0,
    "lead_time_days" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,
    CONSTRAINT "stock_replenishment_policies_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "stock_replenishment_policies_product_id_warehouse_id_key"
ON "tenant"."stock_replenishment_policies"("product_id", "warehouse_id");
CREATE INDEX "stock_replenishment_policies_warehouse_id_active_idx"
ON "tenant"."stock_replenishment_policies"("warehouse_id", "active");
CREATE INDEX "stock_replenishment_policies_preferred_supplier_id_idx"
ON "tenant"."stock_replenishment_policies"("preferred_supplier_id");

ALTER TABLE "tenant"."stock_replenishment_policies"
ADD CONSTRAINT "stock_replenishment_policies_product_id_fkey"
FOREIGN KEY ("product_id") REFERENCES "tenant"."products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "tenant"."stock_replenishment_policies"
ADD CONSTRAINT "stock_replenishment_policies_warehouse_id_fkey"
FOREIGN KEY ("warehouse_id") REFERENCES "tenant"."warehouses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
