import { Injectable, NotFoundException } from '@nestjs/common';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: LogisticaPrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.companies.create({
      data: {
        name: createCompanyDto.name,
        tax_id: createCompanyDto.taxId,
        phone: createCompanyDto.phone,
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

    return this.prisma.companies.update({
      where: { id },
      data: {
        name: updateCompanyDto.name,
        tax_id: updateCompanyDto.taxId,
        phone: updateCompanyDto.phone,
      },
    });
  }

  deactivate() {
    throw new Error('No existe isActive en el modelo companies');
  }
}
