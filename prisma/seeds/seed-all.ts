/**
 * Unified Seed — Ejecuta todos los seeds para un tenant existente
 *
 * Uso:
 *   npx tsx prisma/seeds/seed-all.ts <tenant>
 *
 * Ejemplos:
 *   npx tsx prisma/seeds/seed-all.ts dev
 *   npx tsx prisma/seeds/seed-all.ts avanzia
 *
 * Este script es IDEMPOTENTE — puede ejecutarse múltiples veces sin perder datos.
 * Usa ON CONFLICT DO NOTHING/UPDATE en vez de DELETE.
 */

import { execSync } from 'child_process'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'
import 'dotenv/config'

// ─── Args ─────────────────────────────────────────────────
const tenant = process.argv[2]

if (!tenant) {
  console.error('❌ Uso: npx tsx prisma/seeds/seed-all.ts <tenant>')
  console.error('   Ejemplo: npx tsx prisma/seeds/seed-all.ts dev')
  process.exit(1)
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE
if (!DATABASE_URL_BASE) {
  console.error('❌ DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const tenantDb = `${tenant}_db`
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`

console.log(`\n🌱 Seed unificado para tenant: ${tenantDb}`)
console.log(`   URL: ${connectionString.replace(/\/\/.*@/, '//***@')}\n`)

// ─── SQL Runner ───────────────────────────────────────────
async function runSql(label: string, sql: string) {
  console.log(`  📄 ${label}...`)
  const pool = new Pool({
    connectionString,
    options: `-c search_path=tenant,public`,
    max: 1,
  })
  try {
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .map(s => s.split('\n').filter(line => !line.trim().startsWith('--')).join('\n').trim())
      .filter(s => s.length > 0)

    let executed = 0
    for (const stmt of statements) {
      const preview = stmt.substring(0, 80).replace(/\n/g, ' ')
      console.log(`     ▶ ${preview}...`)
      const result = await pool.query(stmt)
      console.log(`     ✅ ${result.rowCount} fila(s) afectada(s)`)
      executed++
    }
    console.log(`  ✅ ${label} — OK (${executed} statements)`)
  } catch (e: any) {
    console.error(`  ❌ ${label} — ERROR: ${e.message}`)
    console.error(`     Detail: ${e.detail || 'sin detalle'}`)
    console.error(`     Hint: ${e.hint || 'sin hint'}`)
  } finally {
    await pool.end()
  }
}

async function debugConnection() {
  console.log('🔍 DEBUG — Verificando conexión...')
  console.log(`   DATABASE_URL_BASE: ${process.env.DATABASE_URL_BASE}`)
  console.log(`   Tenant DB: ${tenantDb}`)
  console.log(`   Connection string: ${connectionString.replace(/\/\/.*@/, '//***@')}`)

  const pool = new Pool({ connectionString, max: 1 })
  try {
    const dbCheck = await pool.query(`SELECT current_database()`)
    console.log(`   ✅ Conectado a: ${dbCheck.rows[0].current_database}`)

    const schemas = await pool.query(`SELECT schema_name FROM information_schema.schemata ORDER BY schema_name`)
    console.log(`   📋 Schemas: ${schemas.rows.map(r => r.schema_name).join(', ')}`)

    const hasTenant = schemas.rows.some(r => r.schema_name === 'tenant')
    if (hasTenant) {
      const tables = await pool.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'tenant' ORDER BY table_name`)
      console.log(`   📋 Tablas en tenant: ${tables.rows.map(r => r.table_name).join(', ')}`)
    } else {
      console.log(`   ⚠️  Schema "tenant" NO existe en la base de datos`)
    }
  } catch (e: any) {
    console.error(`   ❌ Error de conexión: ${e.message}`)
  } finally {
    await pool.end()
  }
  console.log('')
}

// ─── SQL Definitions ──────────────────────────────────────

