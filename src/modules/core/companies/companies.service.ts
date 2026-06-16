import { execSync } from 'child_process';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Pool, Client } from 'pg';

@Injectable()
export class CompaniesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getDefaultClient();
  }

  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const subdomain = createCompanyDto.subdomain?.toLowerCase().trim();
    const tenantDb = `${subdomain}_db`;
    const tenantDbUrl = `${process.env.DATABASE_URL_BASE}${tenantDb}`;

    // 1. Crear la DB
    const adminPool = new Pool({
      connectionString: process.env.DATABASE_URL_PUBLIC,
    });

    try {
      const { rows } = await adminPool.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [tenantDb],
      );
      if (rows.length > 0) {
        throw new Error(`La empresa con subdomain "${subdomain}" ya existe`);
      }
      await adminPool.query(`CREATE DATABASE "${tenantDb}"`);
    } finally {
      await adminPool.end();
    }

    // 2. Crear schemas public y tenant en la nueva DB
    const tenantPool = new Pool({ connectionString: tenantDbUrl });
    try {
      await tenantPool.query(`CREATE SCHEMA IF NOT EXISTS tenant`);
      await tenantPool.query(`CREATE SCHEMA IF NOT EXISTS public`);
    } finally {
      await tenantPool.end();
    }

    // 3. Generar SQL con migrate diff y ejecutarlo directamente
    try {
      const sql = execSync(
        `npx prisma migrate diff --from-empty --to-schema ./prisma/schema --script`,
        {
          env: {
            ...process.env,
            DATABASE_URL: tenantDbUrl,
          },
        },
      ).toString();

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
      throw new Error(
        `Error al aplicar schema en ${tenantDb}: ${error.message}`,
      );
    }

    // 4. Registrar empresa en public
    const company = await this.prisma.companies.create({
      data: {
        name: createCompanyDto.name,
        tax_id: createCompanyDto.taxId,
        phone: createCompanyDto.phone,
        subdomain,
        schema_name: tenantDb,
      },
    });

    await this.prisma.company_users.create({
      data: {
        company_id: company.id,
        user_id: userId,
        role: 'OWNER',
      },
    });

    return company;
  }

  async findAll() {
    const data = await this.prisma.companies.findMany({
      orderBy: { created_at: 'desc' },
    });

    console.log(data[0].created_at);
    console.log(data[0].created_at instanceof Date);

    return data;
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
    const schemaName =
      updateCompanyDto.schemaName?.toLowerCase().trim() || subdomain;

    if (schemaName) {
      await this.prisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
      );
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

  async addUser(companyId: string, email: string, role: string) {
    const prisma = this.db.getDefaultClient();

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return prisma.company_users.create({
      data: {
        company_id: companyId,
        user_id: user.id,
        role,
      },
    });
  }

  deactivate() {
    throw new Error('No existe isActive en el modelo companies');
  }
}
