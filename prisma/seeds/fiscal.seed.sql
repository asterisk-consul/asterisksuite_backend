-- ═══════════════════════════════════════════════════════════════
-- SEED MOTOR FISCAL — Jurisdicciones, conceptos y reglas AR
-- Ejecutar: npx prisma db execute --file prisma/seeds/fiscal.seed.sql
--
-- IMPORTANTE: las alícuotas y mínimos son valores de REFERENCIA.
-- Cada empresa debe verificarlos y ajustarlos según su padrón
-- vigente y la normativa de cada jurisdicción.
-- ═══════════════════════════════════════════════════════════════

-- Limpieza (idempotencia)
DELETE FROM tenant.tax_rule_brackets;
DELETE FROM tenant.tax_rules;
DELETE FROM tenant.withholding_concepts;
DELETE FROM tenant.business_party_iibb_registrations;
DELETE FROM tenant.business_party_withholding_profiles;
DELETE FROM tenant.company_tax_jurisdictions;
DELETE FROM tenant.tax_jurisdictions;

-- ─── JURISDICCIONES (24) ──────────────────────────────────────
INSERT INTO tenant.tax_jurisdictions (id, code, name, country, is_active, sort_order)
VALUES
  (gen_random_uuid(), 'AR-C',  'Ciudad Autónoma de Buenos Aires', 'AR', true, 1),
  (gen_random_uuid(), 'AR-B',  'Buenos Aires',                    'AR', true, 2),
  (gen_random_uuid(), 'AR-K',  'Catamarca',                       'AR', true, 3),
  (gen_random_uuid(), 'AR-H',  'Chaco',                           'AR', true, 4),
  (gen_random_uuid(), 'AR-U',  'Chubut',                          'AR', true, 5),
  (gen_random_uuid(), 'AR-X',  'Córdoba',                         'AR', true, 6),
  (gen_random_uuid(), 'AR-W',  'Corrientes',                      'AR', true, 7),
  (gen_random_uuid(), 'AR-E',  'Entre Ríos',                      'AR', true, 8),
  (gen_random_uuid(), 'AR-P',  'Formosa',                         'AR', true, 9),
  (gen_random_uuid(), 'AR-Y',  'Jujuy',                           'AR', true, 10),
  (gen_random_uuid(), 'AR-L',  'La Pampa',                        'AR', true, 11),
  (gen_random_uuid(), 'AR-F',  'La Rioja',                        'AR', true, 12),
  (gen_random_uuid(), 'AR-M',  'Mendoza',                         'AR', true, 13),
  (gen_random_uuid(), 'AR-N',  'Misiones',                        'AR', true, 14),
  (gen_random_uuid(), 'AR-Q',  'Neuquén',                         'AR', true, 15),
  (gen_random_uuid(), 'AR-R',  'Río Negro',                       'AR', true, 16),
  (gen_random_uuid(), 'AR-A',  'Salta',                           'AR', true, 17),
  (gen_random_uuid(), 'AR-J',  'San Juan',                        'AR', true, 18),
  (gen_random_uuid(), 'AR-D',  'San Luis',                        'AR', true, 19),
  (gen_random_uuid(), 'AR-Z',  'Santa Cruz',                      'AR', true, 20),
  (gen_random_uuid(), 'AR-S',  'Santa Fe',                        'AR', true, 21),
  (gen_random_uuid(), 'AR-G',  'Santiago del Estero',             'AR', true, 22),
  (gen_random_uuid(), 'AR-V',  'Tierra del Fuego',                'AR', true, 23),
  (gen_random_uuid(), 'AR-T',  'Tucumán',                         'AR', true, 24);

-- ─── CONCEPTOS DE RETENCIÓN ───────────────────────────────────
INSERT INTO tenant.withholding_concepts (id, code, name, description, is_active)
VALUES
  (gen_random_uuid(), 'OBRA',        'Locación de obra',       'Construcción / obra — aplica SUSS', true),
  (gen_random_uuid(), 'SERVICIO',    'Servicios',              'Locación de servicios — aplica SUSS', true),
  (gen_random_uuid(), 'HONORARIOS',  'Honorarios',             'Honorarios profesionales', true),
  (gen_random_uuid(), 'COMISIONES',  'Comisiones',             'Comisiones por intermediación', true),
  (gen_random_uuid(), 'ALQUILER',    'Alquileres',             'Locación de inmuebles/bienes', true),
  (gen_random_uuid(), 'VENTA_BIENES','Venta de bienes muebles','Régimen general Ganancias', true),
  (gen_random_uuid(), 'OTROS',       'Otros',                  'Otros conceptos', true);

