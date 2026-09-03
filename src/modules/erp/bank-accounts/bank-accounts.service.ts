import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@Injectable()
export class BankAccountsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateBankAccountDto, userId: string) {
    return this.prisma.bank_accounts.create({
      data: {
        name: dto.name,
        bank_name: dto.bank_name,
        account_type: dto.account_type,
        cbu: dto.cbu,
        alias: dto.alias,
        account_number: dto.account_number,
        currency_code: dto.currency_code,
        balance: dto.balance ?? 0,
        active: dto.active ?? true,
        created_by: userId,
      },
    });
  }

  async findAll(userId?: string) {
    const where: Record<string, any> = { deleted_at: null };

    if (userId) {
      const userRoleIds = await this.prisma.bank_account_user_roles.findMany({
        where: { user_id: userId },
        select: { bank_account_id: true },
      });
      const allowedIds = userRoleIds.map(r => r.bank_account_id);
      where.id = { in: allowedIds };
    }

    return this.prisma.bank_accounts.findMany({
      where,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.bank_accounts.findFirst({
      where: { id, deleted_at: null },
      include: { movements: { orderBy: { date: 'desc' }, take: 20 } },
    });
    if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
    return account;
  }

  async update(id: string, dto: UpdateBankAccountDto, userId: string) {
    await this.findOne(id);
    return this.prisma.bank_accounts.update({
      where: { id },
      data: {
        ...dto,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.bank_accounts.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
        active: false,
      },
    });
  }

  async getMovements(id: string) {
    await this.findOne(id);
    return this.prisma.bank_account_movements.findMany({
      where: { bank_account_id: id, deleted_at: null },
      orderBy: { date: 'desc' },
    });
  }

  // ═══════════════════════════════════════════
  // USER ROLES
  // ═══════════════════════════════════════════

  async getUserRoles(bankAccountId: string) {
    await this.findOne(bankAccountId);
    return this.prisma.bank_account_user_roles.findMany({
      where: { bank_account_id: bankAccountId, deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
  }

  async addUserRole(bankAccountId: string, userId: string, role: string) {
    await this.findOne(bankAccountId);
    const existing = await this.prisma.bank_account_user_roles.findUnique({
      where: { bank_account_id_user_id: { bank_account_id: bankAccountId, user_id: userId } },
    });
    if (existing) {
      return this.prisma.bank_account_user_roles.update({
        where: { id: existing.id },
        data: { role: role as any, updated_at: new Date() },
      });
    }
    return this.prisma.bank_account_user_roles.create({
      data: { bank_account_id: bankAccountId, user_id: userId, role: role as any },
    });
  }

  async removeUserRole(bankAccountId: string, userId: string) {
    const existing = await this.prisma.bank_account_user_roles.findUnique({
      where: { bank_account_id_user_id: { bank_account_id: bankAccountId, user_id: userId } },
    });
    if (!existing) throw new NotFoundException('Rol de usuario no encontrado');
    return this.prisma.bank_account_user_roles.delete({
      where: { id: existing.id },
    });
  }
}
