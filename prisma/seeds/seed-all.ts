/**
 * Unified Seed — Ejecuta todos los seeds para un tenant existente
 *
 * Uso:
 *   npx tsx prisma/seeds/seed-all.ts <tenant>
 *
 * Este script es IDEMPOTENTE — puede ejecutarse múltiples veces sin perder datos.
 * Usa ON CONFLICT DO NOTHING/UPDATE en vez de DELETE.
 *
 * Datos importados de seed-sql.ts (fuente única de verdad)
 */

import { execSync } from 'child_process'
import { Pool } from 'pg'
import {
  SQL_TAXES,
  SQL_TAX_CATEGORIES,
  SQL_TAX_CATEGORY_TAXES,
  SQL_PRODUCT_TAX_CATEGORY,
  SQL_DOCUMENT_TYPES,
  SQL_DOCUMENT_TYPE_TAXES,
  SQL_BANK_CONCEPTS,
  SQL_DOCUMENT_SEQUENCES,
  SQL_LINK_SEQUENCES,
  executeSeedSql,
} from './seed-sql'

// ─── Args ─────────────────────────────────────────────────
const tenant = process.argv[2]

if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/seed-all.ts <tenant>')
  console.error('   Ejemplo: npx tsx prisma/seeds/seed-all.ts dev')
  process.exit(1)
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const tenantDb = `${tenant}_db`
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`

console.log(`\nSeed unificado para tenant: ${tenantDb}\n`)

// ─── SQL Runner ───────────────────────────────────────────
async function runSql(label: string, sql: string) {
  console.log(`  ${label}...`)
  try {
    await executeSeedSql(connectionString, sql)
    console.log(`  OK`)
  } catch (e: any) {
    console.error(`  ERROR: ${e.message}`)
  }
}

// ─── Main ─────────────────────────────────────────────────
async function main() {
  const startTime = Date.now()

  // 1. Impuestos
  await runSql('Impuestos (IVA, percepciones, retenciones)', SQL_TAXES)

  // 2. Categorías fiscales
  await runSql('Categorías fiscales', SQL_TAX_CATEGORIES)

  // 3. Asociaciones categoría ↔ impuesto
  await runSql('Asociaciones categoría ↔ impuesto', SQL_TAX_CATEGORY_TAXES)

  // 4. Productos sin categoría → GRAV_21
  await runSql('Asignar GRAV_21 a productos sin categoría', SQL_PRODUCT_TAX_CATEGORY)

  // 5. Tipos de documento
  await runSql('Tipos de documento', SQL_DOCUMENT_TYPES)

  // 6. Document types ↔ impuestos
  await runSql('Document types ↔ impuestos', SQL_DOCUMENT_TYPE_TAXES)

  // 7. Secuencias de documentos
  await runSql('Secuencias de documentos', SQL_DOCUMENT_SEQUENCES)

  // 8. Vincular document_types ↔ secuencias
  await runSql('Vincular document_types ↔ secuencias', SQL_LINK_SEQUENCES)

  // 9. Conceptos bancarios
  await runSql('Conceptos bancarios', SQL_BANK_CONCEPTS)

  // 10. Plan de cuentas (TypeScript seed)
  console.log('  Plan de cuentas...')
  try {
    execSync(`npx tsx prisma/seeds/accounts.seed.ts ${tenant}`, {
      stdio: 'inherit',
      timeout: 60000,
    })
    console.log('  OK')
  } catch (e) {
    console.log('  Error (puede que ya exista)')
  }

  // 11. RBAC — permisos y roles (TypeScript seed)
  console.log('  RBAC (permisos y roles)...')
  try {
    execSync(`npx tsx prisma/seeds/rbac.seed.ts ${tenant}`, {
      stdio: 'inherit',
      timeout: 60000,
    })
    console.log('  OK')
  } catch (e) {
    console.log('  Error (puede que ya exista)')
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log(`\nSeed completado para "${tenant}" en ${elapsed}s`)
}

main().catch((e) => {
  console.error('Error durante el seed:', e.message)
  process.exit(1)
})