-- ─── REGLAS GANANCIAS (RG 830/2019 y modif.) ─────────────────
-- Escala unificada 2% inscriptos locales. Mínimo no sujeto sobre
-- pagos acumulados del mes: VALOR DE REFERENCIA — VERIFICAR vigencia.
INSERT INTO tenant.tax_rules (
  id, name, tax_type, application_type, withholding_concept_id,
  operation_type, cuit_suffix_group, base_type, calculation_method,
  rate, minimum_amount, priority, is_active, valid_from
)
VALUES
  (
    gen_random_uuid(), 'Ganancias RG830 - Personas Jurídicas',
    'GANANCIAS', 'WITHHOLDING',
    (SELECT id FROM tenant.withholding_concepts WHERE code = 'VENTA_BIENES'),
    'PURCHASE', 'PJ', 'PAYMENT_AMOUNT', 'SCALE',
    2.0000, 200000.00, 10, true, '2024-01-01'
  ),
  (
    gen_random_uuid(), 'Ganancias RG830 - Personas Físicas',
    'GANANCIAS', 'WITHHOLDING',
    (SELECT id FROM tenant.withholding_concepts WHERE code = 'VENTA_BIENES'),
    'PURCHASE', 'PF', 'PAYMENT_AMOUNT', 'SCALE',
    2.0000, 200000.00, 10, true, '2024-01-01'
  ),
  (
    gen_random_uuid(), 'Ganancias RG830 - Honorarios',
    'GANANCIAS', 'WITHHOLDING',
    (SELECT id FROM tenant.withholding_concepts WHERE code = 'HONORARIOS'),
    'PURCHASE', NULL, 'PAYMENT_AMOUNT', 'SCALE',
    2.0000, 200000.00, 10, true, '2024-01-01'
  );

-- Escala del régimen general: acumulado > mínimo → 2% (tramo único editable)
INSERT INTO tenant.tax_rule_brackets (id, tax_rule_id, accumulated_from, accumulated_to, rate)
SELECT gen_random_uuid(), r.id, 0, r.minimum_amount, 0.0000
FROM tenant.tax_rules r
WHERE r.tax_type = 'GANANCIAS';

INSERT INTO tenant.tax_rule_brackets (id, tax_rule_id, accumulated_from, accumulated_to, rate)
SELECT gen_random_uuid(), r.id, r.minimum_amount, NULL, r.rate
FROM tenant.tax_rules r
WHERE r.tax_type = 'GANANCIAS';

-- ─── REGLAS SUSS (Ley 23.772 / PyME ex 2%) ───────────────────
-- General 2% sobre pagos por obra/servicio. Beneficiario PyME
-- inscripto → 1% (el motor lo resuelve con is_pyme del perfil).
INSERT INTO tenant.tax_rules (
  id, name, tax_type, application_type, withholding_concept_id,
  operation_type, base_type, calculation_method,
  rate, minimum_amount, priority, is_active, valid_from
)
VALUES
  (
    gen_random_uuid(), 'SUSS - Locación de obra/servicios',
    'SUSS', 'WITHHOLDING',
    (SELECT id FROM tenant.withholding_concepts WHERE code = 'OBRA'),
    'PURCHASE', 'PAYMENT_AMOUNT', 'RATE_TIMES_BASE',
    2.0000, NULL, 10, true, '2024-01-01'
  ),
  (
    gen_random_uuid(), 'SUSS - Servicios',
    'SUSS', 'WITHHOLDING',
    (SELECT id FROM tenant.withholding_concepts WHERE code = 'SERVICIO'),
    'PURCHASE', 'PAYMENT_AMOUNT', 'RATE_TIMES_BASE',
    2.0000, NULL, 10, true, '2024-01-01'
  );

-- ─── REGLAS IIBB — Inscripción directa (alícuotas de referencia) ──
-- Una regla por jurisdicción para inscriptos + una para no inscriptos.
-- Alícuotas DE REFERENCIA — el padrón de cada empresa manda.
INSERT INTO tenant.tax_rules (
  id, name, tax_type, application_type, jurisdiction_id,
  operation_type, base_type, calculation_method,
  rate, minimum_amount, priority, is_active, valid_from
)
SELECT
  gen_random_uuid(), 'IIBB ' || j.name || ' (Inscripto directo)',
  'IIBB', 'WITHHOLDING', j.id,
  'PURCHASE', 'PAYMENT_AMOUNT', 'RATE_TIMES_BASE',
  CASE j.code
    WHEN 'AR-C'  THEN 3.0000  -- CABA
    WHEN 'AR-B'  THEN 4.0000  -- Buenos Aires
    WHEN 'AR-X'  THEN 3.5000  -- Córdoba
    WHEN 'AR-S'  THEN 3.5000  -- Santa Fe
    WHEN 'AR-N'  THEN 4.5000  -- Misiones
    WHEN 'AR-V'  THEN 5.0000  -- Tierra del Fuego
    ELSE 3.0000               -- resto: valor base editable
  END,
  CASE j.code
    WHEN 'AR-B' THEN 60000.00  -- BA: mínimo no sujeto de referencia
    WHEN 'AR-X' THEN 30000.00
    ELSE NULL
  END,
  10, true, '2024-01-01'
FROM tenant.tax_jurisdictions j;

-- No inscriptos: alícuotas mayores (referencia)
INSERT INTO tenant.tax_rules (
  id, name, tax_type, application_type, jurisdiction_id,
  operation_type, base_type, calculation_method,
  rate, minimum_amount, priority, is_active, valid_from
)
SELECT
  gen_random_uuid(), 'IIBB ' || j.name || ' (No inscripto)',
  'IIBB', 'WITHHOLDING', j.id,
  'PURCHASE', 'PAYMENT_AMOUNT', 'RATE_TIMES_BASE',
  10.0000, NULL, 5, true, '2024-01-01'
FROM tenant.tax_jurisdictions j;

-- Retención IIBB en cobros (sufrida): base de referencia baja
-- (se activa por configuración de la empresa como agente)
-- No se siembra regla de cobro por jurisdicción: el motor resuelve
-- SUFRIDA con las retenciones que el cliente informa manualmente (V1).
