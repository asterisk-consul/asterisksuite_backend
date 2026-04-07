// taxes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';

@Injectable()
export class TaxesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaxDto) {
    return this.prisma.taxes.create({
      data: dto,
    });
  }

  async findAll(companyId: string) {
    return this.prisma.taxes.findMany();
  }

  async update(id: string, dto: UpdateTaxDto) {
    const exists = await this.prisma.taxes.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Tax with id ${id} not found`);
    }

    return this.prisma.taxes.update({
      where: { id },
      data: dto,
    });
  }
}
