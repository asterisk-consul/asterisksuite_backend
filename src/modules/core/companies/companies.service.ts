import { execSync } from 'child_process';
import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { Pool, Client } from 'pg';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';
import {
  RBAC_PERMISSIONS,
  RBAC_ROLES,
  SQL_DOCUMENT_TYPES,
  SQL_DOCUMENT_SEQUENCES,
  SQL_LINK_SEQUENCES,
  executeSeedSql,
} from '../../../../prisma/seeds/seed-sql';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getDefaultClient();
  }

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
    const connectionString = `${process.env.DATABASE_URL_BASE}${tenantDb}`;
    const { client: prisma, pool } = this.createTenantPrismaClient(tenantDb);

    try {
      // 1. RBAC — Permissions (Prisma upserts)
      for (const perm of RBAC_PERMISSIONS) {
        await prisma.permissions.upsert({
          where: { code: perm.code },
          update: { description: perm.description, active: true },
          create: { code: perm.code, description: perm.description },
        });
      }
      this.logger.log(`Tenant "${tenantDb}": ${RBAC_PERMISSIONS.length} permisos creados`);

      // 2. RBAC — Roles and assign permissions
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

        await prisma.business_role_permissions.deleteMany({
          where: { role_id: created.id },
        });

        const perms = await prisma.permissions.findMany({
          where: { code: { in: role.permissionCodes }, active: true },
        });

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

      // 3. Document types, sequences, and links (SQL from seed-sql.ts)
      await executeSeedSql(connectionString, SQL_DOCUMENT_TYPES);
      await executeSeedSql(connectionString, SQL_DOCUMENT_SEQUENCES);
      await executeSeedSql(connectionString, SQL_LINK_SEQUENCES);
      this.logger.log(`Tenant "${tenantDb}": Document types + sequences seed OK`);
    } finally {
      await prisma.$disconnect();
      await pool.end();
    }
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

  async checkSubdomain(subdomain: string) {
    const slug = subdomain?.toLowerCase().trim();
    if (!slug || slug.length < 3) {
      return { available: false, message: 'Mínimo 3 caracteres' };
    }
    const existing = await this.prisma.companies.findFirst({
      where: { subdomain: slug, deleted_at: null },
    });
    return { available: !existing };
  }

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const subdomain = createCompanyDto.subdomain?.toLowerCase().trim();
    const tenantDb = `${subdomain}_db`;
    const tenantDbUrl = `${process.env.DATABASE_URL_BASE}${tenantDb}`;

    // Check company limit: max 3 per user as OWNER
    const ownerCount = await this.prisma.company_users.count({
      where: { user_id: userId, role: 'OWNER' },
    });
    if (ownerCount >= 3) {
      throw new BadRequestException('Máximo 3 empresas por usuario');
    }

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

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    });

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

    const cu = await this.prisma.company_users.create({
      data: {
        company_id: company.id,
        user_id: user.id,
        role: 'OWNER',
      },
    });

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

  async updateUser(companyId: string, userId: string, dto: { name?: string; email?: string }, requestUserId: string) {
    await this.assertUserIsOwnerOrAdmin(requestUserId, companyId);

    const membership = await this.prisma.company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
    });

    if (!membership) {
      throw new NotFoundException('Usuario no encontrado en esta empresa');
    }

    // Validar email único si se cambia
    if (dto.email) {
      const existing = await this.prisma.users.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.id !== userId) {
        throw new ConflictException('El email ya está registrado');
      }
    }

    return this.prisma.users.update({
      where: { id: userId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.email !== undefined && { email: dto.email }),
      },
      select: { id: true, name: true, email: true },
    });
  }

  async changeUserPassword(companyId: string, userId: string, newPassword: string, requestUserId: string) {
    await this.assertUserIsOwnerOrAdmin(requestUserId, companyId);

    const membership = await this.prisma.company_users.findUnique({
      where: { company_id_user_id: { company_id: companyId, user_id: userId } },
    });

    if (!membership) {
      throw new NotFoundException('Usuario no encontrado en esta empresa');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    return this.prisma.users.update({
      where: { id: userId },
      data: { password_hash: passwordHash },
      select: { id: true, name: true, email: true },
    });
  }

  deactivate() {
    throw new Error('No existe isActive en el modelo companies');
  }
}