const SQL_TAXES = `
-- Impuestos IVA
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'IVA_21', 'IVA 21%', 'IVA', 21.000, true, true, 'line'),
  (gen_random_uuid(), 'IVA_105', 'IVA 10.5%', 'IVA', 10.500, true, true, 'line'),
  (gen_random_uuid(), 'IVA_27', 'IVA 27%', 'IVA', 27.000, true, true, 'line'),
  (gen_random_uuid(), 'IVA_0', 'IVA 0%', 'IVA', 0.000, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA1', 'IVA 21% (Importación)', 'IVA', 21.000, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA2', 'IVA 10.5% (Importación)', 'IVA', 10.500, true, true, 'line'),
  (gen_random_uuid(), 'IMP_IVA3', 'IVA 27% (Importación)', 'IVA', 27.000, true, true, 'line')
ON CONFLICT DO NOTHING;

-- Percepciones
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'PERC_IIBB', 'Percepción IIBB', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_IVA', 'Percepción IVA', 'PERCEPCION', 3.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_GANANCIAS', 'Percepción Ganancias', 'PERCEPCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'PERC_SUSS', 'Percepción SUSS', 'PERCEPCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_IIBB', 'Percepción IIBB (Compra)', 'PERCEPCION', 3.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_MUN', 'Percepción Municipal (Compra)', 'PERCEPCION', 2.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'COM_PERC_IVA', 'Percepción IVA (Compra)', 'PERCEPCION', 3.000, true, true, 'DOCUMENT')
ON CONFLICT DO NOTHING;

-- Retenciones
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'RET_IVA', 'Retención IVA', 'RETENCION', 3.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_IIBB', 'Retención IIBB', 'RETENCION', 2.500, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_GANANCIAS', 'Retención Ganancias', 'RETENCION', 1.000, true, true, 'DOCUMENT'),
  (gen_random_uuid(), 'RET_SUSS', 'Retención SUSS', 'RETENCION', 1.000, true, true, 'DOCUMENT')
ON CONFLICT DO NOTHING;

-- Impuestos Internos
INSERT INTO tenant.taxes (id, code, name, tax_type, rate, is_percentage, active, calculation_level)
VALUES
  (gen_random_uuid(), 'IIII', 'Impuestos Internos', 'IMPUESTO_INTERNO', 10.000, true, true, 'line')
ON CONFLICT DO NOTHING;
`

const SQL_TAX_CATEGORIES = `
-- Categorías fiscales
INSERT INTO tenant.tax_categories (id, code, name, description, active)
VALUES
  (gen_random_uuid(), 'GRAV_21', 'Gravado 21%', 'IVA al 21%', true),
  (gen_random_uuid(), 'GRAV_105', 'Gravado 10.5%', 'IVA al 10.5%', true),
  (gen_random_uuid(), 'GRAV_27', 'Gravado 27%', 'IVA al 27%', true),
  (gen_random_uuid(), 'EXENTO', 'Exento', 'Sin IVA', true),
  (gen_random_uuid(), 'NO_GRAV', 'No Gravado', 'No gravado, no genera credito fiscal', true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name, description = EXCLUDED.description, active = true;
`

const SQL_TAX_CATEGORY_TAXES = `
-- Asociaciones categoría ↔ impuesto
INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT gen_random_uuid(), tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_21' AND t.rate = 21.000
WHERE tc.code = 'GRAV_21'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT gen_random_uuid(), tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_105' AND t.rate = 10.500
WHERE tc.code = 'GRAV_105'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;

INSERT INTO tenant.tax_category_taxes (id, tax_category_id, tax_id, is_included_in_price, active)
SELECT gen_random_uuid(), tc.id, t.id, false, true
FROM tenant.tax_categories tc
JOIN tenant.taxes t ON t.code = 'IVA_27' AND t.rate = 27.000
WHERE tc.code = 'GRAV_27'
ON CONFLICT (tax_category_id, tax_id) DO NOTHING;
`

const SQL_PRODUCT_TAX_CATEGORY = `
-- Asignar GRAV_21 por defecto a productos sin categoría
UPDATE tenant.products
SET tax_category_id = (
  SELECT id FROM tenant.tax_categories WHERE code = 'GRAV_21' LIMIT 1
)
WHERE tax_category_id IS NULL;
`

