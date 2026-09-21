/** Registra permisos de autorizaciones fiscales sin modificar roles existentes. */
import 'dotenv/config'
import { Pool } from 'pg'
import { RBAC_PERMISSIONS } from './seed-sql'

const tenant = process.argv[2]
if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/fiscal-authorizations-permissions.seed.ts <tenant>')
  process.exit(1)
}

const databaseUrlBase = process.env.DATABASE_URL_BASE
if (!databaseUrlBase) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const permissions = RBAC_PERMISSIONS.filter(({ code }) => code.startsWith('fiscal-authorizations.'))

async function main() {
  const pool = new Pool({ connectionString: `${databaseUrlBase}${tenant}_db`, max: 2 })
  try {
    for (const permission of permissions) {
      await pool.query(
        `INSERT INTO tenant.permissions (id, code, description, active, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description, active = true, updated_at = CURRENT_TIMESTAMP`,
        [permission.code, permission.description],
      )
    }
    console.log(`${permissions.length} permisos de autorizaciones fiscales registrados en ${tenant}_db. No se modificaron roles.`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
