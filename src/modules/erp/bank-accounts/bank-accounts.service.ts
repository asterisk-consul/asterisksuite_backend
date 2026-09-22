import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';
import { recalculateBankAccountLedger } from './bank-account-ledger';

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

  async remove(id: string, dto: DeleteBankAccountDto, userId: string) {
    if (dto.confirmation !== 'ELIMINAR') throw new BadRequestException('Escribí ELIMINAR para confirmar');
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.bank_accounts.findFirst({ where: { id, deleted_at: null } });
      if (!account) throw new NotFoundException('Cuenta bancaria no encontrada');
      const balance = Number(account.balance);
      const linkedChecks = await tx.checks.count({
        where: { bank_account_id: id, status: { in: ['PENDING', 'CONFIRMED'] }, deleted_at: null },
      });
      if ((balance !== 0 || linkedChecks > 0) && !dto.target_bank_account_id) {
        throw new BadRequestException(linkedChecks > 0
          ? 'Seleccioná una cuenta destino para reasignar los cheques pendientes'
          : 'Seleccioná una cuenta bancaria destino para transferir el saldo');
      }
      if (dto.target_bank_account_id === id) throw new BadRequestException('La cuenta destino debe ser diferente');
      const target = dto.target_bank_account_id
        ? await tx.bank_accounts.findFirst({ where: { id: dto.target_bank_account_id, active: true, deleted_at: null } })
        : null;
      if (dto.target_bank_account_id && !target) throw new BadRequestException('La cuenta bancaria destino no existe o está inactiva');
      if (target && target.currency_code !== account.currency_code) throw new BadRequestException('La cuenta destino debe usar la misma moneda');

      if (balance !== 0) {
        if (!target) throw new BadRequestException('Seleccioná una cuenta bancaria destino para transferir el saldo');
        const targetBefore = Number(target.balance);
        const now = new Date();
        await tx.bank_account_movements.createMany({ data: [
          { bank_account_id: id, type: 'TRANSFER', amount: -balance, currency_code: account.currency_code, balance_before: balance, balance_after: 0, description: `Transferencia por baja de ${account.name}`, reference_type: 'bank_account_closure', reference_id: id, date: now, created_by: userId },
          { bank_account_id: target.id, type: 'TRANSFER', amount: balance, currency_code: account.currency_code, balance_before: targetBefore, balance_after: targetBefore + balance, description: `Saldo recibido por baja de ${account.name}`, reference_type: 'bank_account_closure', reference_id: id, date: now, created_by: userId },
        ] });
        await tx.bank_accounts.update({ where: { id }, data: { balance: 0 } });
        await tx.bank_accounts.update({ where: { id: target.id }, data: { balance: targetBefore + balance } });
        await recalculateBankAccountLedger(tx, id);
        await recalculateBankAccountLedger(tx, target.id);
      }
      if (linkedChecks > 0 && dto.target_bank_account_id) {
        await tx.checks.updateMany({
          where: { bank_account_id: id, status: { in: ['PENDING', 'CONFIRMED'] }, deleted_at: null },
          data: { bank_account_id: dto.target_bank_account_id, updated_at: new Date(), updated_by: userId },
        });
      }
      return tx.bank_accounts.update({
        where: { id },
        data: { deleted_at: new Date(), deleted_by: userId, active: false },
      });
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