const SQL_DOCUMENT_TYPES = `
-- Facturas de venta
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'FA-A', 'Factura A - Responsable Inscripto', 1, 'INVOICE', 'A', '01', true, true, true, true, true, true, true),
  (gen_random_uuid(), 'FB-A', 'Factura B - Consumidor Final', 1, 'INVOICE', 'B', '06', true, true, true, true, true, true, true),
  (gen_random_uuid(), 'FC-A', 'Factura C - Exento', 1, 'INVOICE', 'C', '11', true, true, true, true, true, true, true),
  (gen_random_uuid(), 'FX-A', 'Factura X - Comprobante interno', 1, 'INVOICE', 'X', null, false, false, true, true, false, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code, requires_cae = EXCLUDED.requires_cae,
  is_electronic = EXCLUDED.is_electronic, affects_stock = EXCLUDED.affects_stock,
  affects_accounting = EXCLUDED.affects_accounting, affects_tax_book = EXCLUDED.affects_tax_book,
  affects_payment = EXCLUDED.affects_payment;

-- Notas de crédito venta
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'NCA', 'Nota de Crédito A', 1, 'CREDIT_NOTE', 'A', '128', true, true, true, true, true, false, true),
  (gen_random_uuid(), 'NCB', 'Nota de Crédito B', 1, 'CREDIT_NOTE', 'B', '132', true, true, true, true, true, false, true),
  (gen_random_uuid(), 'NCC-A', 'Nota de Crédito C (Venta)', 1, 'CREDIT_NOTE', 'C', '203', true, true, true, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Notas de débito venta
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'NDA', 'Nota de Débito A', 1, 'DEBIT_NOTE', 'A', '135', true, true, false, true, true, false, true),
  (gen_random_uuid(), 'NDB', 'Nota de Débito B', 1, 'DEBIT_NOTE', 'B', '139', true, true, false, true, true, false, true),
  (gen_random_uuid(), 'NDC-A', 'Nota de Débito C (Venta)', 1, 'DEBIT_NOTE', 'C', '213', true, true, false, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Facturas de compra
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'FA-C', 'Factura A Compra - Proveedor RI', -1, 'INVOICE', 'A', '01', false, false, true, true, true, true, true),
  (gen_random_uuid(), 'FB-C', 'Factura B Compra - Proveedor CF', -1, 'INVOICE', 'B', '06', false, false, true, true, true, true, true),
  (gen_random_uuid(), 'FC-C', 'Factura C Compra - Proveedor Exento', -1, 'INVOICE', 'C', '11', false, false, true, true, true, true, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Notas de compra
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'NCA-C', 'Nota de Crédito Compra A', -1, 'CREDIT_NOTE', 'A', '128', false, false, true, true, true, false, true),
  (gen_random_uuid(), 'NCB-C', 'Nota de Crédito B Compra', -1, 'CREDIT_NOTE', 'B', '132', false, false, true, true, true, false, true),
  (gen_random_uuid(), 'NCC-C', 'Nota de Crédito C Compra', -1, 'CREDIT_NOTE', 'C', '203', false, false, true, true, true, false, true),
  (gen_random_uuid(), 'NDA-C', 'Nota de Débito Compra A', -1, 'DEBIT_NOTE', 'A', '135', false, false, false, true, true, false, true),
  (gen_random_uuid(), 'NDB-C', 'Nota de Débito B Compra', -1, 'DEBIT_NOTE', 'B', '139', false, false, false, true, true, false, true),
  (gen_random_uuid(), 'NDC-C', 'Nota de Débito C Compra', -1, 'DEBIT_NOTE', 'C', '213', false, false, false, true, true, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  letter_type = EXCLUDED.letter_type, afip_code = EXCLUDED.afip_code,
  affects_payment = EXCLUDED.affects_payment;

-- Órdenes
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'OV', 'Orden de Venta', 1, 'ORDER', null, null, false, false, false, false, false, false, true),
  (gen_random_uuid(), 'OC', 'Orden de Compra', -1, 'ORDER', null, null, false, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Presupuestos
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'PRES', 'Presupuesto', 1, 'QUOTE', null, null, false, false, false, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Recibos
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'REC', 'Recibo de Pago', 1, 'RECEIPT', null, null, false, false, false, true, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Remitos
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'REM-V', 'Remito de Venta', 1, 'REMITO', null, null, false, false, true, false, false, false, true),
  (gen_random_uuid(), 'REM-C', 'Remito de Compra', -1, 'REMITO', null, null, false, false, true, false, false, false, true),
  (gen_random_uuid(), 'REM-T', 'Remito de Traslado', 1, 'REMITO', null, null, false, false, true, false, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;

-- Saldos iniciales
INSERT INTO tenant.document_types (id, code, description, direction, category, letter_type, afip_code, requires_cae, is_electronic, affects_stock, affects_accounting, affects_tax_book, affects_payment, active)
VALUES
  (gen_random_uuid(), 'SI-C', 'Saldo Inicial (Cliente)', 1, 'OPENING_BALANCE', null, null, false, false, false, true, false, false, true),
  (gen_random_uuid(), 'SI-P', 'Saldo Inicial (Proveedor)', -1, 'OPENING_BALANCE', null, null, false, false, false, true, false, false, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description, direction = EXCLUDED.direction, category = EXCLUDED.category,
  affects_payment = EXCLUDED.affects_payment;
`

