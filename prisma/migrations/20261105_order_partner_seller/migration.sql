ALTER TABLE "tenant"."orden_venta_documents"
  ADD COLUMN IF NOT EXISTS "seller_partner_id" UUID,
  ADD COLUMN IF NOT EXISTS "seller_type" VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orden_venta_documents_seller_partner_id_fkey'
      AND conrelid = 'tenant.orden_venta_documents'::regclass
  ) THEN
    ALTER TABLE "tenant"."orden_venta_documents"
      ADD CONSTRAINT "orden_venta_documents_seller_partner_id_fkey"
      FOREIGN KEY ("seller_partner_id") REFERENCES "tenant"."partners"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'orden_venta_documents_seller_identity_check'
      AND conrelid = 'tenant.orden_venta_documents'::regclass
  ) THEN
    ALTER TABLE "tenant"."orden_venta_documents"
      ADD CONSTRAINT "orden_venta_documents_seller_identity_check"
      CHECK (
        ("seller_id" IS NULL AND "seller_partner_id" IS NULL)
        OR ("seller_type" = 'EMPLOYEE' AND "seller_id" IS NOT NULL AND "seller_partner_id" IS NULL)
        OR ("seller_type" = 'PARTNER' AND "seller_id" IS NULL AND "seller_partner_id" IS NOT NULL)
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "orden_venta_documents_seller_partner_id_idx"
  ON "tenant"."orden_venta_documents"("seller_partner_id");
