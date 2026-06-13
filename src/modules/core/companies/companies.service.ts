import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getDefaultClient();
  }
  async create(createCompanyDto: CreateCompanyDto) {
    const subdomain = createCompanyDto.subdomain?.toLowerCase().trim();
    const schemaName =
      createCompanyDto.schemaName?.toLowerCase().trim() || subdomain;

    if (schemaName) {
      await this.prisma.$executeRawUnsafe(
        `CREATE SCHEMA IF NOT EXISTS "${schemaName}"`,
      );
    }

    return this.prisma.companies.create({
      data: {
        name: createCompanyDto.name,
        tax_id: createCompanyDto.taxId,
        phone: createCompanyDto.phone,
        subdomain,
        schema_name: schemaName,
      },
    });
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

  deactivate() {
    throw new Error('No existe isActive en el modelo companies');
  }
}
