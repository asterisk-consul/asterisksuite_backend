-- Seed de impuestos para tenant argentino
-- Ejecutar: npx prisma db execute --file prisma/seeds/taxes.seed.sql

-- Primero eliminar impuestos existentes para evitar duplicados
DELETE FROM tenant.document_type_taxes;
DELETE FROM tenant.document_item_taxes;
DELETE FROM tenant.document_taxes;
DELETE FROM tenant.product_taxes;
DELETE FROM tenant.tax_category_taxes;
DELETE FROM tenant.taxes;

-- IVA (códigos estándar + códigos de importación Excel)
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'IVA_21', 'IVA 21%', 'IVA', 21.000, true, true, 'line'),
  (gen_random_uuid(), 'IVA_105', 'IVA 10.5%', 'IVA', 10.500, true, true, 'line'),
  (gen_random_uuid(), 'IVA_27', 'IVA 27%', 'IVA', 27.000, true, true, 'line'),
  (gen_random_uuid(), 'IVA_0', 'IVA 0%', 'IVA', 0.000, true, true, 'line'),
  -- Códigos usados por el importador de Excel (ventas/compras)
  (gen_random_uuid(), 'IMP_IVA1', 'IVA 21% (Importación)', 'IVA', 21.000, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA2', 'IVA 10.5% (Importación)', 'IVA', 10.500, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA3', 'IVA 27% (Importación)', 'IVA', 27.000, true, true, 'line');

-- PERCEPCIONES (códigos estándar + códigos de importación Excel)
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'PERC_IIBB', 'Percepción IIBB', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_IVA', 'Percepción IVA', 'PERCEPCION', 3.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_GANANCIAS', 'Percepción Ganancias', 'PERCEPCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_SUSS', 'Percepción SUSS', 'PERCEPCION', 1.000, true, true, 'DOCUMENT'),
  -- Códigos usados por el importador de Excel
  (gen_random_uuid(), 'COM_PERC_IIBB', 'Percepción IIBB (Compra)', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_MUN', 'Percepción Municipal (Compra)', 'PERCEPCION', 2.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_IVA', 'Percepción IVA (Compra)', 'PERCEPCION', 3.000, true, true, 'DOCUMENT');

-- RETENCIONES
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'RET_IVA', 'Retención IVA', 'RETENCION', 3.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_IIBB', 'Retención IIBB', 'RETENCION', 2.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_GANANCIAS', 'Retención Ganancias', 'RETENCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_SUSS', 'Retención SUSS', 'RETENCION', 1.000, true, true, 'DOCUMENT');

-- IMPUESTOS INTERNOS
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'IIII', 'Impuestos Internos', 'IMPUESTO_INTERNO', 10.000, true, true, 'line');

-- =====================================================
-- TAX CATEGORIES (si no existen)
-- =====================================================
INSERT INTO tenant.tax_categories (id, code, name, description, active)
VALUES
  (gen_random_uuid(), 'GRAV_21', 'Gravado 21%', 'IVA al 21%', true),
  (gen_random_uuid(), 'GRAV_105', 'Gravado 10.5%', 'IVA al 10.5%', true),
  (gen_random_uuid(), 'GRAV_27', 'Gravado 27%', 'IVA al 27%', true),
  (gen_random_uuid(), 'EXENTO', 'Exento', 'Sin IVA', true),
  (gen_random_uuid(), 'NO_GRAV', 'No Gravado', 'No gravado, no genera credito fiscal', true)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- TAX CATEGORY ↔ TAX ASSOCIATIONS
-- =====================================================
-- Asociar IVA 21% con GRAV_21
INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT
  gen_random_uuid(),
  tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_21' AND t.rate = 21.000
WHERE tc.code = 'GRAV_21'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

-- Asociar IVA 10.5% con GRAV_105
INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT
  gen_random_uuid(),
  tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_105' AND t.rate = 10.500
WHERE tc.code = 'GRAV_105'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

-- Asociar IVA 27% con GRAV_27
INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT
  gen_random_uuid(),
  tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_27' AND t.rate = 27.000
WHERE tc.code = 'GRAV_27'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

