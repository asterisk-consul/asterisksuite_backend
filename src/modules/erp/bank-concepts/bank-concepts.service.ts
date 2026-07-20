import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BankConceptsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: any) {
    return this.prisma.bank_concepts.create({ data: dto });
  }

  async findAll() {
    return this.prisma.bank_concepts.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const concept = await this.prisma.bank_concepts.findFirst({
      where: { id, deleted_at: null },
    });
    if (!concept) throw new NotFoundException('Concepto no encontrado');
    return concept;
  }

  async update(id: string, dto: any) {
    await this.findOne(id);
    return this.prisma.bank_concepts.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bank_concepts.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
