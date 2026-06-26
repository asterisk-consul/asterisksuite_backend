import { execSync } from 'child_process';
import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { Pool, Client } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CompaniesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getDefaultClient();
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