const SQL_DOCUMENT_TYPE_TAXES = `
-- Document types ↔ impuestos
INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('FA-A', 'FB-A', 'FC-A', 'FX-A')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('NCA', 'NCB')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('NDA', 'NDB')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code IN ('FA-C', 'FB-C', 'FC-C')
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code = 'NCA-C'
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;

INSERT INTO tenant.document_type_taxes (id, document_type_id, tax_id)
SELECT gen_random_uuid(), dt.id, t.id
FROM tenant.document_types dt
CROSS JOIN tenant.taxes t
WHERE dt.code = 'NDA-C'
  AND t.code IN ('IVA_21', 'IVA_105', 'IVA_27')
ON CONFLICT DO NOTHING;
`

const SQL_BANK_CONCEPTS = `
-- Conceptos bancarios
INSERT INTO tenant.bank_concepts (id, code, name, description, concept_type, accounting_account, calculates_iva, iva_rate, generates_credit, impacts_iva_book, default_percentage, is_active)
VALUES
  (gen_random_uuid(), 'COMISION', 'Comisión bancaria', 'Comisión por servicios bancarios', 'COMMISSION', '6201', true, 21.000, true, true, 0.800, true),
  (gen_random_uuid(), 'COMISION_DEP', 'Comisión por depósito', 'Comisión al depositar cheques o efectivo', 'COMMISSION', '6201', true, 21.000, true, true, 0.500, true),
  (gen_random_uuid(), 'COMISION_TRANSF', 'Comisión por transferencia', 'Comisión al transferir fondos', 'COMMISSION', '6201', true, 21.000, true, true, 0.500, true),
  (gen_random_uuid(), 'COMISION_MANT', 'Comisión por mantenimiento', 'Cargo fijo mensual de mantenimiento', 'COMMISSION', '6201', true, 21.000, true, true, NULL, true),
  (gen_random_uuid(), 'IMP_DEBITOS', 'Imp. Débitos y Créditos', 'Impuesto a los débitos y créditos bancarios', 'TAX', '6202', false, NULL, false, false, 0.600, true),
  (gen_random_uuid(), 'IMP_SELLOS', 'Imp. Sellos', 'Impuesto de sellos', 'TAX', '6202', false, NULL, false, false, 1.000, true),
  (gen_random_uuid(), 'IMP_CHEQUE', 'Imp. al Cheque', 'Impuesto a los cheques', 'TAX', '6202', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'GASTO_ADMIN', 'Gasto administrativo', 'Gastos varios de administración bancaria', 'EXPENSE', '6203', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'GASTO_COBRANZA', 'Gasto de cobranza', 'Gastos por cobranza de cheques', 'EXPENSE', '6203', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'INTERES_DESC', 'Interés por descubierto', 'Interés por descubierto bancario', 'INTEREST', '6204', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'INTERES_PUNT', 'Interés punitorio', 'Interés punitorio por mora', 'INTEREST', '6204', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'INTERES_CAP', 'Interés capitalizable', 'Interés que se capitaliza', 'INTEREST', '6204', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'AJUSTE_BCRA', 'Ajuste BCRA', 'Ajuste por resolución BCRA', 'ADJUSTMENT', '6205', false, NULL, false, false, NULL, true),
  (gen_random_uuid(), 'DIF_CAMBIO', 'Diferencia de cambio', 'Diferencia por tipo de cambio', 'ADJUSTMENT', '6205', false, NULL, false, false, NULL, true)
ON CONFLICT DO NOTHING;
`

const SQL_DOCUMENT_SEQUENCES = `
-- Secuencias de documentos por letra (Ventas POS 0001, Compras POS 0002)
INSERT INTO document_sequences (id, name, automatic, point_of_sale, current_number, prefix, active)
VALUES
  (gen_random_uuid(), 'Ventas A', true, '0001', 0, 'A', true),
  (gen_random_uuid(), 'Ventas B', true, '0001', 0, 'B', true),
  (gen_random_uuid(), 'Ventas C', true, '0001', 0, 'C', true),
  (gen_random_uuid(), 'Compras A', true, '0002', 0, 'A', true),
  (gen_random_uuid(), 'Compras B', true, '0002', 0, 'B', true),
  (gen_random_uuid(), 'Compras C', true, '0002', 0, 'C', true)
ON CONFLICT DO NOTHING;
`

