ALTER TABLE "tenant"."orden_venta_documents"
  ADD COLUMN IF NOT EXISTS "delivery_phones" VARCHAR(30)[] NOT NULL DEFAULT ARRAY[]::VARCHAR(30)[];

UPDATE "tenant"."orden_venta_documents"
SET "delivery_phones" = ARRAY[BTRIM("delivery_phone")]::VARCHAR(30)[]
WHERE COALESCE(array_length("delivery_phones", 1), 0) = 0
  AND NULLIF(BTRIM("delivery_phone"), '') IS NOT NULL;
