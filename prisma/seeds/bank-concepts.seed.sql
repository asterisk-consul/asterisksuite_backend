-- Seed de Conceptos Bancarios
-- Ejecutar: npx prisma db execute --file prisma/seeds/bank-concepts.seed.sql

DELETE FROM tenant.bank_movements WHERE concept_id IS NOT NULL;

DELETE FROM tenant.bank_concepts;

-- COMISIONES
INSERT INTO tenant.bank_concepts (id, code, name, description, concept_type, accounting_account, calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage, is_active)
VALUES
  (gen_random_uuid(), 'COMISION', 'Comisión bancaria', 'Comisión por servicios bancarios', 'COMMISSION', '6201', true, 21.000, true, true, 0.800, true),
  (gen_random_uuid(), 'COMISION_DEP', 'Comisión por depósito', 'Comisión al depositar cheques o efectivo', 'COMMISSION', '6201', true, 21.000, true, true, 0.500, true),
  (gen_random_uuid(), 'COMISION_TRANSF', 'Comisión por transferencia', 'Comisión al transferir fondos', 'COMMISSION', '6201', true, 21.000, true, true, 0.500, true),
  (gen_random_uuid(), 'COMISION_MANT', 'Comisión por mantenimiento', 'Cargo fijo mensual de mantenimiento', 'COMMISSION', '6201', true, 21.000, true, true, NULL, true);

-- IMPUESTOS BANCARIOS
INSERT INTO tenant.bank_concepts (id, code, name, description, concept_type, accounting_account, calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage, is_active)
VALUES
  (gen_random_uuid(), 'IMP_DEBITOS', 'Imp. Débitos y Créditos', 'Impuesto a los débitos y créditos bancarios', 'TAX', '6202', false, NULL, false, false, 0.600, true),
  (gen_random_uuid(), 'IMP_SELLOS', 'Imp. Sellos', 'Impuesto de sellos', 'TAX', '6202', false, NULL, false, false, 1.000, true),
  (gen_random_uuid(), 'IMP_CHEQUE', 'Imp. al Cheque', 'Impuesto a los cheques', 'TAX', '6202', false, NULL, false, false, NULL, true);

-- GASTOS
INSERT INTO tenant.bank_concepts (id, code, name, description, concept_type, accounting_account, calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage, is_active)
VALUES
  (gen_random_uuid(), 'GASTO_ADMIN', 'Gasto administrativo', 'Gastos varios de administración bancaria', 'EXPENSE', '6203', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'GASTO_COBRANZA', 'Gasto de cobranza', 'Gastos por cobranza de cheques', 'EXPENSE', '6203', false, NULL, false, false, NULL, true);

-- INTERESES
INSERT INTO tenant.bank_concepts (id, code, name, description, concept_type, accounting_account, calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage, is_active)
VALUES
  (gen_random_uuid(), 'INTERES_DESC', 'Interés por descubierto', 'Interés por descubierto bancario', 'INTEREST', '6204', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'INTERES_PUNT', 'Interés punitorio', 'Interés punitorio por mora', 'INTEREST', '6204', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'INTERES_CAP', 'Interés capitalizable', 'Interés que se capitaliza', 'INTEREST', '6204', false, NULL, false, false, NULL, true);

-- AJUSTES
INSERT INTO tenant.bank_concepts (id, code, name, description, concept_type, accounting_account, calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage, is_active)
VALUES
  (gen_random_uuid(), 'AJUSTE_BCRA', 'Ajuste BCRA', 'Ajuste por resolución BCRA', 'ADJUSTMENT', '6205', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'DIF_CAMBIO', 'Diferencia de cambio', 'Diferencia por tipo de cambio', 'ADJUSTMENT', '6205', false, NULL, false, false, NULL, true);
