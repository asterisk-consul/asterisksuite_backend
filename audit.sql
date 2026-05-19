-- CreateEnum
CREATE TYPE "VariantCostSource" AS ENUM ('MANUAL', 'PURCHASE', 'IMPORT', 'ENGINEERING', 'SUPPLIER');

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "cost_price",
DROP COLUMN "sale_price";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "cost_source" "ProductCostSource" NOT NULL DEFAULT 'BOM',
ADD COLUMN     "last_cost_calculated_at" TIMESTAMP(3),
ADD COLUMN     "needs_cost_recalculation" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "product_variant_prices" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "price" DECIMAL(15,2) NOT NULL,
    "price_list" TEXT,
    "margin" DECIMAL(5,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_variant_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant_costs" (
    "id" UUID NOT NULL,
    "variant_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "source" "VariantCostSource" NOT NULL DEFAULT 'MANUAL',
    "cost" DECIMAL(15,2) NOT NULL,
    "effective_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "product_variant_costs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_variant_prices_variant_id_idx" ON "product_variant_prices"("variant_id");

-- CreateIndex
CREATE INDEX "product_variant_prices_currency_id_idx" ON "product_variant_prices"("currency_id");

-- CreateIndex
CREATE INDEX "product_variant_costs_variant_id_idx" ON "product_variant_costs"("variant_id");

-- CreateIndex
CREATE INDEX "product_variant_costs_currency_id_idx" ON "product_variant_costs"("currency_id");

-- CreateIndex
CREATE INDEX "product_variant_costs_source_idx" ON "product_variant_costs"("source");

-- CreateIndex
CREATE INDEX "product_variant_costs_effective_date_idx" ON "product_variant_costs"("effective_date");

-- AddForeignKey
ALTER TABLE "product_variant_prices" ADD CONSTRAINT "product_variant_prices_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_prices" ADD CONSTRAINT "product_variant_prices_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_costs" ADD CONSTRAINT "product_variant_costs_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant_costs" ADD CONSTRAINT "product_variant_costs_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

