-- ============================================================
-- Crear 6 secuencias por letra (3 ventas + 3 compras)
-- y vincular a los document_types correspondientes
-- ============================================================

-- 1. Crear secuencias nuevas
INSERT INTO tenant.document_sequences (id, name, automatic, point_of_sale, current_number, prefix, active)
VALUES
  (gen_random_uuid(), 'Ventas A', true, '0001', 0, 'A', true),
  (gen_random_uuid(), 'Ventas B', true, '0001', 0, 'B', true),
  (gen_random_uuid(), 'Ventas C', true, '0001', 0, 'C', true),
  (gen_random_uuid(), 'Compras A', true, '0001', 0, 'A', true),
  (gen_random_uuid(), 'Compras B', true, '0001', 0, 'B', true),
  (gen_random_uuid(), 'Compras C', true, '0001', 0, 'C', true)
ON CONFLICT DO NOTHING;

-- 2. Desvincular secuencias viejas de todos los document_types
UPDATE tenant.document_types SET document_sequence_id = NULL;

-- 3. Vincular por letra - VENTAS
UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas A' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FA-A', 'NCA', 'NDA', 'NCC-A', 'NDC-A');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas B' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FB-A', 'NCB', 'NDB');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas C' AND point_of_sale = '0001' LIMIT 1
) WHERE code = 'FC-A';

-- 4. Vincular por letra - COMPRAS
UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras A' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FA-C', 'NCA-C', 'NDA-C');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras B' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FB-C', 'NCB-C', 'NDB-C');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras C' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FC-C', 'NCC-C', 'NDC-C');

-- 5. Verificar resultado
SELECT dt.code, dt.description, ds.name as sequence_name, ds.point_of_sale, ds.prefix, ds.current_number
FROM tenant.document_types dt
LEFT JOIN tenant.document_sequences ds ON dt.document_sequence_id = ds.id
WHERE dt.active = true
ORDER BY dt.direction, dt.letter_type, dt.code;
