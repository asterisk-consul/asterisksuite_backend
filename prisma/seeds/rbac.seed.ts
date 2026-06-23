import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const permissions = [
  // Access Control
  { code: 'roles.read', description: 'Ver roles' },
  { code: 'roles.create', description: 'Crear roles' },
  { code: 'roles.update', description: 'Editar roles' },
  { code: 'roles.delete', description: 'Eliminar roles' },
  { code: 'roles.manage_permissions', description: 'Asignar permisos a roles' },
  { code: 'roles.test', description: 'Probar permisos de usuarios' },
  { code: 'permissions.read', description: 'Ver catálogo de permisos' },
  { code: 'users.read_roles', description: 'Ver roles de un usuario' },
  { code: 'users.assign_roles', description: 'Asignar roles a usuarios' },
  { code: 'users.read_permissions', description: 'Ver permisos efectivos de un usuario' },

  // Master Data
  { code: 'products.read', description: 'Ver productos' },
  { code: 'products.create', description: 'Crear productos' },
  { code: 'products.update', description: 'Editar productos' },
  { code: 'products.delete', description: 'Eliminar productos' },

  // ERP - Documents
  { code: 'documents.read', description: 'Ver documentos' },
  { code: 'documents.create', description: 'Crear documentos' },
  { code: 'documents.update', description: 'Editar documentos' },
  { code: 'documents.delete', description: 'Eliminar documentos' },
  { code: 'documents.confirm', description: 'Confirmar documentos' },
  { code: 'documents.cancel', description: 'Cancelar documentos' },

  // ERP - Currencies
  { code: 'currencies.read', description: 'Ver monedas' },
  { code: 'currencies.create', description: 'Crear monedas' },
  { code: 'currencies.update', description: 'Editar monedas' },
  { code: 'currencies.delete', description: 'Eliminar monedas' },

  // ERP - Taxes
  { code: 'taxes.read', description: 'Ver impuestos' },
  { code: 'taxes.create', description: 'Crear impuestos' },
  { code: 'taxes.update', description: 'Editar impuestos' },
  { code: 'taxes.delete', description: 'Eliminar impuestos' },

  // ERP - Accounts
  { code: 'accounts.read', description: 'Ver cuentas contables' },
  { code: 'accounts.create', description: 'Crear cuentas contables' },
  { code: 'accounts.update', description: 'Editar cuentas contables' },
  { code: 'accounts.delete', description: 'Eliminar cuentas contables' },

  // Inventory
  { code: 'units.read', description: 'Ver unidades de medida' },
  { code: 'units.create', description: 'Crear unidades de medida' },
  { code: 'units.update', description: 'Editar unidades de medida' },
  { code: 'units.delete', description: 'Eliminar unidades de medida' },

  { code: 'categories.read', description: 'Ver categorías' },
  { code: 'categories.create', description: 'Crear categorías' },
  { code: 'categories.update', description: 'Editar categorías' },
  { code: 'categories.delete', description: 'Eliminar categorías' },

  // Logística
  { code: 'warehouses.read', description: 'Ver almacenes' },
  { code: 'warehouses.create', description: 'Crear almacenes' },
  { code: 'warehouses.update', description: 'Editar almacenes' },
  { code: 'warehouses.delete', description: 'Eliminar almacenes' },

  { code: 'trips.read', description: 'Ver viajes' },
  { code: 'trips.create', description: 'Crear viajes' },
  { code: 'trips.update', description: 'Editar viajes' },
  { code: 'trips.delete', description: 'Eliminar viajes' },

  // Core
  { code: 'companies.read', description: 'Ver empresas' },
  { code: 'companies.create', description: 'Crear empresas' },
  { code: 'companies.update', description: 'Editar empresas' },
  { code: 'companies.delete', description: 'Eliminar empresas' },
];

const roles = [
  {
    code: 'admin',
    name: 'Administrador',
    description: 'Acceso total al sistema',
    is_system: true,
    permissionCodes: permissions.map((p) => p.code),
  },
  {
    code: 'manager',
    name: 'Gerente',
    description: 'Acceso a módulos de negocio sin administración de roles',
    is_system: true,
    permissionCodes: permissions
      .filter((p) => !p.code.startsWith('roles.') && !p.code.startsWith('users.') && !p.code.startsWith('permissions.'))
      .map((p) => p.code),
  },
  {
    code: 'user',
    name: 'Usuario',
    description: 'Lectura y escritura básica',
    is_system: true,
    permissionCodes: [
      'products.read',
      'products.create',
      'products.update',
      'documents.read',
      'documents.create',
      'documents.update',
      'currencies.read',
      'taxes.read',
      'accounts.read',
      'units.read',
      'units.create',
      'units.update',
      'categories.read',
      'categories.create',
      'categories.update',
      'warehouses.read',
      'trips.read',
      'companies.read',
    ],
  },
  {
    code: 'viewer',
    name: 'Observador',
    description: 'Solo lectura',
    is_system: true,
    permissionCodes: permissions.filter((p) => p.code.endsWith('.read')).map((p) => p.code),
  },
];

async function main() {
  console.log('Seeding RBAC...');

  // 1. Crear permisos
  for (const perm of permissions) {
    await prisma.permissions.upsert({
      where: { code: perm.code },
      update: { description: perm.description, active: true },
      create: { code: perm.code, description: perm.description },
    });
  }
  console.log(`  ${permissions.length} permisos creados/actualizados`);

  // 2. Crear roles y asignar permisos
  for (const role of roles) {
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
