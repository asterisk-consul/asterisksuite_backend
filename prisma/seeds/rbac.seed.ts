import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '@/generated/prisma/client';
import 'dotenv/config';

const tenantArg = process.argv[2];

if (!tenantArg) {
  console.error('Usage: npx tsx prisma/seeds/rbac.seed.ts <tenant>');
  console.error('Example: npx tsx prisma/seeds/rbac.seed.ts dev');
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

const permissions = [
  // ─── Access Control (ACTIVO) ───────────────────────────────────
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

  // ─── Master Data - Products (ACTIVO) ──────────────────────────
  { code: 'products.read', description: 'Ver productos' },
  { code: 'products.create', description: 'Crear productos' },
  { code: 'products.update', description: 'Editar productos' },
  { code: 'products.delete', description: 'Eliminar productos' },

  // ─── ERP - Documents (ACTIVO) ─────────────────────────────────
  { code: 'documents.read', description: 'Ver documentos' },
  { code: 'documents.create', description: 'Crear documentos' },
  { code: 'documents.update', description: 'Editar documentos' },
  { code: 'documents.delete', description: 'Eliminar documentos' },
  { code: 'documents.confirm', description: 'Confirmar documentos' },
  { code: 'documents.cancel', description: 'Cancelar documentos' },

  // ─── ERP - Currencies (ACTIVO) ────────────────────────────────
  { code: 'currencies.read', description: 'Ver monedas' },
  { code: 'currencies.create', description: 'Crear monedas' },
  { code: 'currencies.update', description: 'Editar monedas' },
  { code: 'currencies.delete', description: 'Eliminar monedas' },

  // ─── ERP - Taxes (ACTIVO) ─────────────────────────────────────
  { code: 'taxes.read', description: 'Ver impuestos' },
  { code: 'taxes.create', description: 'Crear impuestos' },
  { code: 'taxes.update', description: 'Editar impuestos' },
  { code: 'taxes.delete', description: 'Eliminar impuestos' },

  // ─── ERP - Accounts (ACTIVO) ──────────────────────────────────
  { code: 'accounts.read', description: 'Ver cuentas contables' },
  { code: 'accounts.create', description: 'Crear cuentas contables' },
  { code: 'accounts.update', description: 'Editar cuentas contables' },
  { code: 'accounts.delete', description: 'Eliminar cuentas contables' },

  // ─── Inventory - Units (ACTIVO) ───────────────────────────────
  { code: 'units.read', description: 'Ver unidades de medida' },
  { code: 'units.create', description: 'Crear unidades de medida' },
  { code: 'units.update', description: 'Editar unidades de medida' },
  { code: 'units.delete', description: 'Eliminar unidades de medida' },

  // ─── Inventory - Categories (ACTIVO) ──────────────────────────
  { code: 'categories.read', description: 'Ver categorías' },
  { code: 'categories.create', description: 'Crear categorías' },
  { code: 'categories.update', description: 'Editar categorías' },
  { code: 'categories.delete', description: 'Eliminar categorías' },

  // ─── Logística - Warehouses (ACTIVO) ──────────────────────────
  { code: 'warehouses.read', description: 'Ver almacenes' },
  { code: 'warehouses.create', description: 'Crear almacenes' },
  { code: 'warehouses.update', description: 'Editar almacenes' },
  { code: 'warehouses.delete', description: 'Eliminar almacenes' },

  // ─── Logística - Trips (ACTIVO) ───────────────────────────────
  { code: 'trips.read', description: 'Ver viajes' },
  { code: 'trips.create', description: 'Crear viajes' },
  { code: 'trips.update', description: 'Editar viajes' },
  { code: 'trips.delete', description: 'Eliminar viajes' },

  // ─── Core - Companies (ACTIVO) ────────────────────────────────
  { code: 'companies.read', description: 'Ver empresas' },
  { code: 'companies.create', description: 'Crear empresas' },
  { code: 'companies.update', description: 'Editar empresas' },
  { code: 'companies.delete', description: 'Eliminar empresas' },

  // ════════════════════════════════════════════════════════════════
  // MODULOS PENDIENTES (comentados — descomentar al habilitar)
  // ════════════════════════════════════════════════════════════════

  // ─── ERP - Currency Rates ─────────────────────────────────────
  // { code: 'currency_rates.read', description: 'Ver tipos de cambio' },
  // { code: 'currency_rates.create', description: 'Crear tipos de cambio' },
  // { code: 'currency_rates.update', description: 'Editar tipos de cambio' },
  // { code: 'currency_rates.delete', description: 'Eliminar tipos de cambio' },

  // ─── ERP - Document Types ─────────────────────────────────────
  // { code: 'document_types.read', description: 'Ver tipos de documento' },
  // { code: 'document_types.create', description: 'Crear tipos de documento' },
  // { code: 'document_types.update', description: 'Editar tipos de documento' },
  // { code: 'document_types.delete', description: 'Eliminar tipos de documento' },

  // ─── ERP - Purchases ──────────────────────────────────────────
  // { code: 'purchases.read', description: 'Ver compras' },
  // { code: 'purchases.create', description: 'Crear compras' },
  // { code: 'purchases.update', description: 'Editar compras' },
  // { code: 'purchases.delete', description: 'Eliminar compras' },
  // { code: 'purchases.confirm', description: 'Confirmar compras' },
  // { code: 'purchases.cancel', description: 'Cancelar compras' },

  // ─── ERP - Sales Reports ──────────────────────────────────────
  // { code: 'sales_reports.read', description: 'Ver reportes de ventas' },

  // ─── ERP - Pricing ────────────────────────────────────────────
  // { code: 'pricing.read', description: 'Ver precios' },
  // { code: 'pricing.create', description: 'Crear precios' },
  // { code: 'pricing.update', description: 'Editar precios' },
  // { code: 'pricing.delete', description: 'Eliminar precios' },

  // ─── ERP - Exchange ───────────────────────────────────────────
  // { code: 'exchange.read', description: 'Ver tipo de cambio' },
  // { code: 'exchange.sync', description: 'Sincronizar tipo de cambio' },

  // ─── Master Data - Business Parties ───────────────────────────
  // { code: 'business_parties.read', description: 'Ver terceros' },
  // { code: 'business_parties.create', description: 'Crear terceros' },
  // { code: 'business_parties.update', description: 'Editar terceros' },
  // { code: 'business_parties.delete', description: 'Eliminar terceros' },

  // ─── Master Data - Contacts ───────────────────────────────────
  // { code: 'contacts.read', description: 'Ver contactos' },
  // { code: 'contacts.create', description: 'Crear contactos' },
  // { code: 'contacts.update', description: 'Editar contactos' },
  // { code: 'contacts.delete', description: 'Eliminar contactos' },

  // ─── Master Data - Locations ──────────────────────────────────
  // { code: 'locations.read', description: 'Ver ubicaciones' },
  // { code: 'locations.create', description: 'Crear ubicaciones' },
  // { code: 'locations.update', description: 'Editar ubicaciones' },
  // { code: 'locations.delete', description: 'Eliminar ubicaciones' },

  // ─── Master Data - Product Variants ───────────────────────────
  // { code: 'product_variants.read', description: 'Ver variantes de producto' },
  // { code: 'product_variants.create', description: 'Crear variantes de producto' },
  // { code: 'product_variants.update', description: 'Editar variantes de producto' },
  // { code: 'product_variants.delete', description: 'Eliminar variantes de producto' },

  // ─── Master Data - Product Components ─────────────────────────
  // { code: 'product_components.read', description: 'Ver componentes de producto' },
  // { code: 'product_components.create', description: 'Crear componentes de producto' },
  // { code: 'product_components.update', description: 'Editar componentes de producto' },
  // { code: 'product_components.delete', description: 'Eliminar componentes de producto' },

  // ─── Master Data - Product Attributes ─────────────────────────
  // { code: 'attributes.read', description: 'Ver atributos' },
  // { code: 'attributes.create', description: 'Crear atributos' },
  // { code: 'attributes.update', description: 'Editar atributos' },
  // { code: 'attributes.delete', description: 'Eliminar atributos' },

  // ─── Master Data - Product Attribute Values ───────────────────
  // { code: 'product_attribute_values.read', description: 'Ver valores de atributo' },
  // { code: 'product_attribute_values.create', description: 'Crear valores de atributo' },
  // { code: 'product_attribute_values.update', description: 'Editar valores de atributo' },
  // { code: 'product_attribute_values.delete', description: 'Eliminar valores de atributo' },

  // ─── Master Data - Product Categories ─────────────────────────
  // { code: 'product_categories.read', description: 'Ver categorías de producto' },
  // { code: 'product_categories.create', description: 'Asignar categorías a producto' },
  // { code: 'product_categories.delete', description: 'Quitar categorías de producto' },

  // ─── Master Data - Product Tags ───────────────────────────────
  // { code: 'tags.read', description: 'Ver etiquetas' },
  // { code: 'tags.create', description: 'Crear etiquetas' },
  // { code: 'tags.update', description: 'Editar etiquetas' },
  // { code: 'tags.delete', description: 'Eliminar etiquetas' },
  // { code: 'product_tags.read', description: 'Ver etiquetas de producto' },
  // { code: 'product_tags.create', description: 'Asignar etiquetas a producto' },
  // { code: 'product_tags.delete', description: 'Quitar etiquetas de producto' },

  // ─── Master Data - Engineering ────────────────────────────────
  // { code: 'engineering.read', description: 'Ver estructura de producto' },
  // { code: 'engineering.create', description: 'Crear componentes de ingeniería' },
  // { code: 'engineering.update', description: 'Editar estructura de producto' },
  // { code: 'engineering.delete', description: 'Eliminar componentes de ingeniería' },

  // ─── Master Data - Cost Templates ─────────────────────────────
  // { code: 'cost_templates.read', description: 'Ver plantillas de costo' },
  // { code: 'cost_templates.create', description: 'Crear plantillas de costo' },
  // { code: 'cost_templates.update', description: 'Editar plantillas de costo' },
  // { code: 'cost_templates.delete', description: 'Eliminar plantillas de costo' },

  // ─── Master Data - Cost Components ────────────────────────────
  // { code: 'cost_components.read', description: 'Ver componentes de costo' },
  // { code: 'cost_components.create', description: 'Crear componentes de costo' },
  // { code: 'cost_components.update', description: 'Editar componentes de costo' },
  // { code: 'cost_components.delete', description: 'Eliminar componentes de costo' },

  // ─── Master Data - Document Sequences ─────────────────────────
  // { code: 'document_sequences.read', description: 'Ver secuencias de documento' },
  // { code: 'document_sequences.create', description: 'Crear secuencias de documento' },

  // ─── Logística - Drivers ──────────────────────────────────────
  // { code: 'drivers.read', description: 'Ver choferes' },
  // { code: 'drivers.create', description: 'Crear choferes' },
  // { code: 'drivers.update', description: 'Editar choferes' },
  // { code: 'drivers.delete', description: 'Eliminar choferes' },

  // ─── Logística - Vehicles ─────────────────────────────────────
  // { code: 'vehicles.read', description: 'Ver vehículos' },
  // { code: 'vehicles.create', description: 'Crear vehículos' },
  // { code: 'vehicles.update', description: 'Editar vehículos' },
  // { code: 'vehicles.delete', description: 'Eliminar vehículos' },

  // ─── Logística - Vehicle Combinations ─────────────────────────
  // { code: 'vehicle_combinations.read', description: 'Ver combinaciones de vehículo' },
  // { code: 'vehicle_combinations.create', description: 'Crear combinaciones de vehículo' },
  // { code: 'vehicle_combinations.update', description: 'Editar combinaciones de vehículo' },
  // { code: 'vehicle_combinations.delete', description: 'Eliminar combinaciones de vehículo' },

  // ─── Logística - Corridors ────────────────────────────────────
  // { code: 'corridors.read', description: 'Ver corredores' },
  // { code: 'corridors.create', description: 'Crear corredores' },
  // { code: 'corridors.update', description: 'Editar corredores' },
  // { code: 'corridors.delete', description: 'Eliminar corredores' },

  // ─── Logística - Transfer Rates ───────────────────────────────
  // { code: 'transfer_rates.read', description: 'Ver tarifas de transferencia' },
  // { code: 'transfer_rates.create', description: 'Crear tarifas de transferencia' },
  // { code: 'transfer_rates.update', description: 'Editar tarifas de transferencia' },
  // { code: 'transfer_rates.delete', description: 'Eliminar tarifas de transferencia' },

  // ─── Logística - Dispatch Orders ──────────────────────────────
  // { code: 'dispatch_orders.read', description: 'Ver órdenes de despacho' },
  // { code: 'dispatch_orders.create', description: 'Crear órdenes de despacho' },
  // { code: 'dispatch_orders.update', description: 'Editar órdenes de despacho' },
  // { code: 'dispatch_orders.delete', description: 'Eliminar órdenes de despacho' },

  // ─── Logística - Delivery Notes ───────────────────────────────
  // { code: 'delivery_notes.read', description: 'Ver notas de entrega' },
  // { code: 'delivery_notes.create', description: 'Crear notas de entrega' },
  // { code: 'delivery_notes.update', description: 'Editar notas de entrega' },
  // { code: 'delivery_notes.confirm', description: 'Confirmar notas de entrega' },
  // { code: 'delivery_notes.delete', description: 'Eliminar notas de entrega' },

  // ─── Logística - Transport Document Types ─────────────────────
  // { code: 'transport_document_types.read', description: 'Ver tipos de documento de transporte' },
  // { code: 'transport_document_types.create', description: 'Crear tipos de documento de transporte' },
  // { code: 'transport_document_types.update', description: 'Editar tipos de documento de transporte' },
  // { code: 'transport_document_types.delete', description: 'Eliminar tipos de documento de transporte' },

  // ─── Warehouse - Pallets ──────────────────────────────────────
  // { code: 'pallets.read', description: 'Ver pallets' },
  // { code: 'pallets.create', description: 'Crear pallets' },
  // { code: 'pallets.update', description: 'Editar pallets' },
  // { code: 'pallets.delete', description: 'Eliminar pallets' },

  // ─── Warehouse - Picking ──────────────────────────────────────
  // { code: 'picking.read', description: 'Ver picking' },
  // { code: 'picking.create', description: 'Crear órdenes de picking' },
  // { code: 'picking.execute', description: 'Ejecutar picking' },
  // { code: 'picking.transfer', description: 'Transferir pallets' },

  // ─── Warehouse - Stock ────────────────────────────────────────
  // { code: 'stock.read', description: 'Ver stock' },
  // { code: 'stock.movements', description: 'Ver movimientos de stock' },
  // { code: 'stock.create', description: 'Crear movimientos de stock' },

  // ─── Media ────────────────────────────────────────────────────
  // { code: 'media.read', description: 'Ver archivos' },
  // { code: 'media.upload', description: 'Subir archivos' },

  // ─── Trash ────────────────────────────────────────────────────
  // { code: 'trash.read', description: 'Ver papelera' },
  // { code: 'trash.restore', description: 'Restaurar elementos' },
  // { code: 'trash.delete', description: 'Eliminar permanentemente' },

  // ─── Data Import ──────────────────────────────────────────────
  // { code: 'data_import.execute', description: 'Ejecutar importaciones' },
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
