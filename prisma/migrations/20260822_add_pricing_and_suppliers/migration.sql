-- AlterTable: Add sale_price and margin_percentage to product_price
ALTER TABLE "tenant"."product_price" ADD COLUMN "sale_price" DECIMAL(15, 2);
ALTER TABLE "tenant"."product_price" ADD COLUMN "margin_percentage" DECIMAL(5, 2);

-- CreateTable: product_suppliers
CREATE TABLE "tenant"."product_suppliers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "supplier_id" UUID NOT NULL,
    "purchase_price" DECIMAL(15, 2) NOT NULL,
    "currency_id" UUID NOT NULL,
    "lead_time_days" INTEGER,
    "min_order_quantity" DECIMAL(12, 3),
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "product_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: price_lists
CREATE TABLE "tenant"."price_lists" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "currency_id" UUID NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "price_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable: product_list_prices
CREATE TABLE "tenant"."product_list_prices" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "price_list_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "price" DECIMAL(15, 2) NOT NULL,
    "margin_percentage" DECIMAL(5, 2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP,
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "product_list_prices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: product_suppliers
CREATE UNIQUE INDEX "product_suppliers_product_id_supplier_id_key" ON "tenant"."product_suppliers"("product_id", "supplier_id");
CREATE INDEX "product_suppliers_product_id_idx" ON "tenant"."product_suppliers"("product_id");
CREATE INDEX "product_suppliers_supplier_id_idx" ON "tenant"."product_suppliers"("supplier_id");
CREATE INDEX "product_suppliers_currency_id_idx" ON "tenant"."product_suppliers"("currency_id");

-- CreateIndex: price_lists
CREATE INDEX "price_lists_type_idx" ON "tenant"."price_lists"("type");
CREATE INDEX "price_lists_currency_id_idx" ON "tenant"."price_lists"("currency_id");

-- CreateIndex: product_list_prices
CREATE UNIQUE INDEX "product_list_prices_price_list_id_product_id_key" ON "tenant"."product_list_prices"("price_list_id", "product_id");
CREATE INDEX "product_list_prices_price_list_id_idx" ON "tenant"."product_list_prices"("price_list_id");
CREATE INDEX "product_list_prices_product_id_idx" ON "tenant"."product_list_prices"("product_id");

-- AddForeignKey: product_suppliers
ALTER TABLE "tenant"."product_suppliers" ADD CONSTRAINT "product_suppliers_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenant"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "tenant"."product_suppliers" ADD CONSTRAINT "product_suppliers_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "tenant"."business_parties"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "tenant"."product_suppliers" ADD CONSTRAINT "product_suppliers_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "tenant"."currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey: price_lists
ALTER TABLE "tenant"."price_lists" ADD CONSTRAINT "price_lists_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "tenant"."currencies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey: product_list_prices
ALTER TABLE "tenant"."product_list_prices" ADD CONSTRAINT "product_list_prices_price_list_id_fkey" FOREIGN KEY ("price_list_id") REFERENCES "tenant"."price_lists"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "tenant"."product_list_prices" ADD CONSTRAINT "product_list_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenant"."products"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
