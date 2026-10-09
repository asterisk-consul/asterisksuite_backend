/**
 * Aplica la migración de movimientos/conceptos bancarios a un tenant existente.
 *
 * Uso:
 *   npx tsx prisma/seeds/apply-bank-migration.ts <tenant>
 *
 * Es seguro ejecutarlo más de una vez: si el enum BankMovementType ya existe,
 * no vuelve a aplicar el script. Los tenants nuevos ya se crean con el esquema
 * actualizado, por lo que no necesitan este script.
 */

import 'dotenv/config'
import { readFileSync } from 'fs'
import { join } from 'path'
import { Client } from 'pg'

const tenant = process.argv[2]

if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/apply-bank-migration.ts <tenant>')
  process.exit(1)
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const tenantDb = `${tenant}_db`
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`

const migrationPath = join(
  process.cwd(),
  'prisma',
  'migrations',
  '20261007_bank_movements_concepts',
  'migration.sql',
)

async function main() {
  const client = new Client({ connectionString, options: '-c search_path="tenant",public' })
  await client.connect()
  try {
    const { rows } = await client.query(
      `SELECT 1 FROM pg_type WHERE typname = 'BankMovementType'`,
    )
    if (rows.length > 0) {
      console.log(`Tenant ${tenantDb}: migración ya aplicada (BankMovementType existe). Nada para hacer.`)
      return
    }

    const sql = readFileSync(migrationPath, 'utf8')
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log(`Tenant ${tenantDb}: migración bancaria aplicada correctamente.`)
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined)
    console.error(`Tenant ${tenantDb}: error aplicando la migración:`, error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
