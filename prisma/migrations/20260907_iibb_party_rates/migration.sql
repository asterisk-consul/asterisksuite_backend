ALTER TABLE "tenant"."business_party_iibb_registrations"
  ADD COLUMN IF NOT EXISTS "perception_rate" DECIMAL(8,4),
  ADD COLUMN IF NOT EXISTS "retention_rate" DECIMAL(8,4),
  ADD COLUMN IF NOT EXISTS "valid_from" DATE,
  ADD COLUMN IF NOT EXISTS "valid_to" DATE,
  ADD COLUMN IF NOT EXISTS "source" VARCHAR(30) NOT NULL DEFAULT 'MANUAL';

INSERT INTO "tenant"."tax_jurisdictions" ("id", "code", "name", "country", "is_active", "sort_order") VALUES
  (gen_random_uuid(), 'AR-C', 'Ciudad Autónoma de Buenos Aires', 'AR', true, 1),
  (gen_random_uuid(), 'AR-B', 'Buenos Aires', 'AR', true, 2),
  (gen_random_uuid(), 'AR-K', 'Catamarca', 'AR', true, 3),
  (gen_random_uuid(), 'AR-H', 'Chaco', 'AR', true, 4),
  (gen_random_uuid(), 'AR-U', 'Chubut', 'AR', true, 5),
  (gen_random_uuid(), 'AR-X', 'Córdoba', 'AR', true, 6),
  (gen_random_uuid(), 'AR-W', 'Corrientes', 'AR', true, 7),
  (gen_random_uuid(), 'AR-E', 'Entre Ríos', 'AR', true, 8),
  (gen_random_uuid(), 'AR-P', 'Formosa', 'AR', true, 9),
  (gen_random_uuid(), 'AR-Y', 'Jujuy', 'AR', true, 10),
  (gen_random_uuid(), 'AR-L', 'La Pampa', 'AR', true, 11),
  (gen_random_uuid(), 'AR-F', 'La Rioja', 'AR', true, 12),
  (gen_random_uuid(), 'AR-M', 'Mendoza', 'AR', true, 13),
  (gen_random_uuid(), 'AR-N', 'Misiones', 'AR', true, 14),
  (gen_random_uuid(), 'AR-Q', 'Neuquén', 'AR', true, 15),
  (gen_random_uuid(), 'AR-R', 'Río Negro', 'AR', true, 16),
  (gen_random_uuid(), 'AR-A', 'Salta', 'AR', true, 17),
  (gen_random_uuid(), 'AR-J', 'San Juan', 'AR', true, 18),
  (gen_random_uuid(), 'AR-D', 'San Luis', 'AR', true, 19),
  (gen_random_uuid(), 'AR-Z', 'Santa Cruz', 'AR', true, 20),
  (gen_random_uuid(), 'AR-S', 'Santa Fe', 'AR', true, 21),
  (gen_random_uuid(), 'AR-G', 'Santiago del Estero', 'AR', true, 22),
  (gen_random_uuid(), 'AR-V', 'Tierra del Fuego', 'AR', true, 23),
  (gen_random_uuid(), 'AR-T', 'Tucumán', 'AR', true, 24)
ON CONFLICT ("code") DO UPDATE SET "name" = EXCLUDED."name", "sort_order" = EXCLUDED."sort_order", "is_active" = true;
