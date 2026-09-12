-- Agregar códigos de impuestos usados por el importador de Excel
-- que no existen en el seed estándar
-- Ejecutar: npx prisma db execute --file prisma/seeds/taxes-import-codes.sql

-- IVA de importación (códigos del Excel)
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
SELECT gen_random_uuid(), 'IMP_IVA1', 'IVA 21% (Importación)', 'IVA', 21.000, true, true, 'ITEM'
WHERE NOT EXISTS (SELECT 1 FROM tenant.taxes WHERE code = 'IMP_IVA1');

INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
SELECT gen_random_uuid(), 'IMP_IVA2', 'IVA 10.5% (Importación)', 'IVA', 10.500, true, true, 'ITEM'
WHERE NOT EXISTS (SELECT 1 FROM tenant.taxes WHERE code = 'IMP_IVA2');

INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
SELECT gen_random_uuid(), 'IMP_IVA3', 'IVA 27% (Importación)', 'IVA', 27.000, true, true, 'ITEM'
WHERE NOT EXISTS (SELECT 1 FROM tenant.taxes WHERE code = 'IMP_IVA3');

-- Percepciones de compra (códigos del Excel)
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
SELECT gen_random_uuid(), 'COM_PERC_IIBB', 'Percepción IIBB (Compra)', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'
WHERE NOT EXISTS (SELECT 1 FROM tenant.taxes WHERE code = 'COM_PERC_IIBB');

INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
SELECT gen_random_uuid(), 'COM_PERC_MUN', 'Percepción Municipal (Compra)', 'PERCEPCION', 2.500, true, true, 'DOCUMENT'
WHERE NOT EXISTS (SELECT 1 FROM tenant.taxes WHERE code = 'COM_PERC_MUN');

INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
SELECT gen_random_uuid(), 'COM_PERC_IVA', 'Percepción IVA (Compra)', 'PERCEPCION', 3.000, true, true, 'DOCUMENT'
WHERE NOT EXISTS (SELECT 1 FROM tenant.taxes WHERE code = 'COM_PERC_IVA');
