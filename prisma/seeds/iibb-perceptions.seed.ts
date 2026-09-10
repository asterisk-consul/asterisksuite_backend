/**
 * Seed idempotente de jurisdicciones y percepciones IIBB para un tenant.
 *
 * Uso:
 *   npx tsx prisma/seeds/iibb-perceptions.seed.ts <tenant>
 *   npx tsx prisma/seeds/iibb-perceptions.seed.ts dev
 */

import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { executeSeedSql } from './seed-sql'

const tenant = process.argv[2]

if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/iibb-perceptions.seed.ts <tenant>')
  console.error('Ejemplo: npx tsx prisma/seeds/iibb-perceptions.seed.ts dev')
  process.exit(1)
}

const databaseUrlBase = process.env.DATABASE_URL_BASE
if (!databaseUrlBase) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const tenantDb = `${tenant}_db`
const connectionString = `${databaseUrlBase}${tenantDb}`

const sqlFiles = [
  'prisma/migrations/20260907_iibb_party_rates/migration.sql',
  'prisma/migrations/20260907_iibb_perception_rules_seed/migration.sql',
  'prisma/migrations/20260909_activate_seeded_iibb_perceptions/migration.sql',
]

async function main() {
  console.log(`\nSeed de percepciones IIBB para tenant: ${tenantDb}\n`)

  for (const relativePath of sqlFiles) {
    const sql = readFileSync(resolve(process.cwd(), relativePath), 'utf8')
    process.stdout.write(`  ${relativePath}... `)
    await executeSeedSql(connectionString, sql)
    console.log('OK')
  }

  console.log(`\nPercepciones IIBB creadas/actualizadas para "${tenant}".`)
}

main().catch((error) => {
  console.error('\nError durante el seed de percepciones IIBB:', error.message)
  process.exit(1)
})