const SQL_LINK_SEQUENCES = `
-- Vincular document_types con secuencias por letra

-- VENTAS por letra
UPDATE document_types SET document_sequence_id = (
  SELECT id FROM document_sequences WHERE name = 'Ventas A' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FA-A', 'NCA', 'NDA', 'NCC-A', 'NDC-A');

UPDATE document_types SET document_sequence_id = (
  SELECT id FROM document_sequences WHERE name = 'Ventas B' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FB-A', 'NCB', 'NDB');

UPDATE document_types SET document_sequence_id = (
  SELECT id FROM document_sequences WHERE name = 'Ventas C' AND point_of_sale = '0001' LIMIT 1
) WHERE code IN ('FC-A', 'NCC-A', 'NDC-A');

-- COMPRAS por letra
UPDATE document_types SET document_sequence_id = (
  SELECT id FROM document_sequences WHERE name = 'Compras A' AND point_of_sale = '0002' LIMIT 1
) WHERE code IN ('FA-C', 'NCA-C', 'NDA-C');

UPDATE document_types SET document_sequence_id = (
  SELECT id FROM document_sequences WHERE name = 'Compras B' AND point_of_sale = '0002' LIMIT 1
) WHERE code IN ('FB-C', 'NCB-C', 'NDB-C');

UPDATE document_types SET document_sequence_id = (
  SELECT id FROM document_sequences WHERE name = 'Compras C' AND point_of_sale = '0002' LIMIT 1
) WHERE code IN ('FC-C', 'NCC-C', 'NDC-C');
`

// ─── Main ─────────────────────────────────────────────────
async function main() {
  const startTime = Date.now()

  await debugConnection()

  // 1. Impuestos
  await runSql('Impuestos (IVA, percepciones, retenciones)', SQL_TAXES)

  // 2. Categorías fiscales
  await runSql('Categorías fiscales (GRAV_21, GRAV_105, GRAV_27, EXENTO, NO_GRAV)', SQL_TAX_CATEGORIES)

  // 3. Asociaciones categoría ↔ impuesto
  await runSql('Asociaciones categoría ↔ impuesto', SQL_TAX_CATEGORY_TAXES)

  // 4. Productos sin categoría → GRAV_21
  await runSql('Asignar GRAV_21 a productos sin categoría', SQL_PRODUCT_TAX_CATEGORY)

  // 5. Tipos de documento
  await runSql('Tipos de documento (FA, FB, FC, NC, ND, OV, OC, REC, REM, PRES, FX)', SQL_DOCUMENT_TYPES)

  // 6. Document types ↔ impuestos
  await runSql('Document types ↔ impuestos', SQL_DOCUMENT_TYPE_TAXES)

  // 7. Secuencias de documentos
  await runSql('Secuencias de documentos (4 secuencias POS 0001)', SQL_DOCUMENT_SEQUENCES)

  // 8. Vincular document_types ↔ secuencias
  await runSql('Vincular document_types ↔ secuencias', SQL_LINK_SEQUENCES)

  // 9. Conceptos bancarios
  await runSql('Conceptos bancarios (13 conceptos)', SQL_BANK_CONCEPTS)

  // 10. Plan de cuentas (TypeScript seed)
  console.log('  📄 Plan de cuentas...')
  try {
    execSync(`npx tsx prisma/seeds/accounts.seed.ts ${tenant}`, {
      stdio: 'inherit',
      timeout: 60000,
    })
    console.log('  ✅ Plan de cuentas — OK')
  } catch (e) {
    console.log('  ⚠️  Plan de cuentas — error (puede que ya exista)')
  }

  // 11. RBAC — permisos y roles (TypeScript seed)
  console.log('  📄 RBAC (permisos y roles)...')
  try {
    execSync(`npx tsx prisma/seeds/rbac.seed.ts ${tenant}`, {
      stdio: 'inherit',
      timeout: 60000,
    })
    console.log('  ✅ RBAC — OK')
  } catch (e) {
    console.log('  ⚠️  RBAC — error (puede que ya exista)')
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\n🎉 Seed completado para "${tenant}" en ${elapsed}s`)
  console.log(`   DB: ${tenantDb}`)
  console.log(`   Impuestos: IVA 21/10.5/27/0 + percepciones + retenciones`)
  console.log(`   Categorías: GRAV_21, GRAV_105, GRAV_27, EXENTO, NO_GRAV`)
  console.log(`   Documentos: 14 tipos (venta + compra + órdenes + recibos + remitos)`)
  console.log(`   Secuencias: 4 (Ventas A/B/C + General) POS 0001`)
  console.log(`   Bancos: 13 conceptos`)
  console.log(`   Contabilidad: plan de cuentas argentino`)
  console.log(`   RBAC: permisos + 4 roles (admin, manager, user, viewer)\n`)
}

main().catch((e) => {
  console.error('❌ Error durante el seed:', e.message)
  process.exit(1)
})
