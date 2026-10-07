/**
 * Seed idempotente de unidades de medida para un tenant existente.
 *
 * Uso:
 *   npx tsx prisma/seeds/units.seed.ts <tenant>
 *
 * Ejemplo:
 *   npx tsx prisma/seeds/units.seed.ts dev
 */
import 'dotenv/config'
import { executeSeedSql, SQL_UNITS } from './seed-sql'

const tenant = process.argv[2]

if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/units.seed.ts <tenant>')
  console.error('Ejemplo: npx tsx prisma/seeds/units.seed.ts dev')
  process.exit(1)
}

const databaseUrlBase = process.env.DATABASE_URL_BASE
if (!databaseUrlBase) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const tenantDatabase = `${tenant}_db`
const connectionString = `${databaseUrlBase}${tenantDatabase}`

async function main() {
  console.log(`Cargando unidades de medida en ${tenantDatabase}...`)
  await executeSeedSql(connectionString, SQL_UNITS)
  console.log('Unidades de medida actualizadas correctamente.')
}

main().catch((error: Error) => {
  console.error(`No se pudieron cargar las unidades: ${error.message}`)
  process.exit(1)
})
