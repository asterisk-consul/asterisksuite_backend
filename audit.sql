-- CreateEnum
CREATE TYPE "ProductCostSource" AS ENUM ('MANUAL', 'BOM', 'ENGINEERING', 'PURCHASE', 'RATE');

-- AlterEnum
BEGIN;
CREATE TYPE "CurrencyRateType_new" AS ENUM ('OFFICIAL', 'BLUE', 'MEP', 'CCL', 'WHOLESALE', 'CRYPTO', 'CARD');
ALTER TABLE "public"."currency_rates" ALTER COLUMN "rate_type" DROP DEFAULT;
ALTER TABLE "currency_rates" ALTER COLUMN "rate_type" TYPE "CurrencyRateType_new" USING ("rate_type"::text::"CurrencyRateType_new");
ALTER TYPE "CurrencyRateType" RENAME TO "CurrencyRateType_old";
ALTER TYPE "CurrencyRateType_new" RENAME TO "CurrencyRateType";
DROP TYPE "public"."CurrencyRateType_old";
ALTER TABLE "currency_rates" ALTER COLUMN "rate_type" SET DEFAULT 'OFFICIAL';
COMMIT;

-- AlterTable
ALTER TABLE "product_price" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "current_cost" DECIMAL(15,2);

-- CreateTable
CREATE TABLE "product_costs" (
    "id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "currency_id" UUID NOT NULL,
    "cost_source" "ProductCostSource" NOT NULL DEFAULT 'BOM',
    "material_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "labor_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "overhead_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(3),
    "created_by" UUID,
    "updated_by" UUID,
    "deleted_by" UUID,

    CONSTRAINT "product_costs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_cost_breakdowns" (
    "id" UUID NOT NULL,
    "product_cost_id" UUID NOT NULL,
    "component_product_id" UUID NOT NULL,
    "component_variant_id" UUID,
    "quantity" DECIMAL(15,3) NOT NULL,
    "unit_cost" DECIMAL(15,2) NOT NULL,
    "total_cost" DECIMAL(15,2) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_cost_breakdowns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_costs_product_id_idx" ON "product_costs"("product_id");

-- CreateIndex
CREATE INDEX "product_costs_currency_id_idx" ON "product_costs"("currency_id");

-- CreateIndex
CREATE INDEX "product_costs_active_idx" ON "product_costs"("active");

-- CreateIndex
CREATE INDEX "product_cost_breakdowns_product_cost_id_idx" ON "product_cost_breakdowns"("product_cost_id");

-- CreateIndex
CREATE INDEX "product_cost_breakdowns_component_product_id_idx" ON "product_cost_breakdowns"("component_product_id");

-- AddForeignKey
ALTER TABLE "product_costs" ADD CONSTRAINT "product_costs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_costs" ADD CONSTRAINT "product_costs_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "currencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_cost_breakdowns" ADD CONSTRAINT "product_cost_breakdowns_product_cost_id_fkey" FOREIGN KEY ("product_cost_id") REFERENCES "product_costs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_cost_breakdowns" ADD CONSTRAINT "product_cost_breakdowns_component_product_id_fkey" FOREIGN KEY ("component_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_cost_breakdowns" ADD CONSTRAINT "product_cost_breakdowns_component_variant_id_fkey" FOREIGN KEY ("component_variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

