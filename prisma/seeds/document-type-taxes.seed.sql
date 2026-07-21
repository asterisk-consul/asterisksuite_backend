-- Seed de impuestos por tipo de documento y por producto
-- Ejecutar: npx prisma db execute --file prisma/seeds/document-type-taxes.seed.sql

-- ═══════════════════════════════════════════════════════════
-- DOCUMENT_TYPE_TAXES: Vincular tipos de documento con impuestos
-- ═══════════════════════════════════════════════════════════

-- Limpiar datos existentes
DELETE FROM tenant.document_type_taxes;

-- FACTURAS DE VENTA (FA-A, FB-A, FC-A, FX-A) → IVA 21%, IVA 10.5%, IVA 27%
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT
  gen_random_uuid(),
  dt.id,
  t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('FA-A', 'FB-A', 'FC-A', 'FX-A')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27');

-- NOTAS DE CRÉDITO VENTA (NCA, NCB) → IVA 21%, IVA 10.5%, IVA 27%
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT
  gen_random_uuid(),
  dt.id,
  t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('NCA', 'NCB')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27');

-- NOTAS DE DÉBITO VENTA (NDA, NDB) → IVA 21%, IVA 10.5%, IVA 27%
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT
  gen_random_uuid(),
  dt.id,
  t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('NDA', 'NDB')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27');

-- FACTURAS DE COMPRA (FA-C, FB-C, FC-C) → IVA 21%, IVA 10.5%, IVA 27%
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT
  gen_random_uuid(),
  dt.id,
  t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('FA-C', 'FB-C', 'FC-C')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27');

-- NOTAS DE CRÉDITO COMPRA (NCA-C) → IVA 21%, IVA 10.5%, IVA 27%
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT
  gen_random_uuid(),
  dt.id,
  t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code = 'NCA-C'
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27');

-- NOTAS DE DÉBITO COMPRA (NDA-C) → IVA 21%, IVA 10.5%, IVA 27%
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT
  gen_random_uuid(),
  dt.id,
  t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code = 'NDA-C'
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27');

-- ═══════════════════════════════════════════════════════════
-- PRODUCT_TAXES: Vincular TODOS los productos con IVA 21%
-- (por defecto, los productos usan IVA 21%)
-- ═══════════════════════════════════════════════════════════

-- Limpiar datos existentes
DELETE FROM tenant.product_taxes;

-- Asociar IVA 21% a todos los productos que no tengan impuestos
INSERT INTO tenant.product_taxes (id, product_id, tax_id, is_included_in_price)
SELECT
  gen_random_uuid(),
  p.id,
  t.id,
  false
FROM tenant.products p
CROSS JOIN tenant.taxes t
WHERE t.code = 'IVA_21'
  AND NOT EXISTS (
    SELECT 1 FROM tenant.product_taxes pt
    WHERE pt.product_id = p.id
  );

-- ═══════════════════════════════════════════════════════════
-- RESUMEN
-- ═══════════════════════════════════════════════════════════

SELECT 'document_type_taxes' as tabla, COUNT(*) as registros FROM tenant.document_type_taxes
UNION ALL
SELECT 'product_taxes', COUNT(*) FROM tenant.product_taxes;
