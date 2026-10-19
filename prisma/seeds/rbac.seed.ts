/**
 * RBAC Seed — Crea permisos y roles para un tenant
 *
 * Uso:
 *   pnpm run seed:rbac <tenant>
 *   pnpm run seed:rbac -- <tenant>
 *
 * Datos importados de seed-sql.ts (fuente única de verdad)
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import 'dotenv/config';
import { RBAC_PERMISSIONS, RBAC_ROLES } from './seed-sql';

const tenantArg = process.argv
  .slice(2)
  .find((argument) => argument !== '--' && !argument.startsWith('-'));

if (!tenantArg) {
  console.error('Usage: pnpm run seed:rbac <tenant>');
  process.exit(1);
}

if (!/^[a-zA-Z0-9_-]+$/.test(tenantArg)) {
  console.error('Invalid tenant. Use only letters, numbers, hyphens, or underscores.');
  process.exit(1);
}

const DATABASE_URL_BASE = process.env.DATABASE_URL_BASE;
if (!DATABASE_URL_BASE) {
  console.error('DATABASE_URL_BASE environment variable is not defined');
  process.exit(1);
}

const tenantDb = `${tenantArg}_db`;
const connectionString = `${DATABASE_URL_BASE}${tenantDb}`;

console.log(`Connecting to tenant database: ${tenantDb}`);

const pool = new Pool({
  connectionString,
  options: `-c search_path="tenant",public`,
  max: 5,
});

const adapter = new PrismaPg(pool, { schema: 'tenant' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding RBAC (modo aditivo, no elimina asignaciones existentes)...');

  // 1. Crear permisos faltantes. Los existentes conservan su estado y configuración.
  for (const perm of RBAC_PERMISSIONS) {
    await prisma.permissions.upsert({
      where: { code: perm.code },
      update: {},
      create: { code: perm.code, description: perm.description },
    });
  }
  console.log(`  ${RBAC_PERMISSIONS.length} permisos verificados`);

  // 2. Crear roles faltantes y agregar únicamente las asignaciones predeterminadas
  //    que todavía no existan. Nunca se eliminan permisos personalizados.
  for (const role of RBAC_ROLES) {
    const created = await prisma.business_roles.upsert({
      where: { code: role.code },
      update: {},
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        is_system: role.is_system,
      },
    });

    // Obtener permisos por código
    const perms = await prisma.permissions.findMany({
      where: { code: { in: role.permissionCodes }, active: true },
    });

    // Agregar solamente las relaciones faltantes gracias a la PK compuesta.
    let addedPermissions = 0;
    if (perms.length) {
      const result = await prisma.business_role_permissions.createMany({
        data: perms.map((p) => ({
          role_id: created.id,
          permission_id: p.id,
        })),
        skipDuplicates: true,
      });
      addedPermissions = result.count;
    }

    console.log(
      `  Rol "${created.name}" (${created.code}) → ${addedPermissions} asignaciones nuevas; existentes preservadas`,
    );
  }

  console.log('RBAC seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
