-- Seed de tipos de documento para tenant
-- Ejecutar: npx prisma db execute --file prisma/seeds/document-types.seed.sql

-- SECUENCIAS DE DOCUMENTOS por letra
INSERT INTO tenant.document_sequences (id, name, automatic, point_of_sale, current_number, prefix, active)
VALUES
  (gen_random_uuid(), 'Ventas A', true, '0001', 0, 'A', true),
  (gen_random_uuid(), 'Ventas B', true, '0001', 0, 'B', true),
  (gen_random_uuid(), 'Ventas C', true, '0001', 0, 'C', true),
  (gen_random_uuid(), 'Compras A', true, '0002', 0, 'A', true),
  (gen_random_uuid(), 'Compras B', true, '0002', 0, 'B', true),
  (gen_random_uuid(), 'Compras C', true, '0002', 0, 'C', true),
  (gen_random_uuid(), 'Operaciones Internacionales', true, '0003', 0, 'IMP', true),
  (gen_random_uuid(), 'MAINTENANCE_ORDER', true, '0000', 0, 'MO', true)
ON CONFLICT DO NOTHING;

-- FACTURAS DE VENTA
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'FA-A', 'Factura A - Responsable Inscripto', 1, 'INVOICE', 'A', '01', true, true, true, true, true, true),
  (gen_random_uuid(), 'FB-A', 'Factura B - Consumidor Final', 1, 'INVOICE', 'B', '06', true, true, true, true, true, true),
  (gen_random_uuid(), 'FC-A', 'Factura C - Exento', 1, 'INVOICE', 'C', '11', true, true, true, true, true, true),
  (gen_random_uuid(), 'FX-A', 'Factura X - Comprobante interno', 1, 'INVOICE', 'X', null, false, false, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- NOTAS DE CREDITO VENTA
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'NCA', 'Nota de Credito A', 1, 'CREDIT_NOTE', 'A', '128', true, true, true, true, true, true),
  (gen_random_uuid(), 'NCB', 'Nota de Credito B', 1, 'CREDIT_NOTE', 'B', '132', true, true, true, true, true, true),
  (gen_random_uuid(), 'NCC-A', 'Nota de Crédito C (Venta)', 1, 'CREDIT_NOTE', 'C', '203', true, true, true, true, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- NOTAS DE DEBITO VENTA
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'NDA', 'Nota de Debito A', 1, 'DEBIT_NOTE', 'A', '135', true, true, false, true, true, true),
  (gen_random_uuid(), 'NDB', 'Nota de Debito B', 1, 'DEBIT_NOTE', 'B', '139', true, true, false, true, true, true),
  (gen_random_uuid(), 'NDC-A', 'Nota de Débito C (Venta)', 1, 'DEBIT_NOTE', 'C', '213', true, true, false, true, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- FACTURAS DE COMPRA
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'FA-C', 'Factura A Compra - Proveedor RI', -1, 'INVOICE', 'A', '01', false, false, true, true, true, true),
  (gen_random_uuid(), 'FB-C', 'Factura B Compra - Proveedor CF', -1, 'INVOICE', 'B', '06', false, false, true, true, true, true),
  (gen_random_uuid(), 'FC-C', 'Factura C Compra - Proveedor Exento', -1, 'INVOICE', 'C', '11', false, false, true, true, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- NOTAS DE COMPRA
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'NCA-C', 'Nota de Credito Compra A', -1, 'CREDIT_NOTE', 'A', '128', false, false, true, true, true, true),
  (gen_random_uuid(), 'NCB-C', 'Nota de Crédito B Compra', -1, 'CREDIT_NOTE', 'B', '132', false, false, true, true, true, true),
  (gen_random_uuid(), 'NCC-C', 'Nota de Crédito C Compra', -1, 'CREDIT_NOTE', 'C', '203', false, false, true, true, true, true),
  (gen_random_uuid(), 'NDA-C', 'Nota de Debito Compra A', -1, 'DEBIT_NOTE', 'A', '135', false, false, false, true, true, true),
  (gen_random_uuid(), 'NDB-C', 'Nota de Débito B Compra', -1, 'DEBIT_NOTE', 'B', '139', false, false, false, true, true, true),
  (gen_random_uuid(), 'NDC-C', 'Nota de Débito C Compra', -1, 'DEBIT_NOTE', 'C', '213', false, false, false, true, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- ORDENES
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'OV', 'Orden de Venta', 1, 'ORDER', null, null, false, false, false, false, false, true),
  (gen_random_uuid(), 'OC', 'Orden de Compra', -1, 'ORDER', null, null, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- PRESUPUESTOS
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'PRES', 'Presupuesto', 1, 'QUOTE', null, null, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- RECIBOS
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'REC', 'Recibo de Pago', 1, 'RECEIPT', null, null, false, false, false, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;

-- VINCULAR DOCUMENT_TYPES CON SECUENCIAS POR LETRA

-- VENTAS por letra
UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas A' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FA-A', 'NCA', 'NDA', 'NCC-A', 'NDC-A');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas B' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FB-A', 'NCB', 'NDB');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Ventas C' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FC-A', 'NCC-A', 'NDC-A');

-- COMPRAS por letra
UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras A' AND point_of_sale = '0002' LIMIT 1
) WHERE code IN ('FA-C', 'NCA-C', 'NDA-C');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras B' AND point_of_sale = '0002' LIMIT 1
) WHERE code IN ('FB-C', 'NCB-C', 'NDB-C');

UPDATE tenant.document_types SET document_sequence_id = (
  SELECT id FROM tenant.document_sequences WHERE name = 'Compras C' AND point_of_sale = '0002' LIMIT 1
) WHERE code IN ('FC-C', 'NCC-C', 'NDC-C');
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, active)
VALUES
  (gen_random_uuid(), 'REM-V', 'Remito de Venta', 1, 'REMITO', null, null, false, false, true, false, false, true),
  (gen_random_uuid(), 'REM-C', 'Remito de Compra', -1, 'REMITO', null, null, false, false, true, false, false, true),
  (gen_random_uuid(), 'REM-T', 'Remito de Traslado', 1, 'REMITO', null, null, false, false, true, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  direction = EXCLUDED.direction,
  category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type,
  afip_code = EXCLUDED.afip_code,
  requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic,
  affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting,
  affects_tax_book = EXCLUDED.affects_tax_book;
