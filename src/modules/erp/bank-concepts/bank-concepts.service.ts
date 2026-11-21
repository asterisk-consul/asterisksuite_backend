import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class BankConceptsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: any) {
    const data = await this.prepareData(dto);
    return this.prisma.bank_concepts.create({ data, include: { automatic_accounts: { select: { id: true } } } });
  }

  async findAll() {
    return this.prisma.bank_concepts.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
      include: { automatic_accounts: { select: { id: true } } },
    });
  }

  async findOne(id: string) {
    const concept = await this.prisma.bank_concepts.findFirst({
      where: { id, deleted_at: null },
      include: { automatic_accounts: { select: { id: true } } },
    });
    if (!concept) throw new NotFoundException('Concepto no encontrado');
    return concept;
  }

  async update(id: string, dto: any) {
    const existing = await this.findOne(id);
    const data = await this.prepareData(dto, existing);
    return this.prisma.bank_concepts.update({
      where: { id },
      data,
      include: { automatic_accounts: { select: { id: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bank_concepts.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  private async prepareData(dto: any, existing?: any) {
    const { automatic_account_ids, automatic_accounts, ...data } = dto;
    if (data.automatic_movement_nature !== undefined && !['BOTH', 'DEBIT', 'CREDIT'].includes(data.automatic_movement_nature)) {
      throw new BadRequestException('Seleccioná Débitos, Créditos o Ambos');
    }
    if (automatic_accounts !== undefined) throw new BadRequestException('Usá automatic_account_ids para seleccionar cuentas');
    if (data.automatic_all_accounts !== undefined && typeof data.automatic_all_accounts !== 'boolean') {
      throw new BadRequestException('El alcance de cuentas debe ser booleano');
    }
    const all = data.automatic_all_accounts ?? existing?.automatic_all_accounts ?? true;
    const ids = automatic_account_ids ?? existing?.automatic_accounts?.map((a: { id: string }) => a.id) ?? [];
    if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' || !isUUID(id))) {
      throw new BadRequestException('Seleccioná cuentas bancarias válidas');
    }
    const uniqueIds = [...new Set<string>(ids)];
    if (!all && uniqueIds.length === 0) throw new BadRequestException('Seleccioná al menos una cuenta bancaria');
    if (!all) {
      const count = await this.prisma.bank_accounts.count({ where: { id: { in: uniqueIds }, deleted_at: null } });
      if (count !== uniqueIds.length) throw new BadRequestException('Alguna cuenta no existe en esta empresa o fue eliminada');
    }
    if (!existing || automatic_account_ids !== undefined || data.automatic_all_accounts !== undefined) {
      const selected = (all ? [] : uniqueIds).map(id => ({ id }));
      data.automatic_accounts = existing ? { set: selected } : { connect: selected };
    }
    return data;
  }
}
