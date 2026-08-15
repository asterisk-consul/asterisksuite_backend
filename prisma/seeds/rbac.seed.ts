/**
 * RBAC Seed — Crea permisos y roles para un tenant
 *
 * Uso:
 *   npx tsx prisma/seeds/rbac.seed.ts <tenant>
 *
 * Datos importados de seed-sql.ts (fuente única de verdad)
 */

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import 'dotenv/config';
import { RBAC_PERMISSIONS, RBAC_ROLES } from './seed-sql';

const tenantArg = process.argv[2];

if (!tenantArg) {
  console.error('Usage: npx tsx prisma/seeds/rbac.seed.ts <tenant>');
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
  console.log('Seeding RBAC...');

  // 1. Crear permisos
  for (const perm of RBAC_PERMISSIONS) {
    await prisma.permissions.upsert({
      where: { code: perm.code },
      update: { description: perm.description, active: true },
      create: { code: perm.code, description: perm.description },
    });
  }
  console.log(`  ${RBAC_PERMISSIONS.length} permisos creados/actualizados`);

  // 2. Crear roles y asignar permisos
  for (const role of RBAC_ROLES) {
    const created = await prisma.business_roles.upsert({
      where: { code: role.code },
      update: { name: role.name, description: role.description, is_system: role.is_system },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
        is_system: role.is_system,
      },
    });

    // Limpiar permisos existentes del rol
    await prisma.business_role_permissions.deleteMany({
      where: { role_id: created.id },
    });

    // Obtener permisos por código
    const perms = await prisma.permissions.findMany({
      where: { code: { in: role.permissionCodes }, active: true },
    });

    // Asignar permisos
    if (perms.length) {
      await prisma.business_role_permissions.createMany({
        data: perms.map((p) => ({
          role_id: created.id,
          permission_id: p.id,
        })),
      });
    }

    console.log(`  Rol "${role.name}" (${role.code}) → ${perms.length} permisos`);
  }

  console.log('RBAC seed completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
