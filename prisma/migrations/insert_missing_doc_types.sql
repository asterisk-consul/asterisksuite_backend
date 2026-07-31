-- Insertar 6 tipos de documento faltantes (NC/ND para letras B y C)
INSERT INTO tenant.document_types (id, code, description, direction, affects_stock, affects_accounting, affects_tax_book, active, category, afip_code, requires_cae, letter_type, is_electronic)
VALUES
  -- Ventas letra C (Monotributo/Exento)
  (gen_random_uuid(), 'NCC-A', 'Nota de Crédito C (Venta)', 1, true, true, true, true, 'CREDIT_NOTE', '203', true, 'C', true),
  (gen_random_uuid(), 'NDC-A', 'Nota de Débito C (Venta)', 1, false, true, true, true, 'DEBIT_NOTE', '213', true, 'C', true),
  -- Compras letra B (Consumidor Final)
  (gen_random_uuid(), 'NCB-C', 'Nota de Crédito B Compra', -1, true, true, true, true, 'CREDIT_NOTE', '132', false, 'B', false),
  (gen_random_uuid(), 'NDB-C', 'Nota de Débito B Compra', -1, false, true, true, true, 'DEBIT_NOTE', '139', false, 'B', false),
  -- Compras letra C (Monotributo/Exento)
  (gen_random_uuid(), 'NCC-C', 'Nota de Crédito C Compra', -1, true, true, true, true, 'CREDIT_NOTE', '203', false, 'C', false),
  (gen_random_uuid(), 'NDC-C', 'Nota de Débito C Compra', -1, false, true, true, true, 'DEBIT_NOTE', '213', false, 'C', false);
