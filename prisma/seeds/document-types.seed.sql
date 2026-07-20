-- Seed de tipos de documento para tenant
-- Ejecutar: npx prisma db execute --file prisma/seeds/document-types.seed.sql

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
  (gen_random_uuid(), 'NCB', 'Nota de Credito B', 1, 'CREDIT_NOTE', 'B', '132', true, true, true, true, true, true)
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
  (gen_random_uuid(), 'NDB', 'Nota de Debito B', 1, 'DEBIT_NOTE', 'B', '139', true, true, false, true, true, true)
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
  (gen_random_uuid(), 'NDA-C', 'Nota de Debito Compra A', -1, 'DEBIT_NOTE', 'A', '135', false, false, false, true, true, true)
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

-- REMITOS
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
