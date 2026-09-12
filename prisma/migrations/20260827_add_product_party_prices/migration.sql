CREATE TABLE "tenant"."product_party_prices" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "product_id" UUID NOT NULL,
  "party_id" UUID NOT NULL,
  "currency_id" UUID NOT NULL,
  "operation_type" VARCHAR(10) NOT NULL,
  "price" DECIMAL(15,2) NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "effective_from" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(6),
  "deleted_at" TIMESTAMP(3),
  "created_by" UUID,
  "updated_by" UUID,
  "deleted_by" UUID,
  CONSTRAINT "product_party_prices_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_party_prices_operation_type_check" CHECK ("operation_type" IN ('SALE', 'PURCHASE')),
  CONSTRAINT "product_party_prices_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenant"."products"("id") ON DELETE CASCADE,
  CONSTRAINT "product_party_prices_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "tenant"."business_parties"("id") ON DELETE CASCADE,
  CONSTRAINT "product_party_prices_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "tenant"."currencies"("id")
);

CREATE UNIQUE INDEX "product_party_prices_product_id_party_id_operation_type_currency_id_key"
  ON "tenant"."product_party_prices"("product_id", "party_id", "operation_type", "currency_id");
CREATE INDEX "product_party_prices_party_id_operation_type_idx"
  ON "tenant"."product_party_prices"("party_id", "operation_type");
CREATE INDEX "product_party_prices_product_id_operation_type_idx"
  ON "tenant"."product_party_prices"("product_id", "operation_type");

CREATE TABLE "tenant"."product_party_price_history" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "product_party_price_id" UUID NOT NULL,
  "product_id" UUID NOT NULL,
  "party_id" UUID NOT NULL,
  "currency_id" UUID NOT NULL,
  "operation_type" VARCHAR(10) NOT NULL,
  "previous_price" DECIMAL(15,2),
  "new_price" DECIMAL(15,2) NOT NULL,
  "effective_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "source_type" VARCHAR(30) NOT NULL,
  "source_id" UUID,
  "document_item_id" UUID,
  "created_by" UUID,
  "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "product_party_price_history_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "product_party_price_history_operation_type_check" CHECK ("operation_type" IN ('SALE', 'PURCHASE')),
  CONSTRAINT "product_party_price_history_party_price_fkey" FOREIGN KEY ("product_party_price_id") REFERENCES "tenant"."product_party_prices"("id") ON DELETE CASCADE,
  CONSTRAINT "product_party_price_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "tenant"."products"("id") ON DELETE CASCADE,
  CONSTRAINT "product_party_price_history_party_id_fkey" FOREIGN KEY ("party_id") REFERENCES "tenant"."business_parties"("id") ON DELETE CASCADE,
  CONSTRAINT "product_party_price_history_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "tenant"."currencies"("id")
);

CREATE INDEX "product_party_price_history_party_product_operation_effective_idx"
  ON "tenant"."product_party_price_history"("party_id", "product_id", "operation_type", "effective_at");
CREATE INDEX "product_party_price_history_source_id_idx"
  ON "tenant"."product_party_price_history"("source_id");

-- Compatibilidad: los precios de proveedores que ya existían pasan a ser
-- precios específicos de compra. Los datos operativos permanecen también en
-- product_suppliers (proveedor principal, entrega mínima, plazos, etc.).
INSERT INTO "tenant"."product_party_prices" (
  "product_id", "party_id", "currency_id", "operation_type", "price",
  "active", "effective_from", "created_at", "updated_at", "created_by", "updated_by"
)
SELECT
  ps."product_id", ps."supplier_id", ps."currency_id", 'PURCHASE', ps."purchase_price",
  ps."active", ps."created_at", ps."created_at", ps."updated_at", ps."created_by", ps."updated_by"
FROM "tenant"."product_suppliers" ps
WHERE ps."deleted_at" IS NULL
ON CONFLICT ("product_id", "party_id", "operation_type", "currency_id") DO NOTHING;

INSERT INTO "tenant"."product_party_price_history" (
  "product_party_price_id", "product_id", "party_id", "currency_id",
  "operation_type", "previous_price", "new_price", "effective_at",
  "source_type", "source_id", "created_by", "created_at"
)
SELECT
  ppp."id", ppp."product_id", ppp."party_id", ppp."currency_id",
  'PURCHASE', NULL, ppp."price", ppp."effective_from",
  'LEGACY_SUPPLIER', ps."id", ps."created_by", ps."created_at"
FROM "tenant"."product_party_prices" ppp
JOIN "tenant"."product_suppliers" ps
  ON ps."product_id" = ppp."product_id"
 AND ps."supplier_id" = ppp."party_id"
 AND ps."currency_id" = ppp."currency_id"
WHERE ppp."operation_type" = 'PURCHASE'
  AND ps."deleted_at" IS NULL;
