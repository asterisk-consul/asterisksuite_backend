import { execSync } from 'child_process';
import { Injectable, NotFoundException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { Pool, Client } from 'pg';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getDefaultClient();
  }

  // ─── Default RBAC seed data ────────────────────────────────────
  // NOTA: Estos permisos se crean automáticamente al crear una empresa.
  // Para agregar permisos de nuevos módulos, descomentar en rbac.seed.ts
  // y agregarlos aquí en el mismo orden.

  private readonly defaultPermissions = [
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

    // Master Data - Products
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

    // Inventory - Units
    { code: 'units.read', description: 'Ver unidades de medida' },
    { code: 'units.create', description: 'Crear unidades de medida' },
    { code: 'units.update', description: 'Editar unidades de medida' },
    { code: 'units.delete', description: 'Eliminar unidades de medida' },

    // Inventory - Categories
    { code: 'categories.read', description: 'Ver categorías' },
    { code: 'categories.create', description: 'Crear categorías' },
    { code: 'categories.update', description: 'Editar categorías' },
    { code: 'categories.delete', description: 'Eliminar categorías' },

    // Logística - Warehouses
    { code: 'warehouses.read', description: 'Ver almacenes' },
    { code: 'warehouses.create', description: 'Crear almacenes' },
    { code: 'warehouses.update', description: 'Editar almacenes' },
    { code: 'warehouses.delete', description: 'Eliminar almacenes' },

    // Logística - Trips
    { code: 'trips.read', description: 'Ver viajes' },
    { code: 'trips.create', description: 'Crear viajes' },
    { code: 'trips.update', description: 'Editar viajes' },
    { code: 'trips.delete', description: 'Eliminar viajes' },

    // Core - Companies
    { code: 'companies.read', description: 'Ver empresas' },
    { code: 'companies.create', description: 'Crear empresas' },
    { code: 'companies.update', description: 'Editar empresas' },
    { code: 'companies.delete', description: 'Eliminar empresas' },

    // ═════════════════════════════════════════════════════════════
    // MÓDULOS PENDIENTES — agregar aquí al descomentar en seed
    // ═════════════════════════════════════════════════════════════
    // currency_rates.read, currency_rates.create, currency_rates.update, currency_rates.delete
    // document_types.read, document_types.create, document_types.update, document_types.delete
    // purchases.read, purchases.create, purchases.update, purchases.delete, purchases.confirm, purchases.cancel
    // sales_reports.read
    // pricing.read, pricing.create, pricing.update, pricing.delete
    // exchange.read, exchange.sync
    // business_parties.read, business_parties.create, business_parties.update, business_parties.delete
    // contacts.read, contacts.create, contacts.update, contacts.delete
    // locations.read, locations.create, locations.update, locations.delete
    // product_variants.read, product_variants.create, product_variants.update, product_variants.delete
    // product_components.read, product_components.create, product_components.update, product_components.delete
    // attributes.read, attributes.create, attributes.update, attributes.delete
    // product_attribute_values.read, product_attribute_values.create, product_attribute_values.update, product_attribute_values.delete
    // product_categories.read, product_categories.create, product_categories.delete
    // tags.read, tags.create, tags.update, tags.delete
    // product_tags.read, product_tags.create, product_tags.delete
    // engineering.read, engineering.create, engineering.update, engineering.delete
    // cost_templates.read, cost_templates.create, cost_templates.update, cost_templates.delete
    // cost_components.read, cost_components.create, cost_components.update, cost_components.delete
    // document_sequences.read, document_sequences.create
    // drivers.read, drivers.create, drivers.update, drivers.delete
    // vehicles.read, vehicles.create, vehicles.update, vehicles.delete
    // vehicle_combinations.read, vehicle_combinations.create, vehicle_combinations.update, vehicle_combinations.delete
    // corridors.read, corridors.create, corridors.update, corridors.delete
    // transfer_rates.read, transfer_rates.create, transfer_rates.update, transfer_rates.delete
    // dispatch_orders.read, dispatch_orders.create, dispatch_orders.update, dispatch_orders.delete
    // delivery_notes.read, delivery_notes.create, delivery_notes.update, delivery_notes.confirm, delivery_notes.delete
    // transport_document_types.read, transport_document_types.create, transport_document_types.update, transport_document_types.delete
    // pallets.read, pallets.create, pallets.update, pallets.delete
    // picking.read, picking.create, picking.execute, picking.transfer
    // stock.read, stock.movements, stock.create
    // media.read, media.upload
    // trash.read, trash.restore, trash.delete
    // data_import.execute
  ];

  private readonly defaultRoles = [
    {
      code: 'admin',
      name: 'Administrador',
      description: 'Acceso total al sistema',
      is_system: true,
      permissionCodes: this.defaultPermissions.map((p) => p.code),
    },
    {
      code: 'manager',
      name: 'Gerente',
      description: 'Acceso a módulos de negocio sin administración de roles',
      is_system: true,
      permissionCodes: this.defaultPermissions
        .filter((p) => !p.code.startsWith('roles.') && !p.code.startsWith('users.') && !p.code.startsWith('permissions.'))
        .map((p) => p.code),
    },
    {
      code: 'user',
      name: 'Usuario',
      description: 'Lectura y escritura básica',
      is_system: true,
      permissionCodes: [
        'products.read', 'products.create', 'products.update',
        'documents.read', 'documents.create', 'documents.update',
        'currencies.read', 'taxes.read', 'accounts.read',
        'units.read', 'units.create', 'units.update',
        'categories.read', 'categories.create', 'categories.update',
        'warehouses.read', 'trips.read', 'companies.read',
      ],
    },
    {
      code: 'viewer',
      name: 'Observador',
      description: 'Solo lectura',
      is_system: true,
      permissionCodes: this.defaultPermissions.filter((p) => p.code.endsWith('.read')).map((p) => p.code),
    },
  ];

  // ─── Tenant client helper ──────────────────────────────────────

  private createTenantPrismaClient(tenantDb: string) {
    const connectionString = `${process.env.DATABASE_URL_BASE}${tenantDb}`;
    const pool = new Pool({
      connectionString,
      options: `-c search_path="tenant",public`,
      max: 5,
    });
    const adapter = new PrismaPg(pool, { schema: 'tenant' });
    const client = new PrismaClient({ adapter });
    return { client, pool };
  }

  // ─── RBAC seed for new tenant ──────────────────────────────────

  private async seedRbacForTenant(tenantDb: string): Promise<void> {
    const { client: prisma, pool } = this.createTenantPrismaClient(tenantDb);

    try {
      // 1. Create permissions
      for (const perm of this.defaultPermissions) {
        await prisma.permissions.upsert({
          where: { code: perm.code },
          update: { description: perm.description, active: true },
          create: { code: perm.code, description: perm.description },
        });
      }
      this.logger.log(`Tenant "${tenantDb}": ${this.defaultPermissions.length} permisos creados`);

      // 2. Create roles and assign permissions
      for (const role of this.defaultRoles) {
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

        // Clean existing permissions for this role
        await prisma.business_role_permissions.deleteMany({
          where: { role_id: created.id },
        });

        // Get permissions by code
        const perms = await prisma.permissions.findMany({
          where: { code: { in: role.permissionCodes }, active: true },
        });

        // Assign permissions
        if (perms.length) {
          await prisma.business_role_permissions.createMany({
            data: perms.map((p) => ({
              role_id: created.id,
              permission_id: p.id,
            })),
          });
        }

        this.logger.log(`Tenant "${tenantDb}": Rol "${role.name}" → ${perms.length} permisos`);
      }

      // 3. Create default document types
      await this.seedDocumentTypesForTenant(prisma);
    } finally {
      await prisma.$disconnect();
      await pool.end();
    }
  }

  // ─── Document Types seed for new tenant ──────────────────────────

  private async seedDocumentTypesForTenant(prisma: any): Promise<void> {
    const documentTypes = [
      // FACTURAS DE VENTA
      { code: 'FA-A', description: 'Factura A - Responsable Inscripto', direction: 1, category: 'INVOICE', letter_type: 'A', afip_code: '01', requires_cae: true, is_electronic: true, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'FB-A', description: 'Factura B - Consumidor Final', direction: 1, category: 'INVOICE', letter_type: 'B', afip_code: '06', requires_cae: true, is_electronic: true, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'FC-A', description: 'Factura C - Exento', direction: 1, category: 'INVOICE', letter_type: 'C', afip_code: '11', requires_cae: true, is_electronic: true, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'FX-A', description: 'Factura X - Comprobante interno', direction: 1, category: 'INVOICE', letter_type: 'X', afip_code: null, requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: true, affects_tax_book: false },

      // NOTAS DE CRÉDITO VENTA
      { code: 'NCA', description: 'Nota de Crédito A', direction: 1, category: 'CREDIT_NOTE', letter_type: 'A', afip_code: '128', requires_cae: true, is_electronic: true, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'NCB', description: 'Nota de Crédito B', direction: 1, category: 'CREDIT_NOTE', letter_type: 'B', afip_code: '132', requires_cae: true, is_electronic: true, affects_stock: true, affects_accounting: true, affects_tax_book: true },

      // NOTAS DE DÉBITO VENTA
      { code: 'NDA', description: 'Nota de Débito A', direction: 1, category: 'DEBIT_NOTE', letter_type: 'A', afip_code: '135', requires_cae: true, is_electronic: true, affects_stock: false, affects_accounting: true, affects_tax_book: true },
      { code: 'NDB', description: 'Nota de Débito B', direction: 1, category: 'DEBIT_NOTE', letter_type: 'B', afip_code: '139', requires_cae: true, is_electronic: true, affects_stock: false, affects_accounting: true, affects_tax_book: true },

      // FACTURAS DE COMPRA
      { code: 'FA-C', description: 'Factura A Compra - Proveedor RI', direction: -1, category: 'INVOICE', letter_type: 'A', afip_code: '01', requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'FB-C', description: 'Factura B Compra - Proveedor CF', direction: -1, category: 'INVOICE', letter_type: 'B', afip_code: '06', requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'FC-C', description: 'Factura C Compra - Proveedor Exento', direction: -1, category: 'INVOICE', letter_type: 'C', afip_code: '11', requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: true, affects_tax_book: true },

      // NOTAS DE COMPRA
      { code: 'NCA-C', description: 'Nota de Crédito Compra A', direction: -1, category: 'CREDIT_NOTE', letter_type: 'A', afip_code: '128', requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: true, affects_tax_book: true },
      { code: 'NDA-C', description: 'Nota de Débito Compra A', direction: -1, category: 'DEBIT_NOTE', letter_type: 'A', afip_code: '135', requires_cae: false, is_electronic: false, affects_stock: false, affects_accounting: true, affects_tax_book: true },

      // ÓRDENES
      { code: 'OV', description: 'Orden de Venta', direction: 1, category: 'ORDER', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: false, affects_accounting: false, affects_tax_book: false },
      { code: 'OC', description: 'Orden de Compra', direction: -1, category: 'ORDER', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: false, affects_accounting: false, affects_tax_book: false },

      // PRESUPUESTOS
      { code: 'PRES', description: 'Presupuesto', direction: 1, category: 'QUOTE', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: false, affects_accounting: false, affects_tax_book: false },

      // RECIBOS
      { code: 'REC', description: 'Recibo de Pago', direction: 1, category: 'RECEIPT', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: false, affects_accounting: true, affects_tax_book: false },

      // REMITOS
      { code: 'REM-V', description: 'Remito de Venta', direction: 1, category: 'REMITO', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: false, affects_tax_book: false },
      { code: 'REM-C', description: 'Remito de Compra', direction: -1, category: 'REMITO', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: false, affects_tax_book: false },
      { code: 'REM-T', description: 'Remito de Traslado', direction: 1, category: 'REMITO', letter_type: null, afip_code: null, requires_cae: false, is_electronic: false, affects_stock: true, affects_accounting: false, affects_tax_book: false },
    ];

    for (const dt of documentTypes) {
      await prisma.document_types.upsert({
        where: { code: dt.code },
        update: {
          description: dt.description,
          direction: dt.direction,
          category: dt.category,
          letter_type: dt.letter_type,
          afip_code: dt.afip_code,
          requires_cae: dt.requires_cae,
          is_electronic: dt.is_electronic,
          affects_stock: dt.affects_stock,
          affects_accounting: dt.affects_accounting,
          affects_tax_book: dt.affects_tax_book,
        },
        create: {
          code: dt.code,
          description: dt.description,
          direction: dt.direction,
          category: dt.category,
          letter_type: dt.letter_type,
          afip_code: dt.afip_code,
          requires_cae: dt.requires_cae,
          is_electronic: dt.is_electronic,
          affects_stock: dt.affects_stock,
          affects_accounting: dt.affects_accounting,
          affects_tax_book: dt.affects_tax_book,
          active: true,
        },
      });
    }

    this.logger.log(`Tenant: ${documentTypes.length} tipos de documento creados`);
  }

  // ─── Assign admin role to creator ──────────────────────────────

  private async assignDefaultRoleToUser(tenantDb: string, userId: string): Promise<void> {
    const { client: prisma, pool } = this.createTenantPrismaClient(tenantDb);

    try {
      // Find the admin role
      const adminRole = await prisma.business_roles.findUnique({
        where: { code: 'admin' },
      });

      if (!adminRole) {
        this.logger.warn(`Tenant "${tenantDb}": Rol "admin" no encontrado, saltando asignación`);
        return;
      }

      // Assign admin role to the user
      await prisma.business_user_roles.create({
        data: {
          user_id: userId,
          role_id: adminRole.id,
        },
      });

      this.logger.log(`Tenant "${tenantDb}": Rol "admin" asignado al usuario ${userId}`);
    } finally {
      await prisma.$disconnect();
      await pool.end();
    }
  }

  private async assertUserIsCompanyMember(userId: string, companyId: string) {
    const membership = await this.prisma.company_users.findUnique({
      where: {
        company_id_user_id: {
          company_id: companyId,
          user_id: userId,
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('No perteneces a esta empresa');
    }

    return membership;
  }

  private async assertUserIsOwnerOrAdmin(userId: string, companyId: string) {
    const membership = await this.assertUserIsCompanyMember(userId, companyId);

    if (membership.role !== 'OWNER' && membership.role !== 'ADMIN') {
      throw new ForbiddenException('Solo OWNER o ADMIN pueden realizar esta acción');
    }

    return membership;
  }

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    console.log(userId);
    const subdomain = createCompanyDto.subdomain?.toLowerCase().trim();
    const tenantDb = `${subdomain}_db`;
    const tenantDbUrl = `${process.env.DATABASE_URL_BASE}${tenantDb}`;

    const existingCompany = await this.prisma.companies.findFirst({
      where: { subdomain, deleted_at: null },
    });

    if (existingCompany) {
      throw new ConflictException(`La empresa con subdomain "${subdomain}" ya existe`);
    }

    const adminPool = new Pool({
      connectionString: process.env.DATABASE_URL_PUBLIC,
    });

    try {
      const { rows } = await adminPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [tenantDb]);
      if (rows.length > 0) {
        throw new ConflictException(`La base de datos "${tenantDb}" ya existe`);
      }
      await adminPool.query(`CREATE DATABASE "${tenantDb}"`);
    } finally {
      await adminPool.end();
    }

    const tenantPool = new Pool({ connectionString: tenantDbUrl });
    try {
      await tenantPool.query(`CREATE SCHEMA IF NOT EXISTS tenant`);
      await tenantPool.query(`CREATE SCHEMA IF NOT EXISTS public`);
    } finally {
      await tenantPool.end();
    }

    try {
      const sql = execSync(`npx prisma migrate diff --from-empty --to-schema ./prisma/schema --script`, {
        env: {
          ...process.env,
          DATABASE_URL: tenantDbUrl,
        },
      }).toString();

      const client = new Client({ connectionString: tenantDbUrl });
      await client.connect();
      try {
        await client.query(sql);
      } finally {
        await client.end();
      }
    } catch (error) {
      const cleanupPool = new Pool({
        connectionString: process.env.DATABASE_URL_PUBLIC,
      });
      try {
        await cleanupPool.query(`DROP DATABASE IF EXISTS "${tenantDb}"`);
      } finally {
        await cleanupPool.end();
      }

      if (error instanceof ConflictException) {
        throw error;
      }

      throw new ConflictException(`Error al crear la empresa: ${error.message}`);
    }

    console.log('SERVICE userId:', userId, typeof userId);

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    console.log('USER found:', user);

    if (!user) {
      throw new ConflictException('El usuario autenticado no existe en la base de datos');
    }

    const company = await this.prisma.companies.create({
      data: {
        name: createCompanyDto.name,
        tax_id: createCompanyDto.taxId,
        vat_condition: createCompanyDto.vat_condition,
        address: createCompanyDto.address,
        email: createCompanyDto.email,
        phone: createCompanyDto.phone,
        subdomain,
        schema_name: tenantDb,
      },
    });

    console.log('COMPANY created:', company.id);

    const cu = await this.prisma.company_users.create({
      data: {
        company_id: company.id,
        user_id: user.id,
        role: 'OWNER',
      },
    });

    console.log('COMPANY_USER created:', cu);

    // ── Seed RBAC defaults into tenant DB ──────────────────────
    await this.seedRbacForTenant(tenantDb);

    // ── Assign admin role to the creator ───────────────────────
    await this.assignDefaultRoleToUser(tenantDb, user.id);

    return company;
  }

  async findAll() {
    return this.prisma.companies.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const company = await this.prisma.companies.findUnique({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id);

    const subdomain = updateCompanyDto.subdomain?.toLowerCase().trim();
    const schemaName = updateCompanyDto.schemaName?.toLowerCase().trim() || subdomain;

    if (schemaName) {
      await this.prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    }

    return this.prisma.companies.update({
      where: { id },
      data: {
        name: updateCompanyDto.name,
        tax_id: updateCompanyDto.taxId,
        vat_condition: updateCompanyDto.vat_condition,
        address: updateCompanyDto.address,
        email: updateCompanyDto.email,
        phone: updateCompanyDto.phone,
        ...(subdomain !== undefined ? { subdomain } : {}),
        ...(schemaName !== undefined ? { schema_name: schemaName } : {}),
      },
    });
  }

  async listUsers(companyId: string, userId: string) {
    await this.assertUserIsCompanyMember(userId, companyId);

    return this.prisma.company_users.findMany({
      where: { company_id: companyId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true,
          },
        },
      },
    });
  }

  async createUserInCompany(companyId: string, dto: CreateCompanyUserDto, requestUserId: string) {
    await this.assertUserIsOwnerOrAdmin(requestUserId, companyId);
    await this.findOne(companyId);

    const existing = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password_hash: passwordHash,
      },
    });

    await this.prisma.company_users.create({
      data: {
        company_id: companyId,
        user_id: user.id,
        role: dto.role || 'USER',
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async addUser(companyId: string, email: string, role: string, requestUserId: string) {
    await this.assertUserIsOwnerOrAdmin(requestUserId, companyId);

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const existing = await this.prisma.company_users.findUnique({
      where: {
        company_id_user_id: {
          company_id: companyId,
          user_id: user.id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('El usuario ya pertenece a esta empresa');
    }

    return this.prisma.company_users.create({
      data: {
        company_id: companyId,
        user_id: user.id,
        role,
      },
    });
  }

  async removeUser(companyId: string, userIdToRemove: string, requestUserId: string) {
    await this.assertUserIsOwnerOrAdmin(requestUserId, companyId);

    if (userIdToRemove === requestUserId) {
      throw new ForbiddenException('No puedes eliminarte a ti mismo');
    }

    const membership = await this.prisma.company_users.findUnique({
      where: {
        company_id_user_id: {
          company_id: companyId,
          user_id: userIdToRemove,
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Usuario no encontrado en esta empresa');
    }

    if (membership.role === 'OWNER') {
      throw new ForbiddenException('No puedes eliminar a otro OWNER');
    }

    return this.prisma.company_users.delete({
      where: {
        company_id_user_id: {
          company_id: companyId,
          user_id: userIdToRemove,
        },
      },
    });
  }

  deactivate() {
    throw new Error('No existe isActive en el modelo companies');
  }
}
