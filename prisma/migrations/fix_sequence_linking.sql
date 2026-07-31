-- Corregir vinculación de NCC-A y NDC-A a "Ventas C"
UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas C' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('NCC-A', 'NDC-A');

-- Y NCC-C y NDC-C a "Compras C"
UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras C' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('NCC-C', 'NDC-C');

-- Verificar
SELECT dt.code, dt.letter_type, ds.name as sequence_name, ds.prefix
FROM tenant.document_types dt
LEFT JOIN tenant.document_sequences ds ON dt.document_sequence_id = ds.id
WHERE dt.active = true AND dt.category IN ('INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE')
ORDER BY dt.direction, dt.letter_type, dt.code;
