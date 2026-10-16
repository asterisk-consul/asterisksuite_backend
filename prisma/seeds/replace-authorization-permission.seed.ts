/** Registra el permiso de reemplazo de autorización fiscal (CAI) sin modificar roles existentes. */
import 'dotenv/config'
import { Pool } from 'pg'
import { RBAC_PERMISSIONS } from './seed-sql'

const tenant = process.argv[2]
if (!tenant) {
  console.error('Uso: npx tsx prisma/seeds/replace-authorization-permission.seed.ts <tenant>')
  process.exit(1)
}

const databaseUrlBase = process.env.DATABASE_URL_BASE
if (!databaseUrlBase) {
  console.error('DATABASE_URL_BASE no está definida en .env')
  process.exit(1)
}

const permissions = RBAC_PERMISSIONS.filter(({ code }) => code === 'delivery_notes.replace_authorization')

async function main() {
  const pool = new Pool({ connectionString: `${databaseUrlBase}${tenant}_db`, max: 2 })
  try {
    for (const permission of permissions) {
      const { rows: [permRow] } = await pool.query(
        `INSERT INTO tenant.permissions (id, code, description, active, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description, active = true, updated_at = CURRENT_TIMESTAMP
         RETURNING id, code`,
        [permission.code, permission.description],
      )
      // Admin y Manager reciben todos los permisos en el seed inicial; se refleja aquí.
      await pool.query(
        `INSERT INTO tenant.business_role_permissions (role_id, permission_id)
         SELECT r.id, $1::uuid FROM tenant.business_roles r
         WHERE r.code IN ('admin', 'manager') AND r.deleted_at IS NULL
         ON CONFLICT (role_id, permission_id) DO NOTHING`,
        [permRow.id],
      )
    }
    console.log(`${permissions.length} permiso(s) de reemplazo de autorización fiscal registrados en ${tenant}_db (asignados a roles admin y manager).`)
  } finally {
    await pool.end()
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
