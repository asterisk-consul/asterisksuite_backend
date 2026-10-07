ALTER TABLE "tenant"."product_components"
ADD COLUMN IF NOT EXISTS "structure_variant_id" UUID;

CREATE INDEX IF NOT EXISTS "product_components_parent_product_id_structure_variant_id_order_idx"
ON "tenant"."product_components"("parent_product_id", "structure_variant_id", "order");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'product_components_structure_variant_id_fkey'
      AND conrelid = 'tenant.product_components'::regclass
  ) THEN
    ALTER TABLE "tenant"."product_components"
    ADD CONSTRAINT "product_components_structure_variant_id_fkey"
    FOREIGN KEY ("structure_variant_id") REFERENCES "tenant"."product_variants"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
