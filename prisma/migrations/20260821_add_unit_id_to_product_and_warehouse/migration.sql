-- AlterTable: Add unit_id to products
ALTER TABLE "tenant"."products" ADD COLUMN "unit_id" UUID;

-- AlterTable: Add unit_id to warehouses
ALTER TABLE "tenant"."warehouses" ADD COLUMN "unit_id" UUID;

-- AddForeignKey: products.unit_id -> units.id
ALTER TABLE "tenant"."products" ADD CONSTRAINT "products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "tenant"."units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey: warehouses.unit_id -> units.id
ALTER TABLE "tenant"."warehouses" ADD CONSTRAINT "warehouses_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "tenant"."units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
