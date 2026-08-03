import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';

@Injectable()
export class CurrentAccountsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async addEntry(dto: CreateCurrentAccountEntryDto, userId: string) {
    // Buscar o crear cuenta corriente
    let account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: dto.party_id,
          currency_code: dto.currency_code,
        },
      },
    });

    if (!account) {
      account = await this.prisma.current_accounts.create({
        data: {
          party_id: dto.party_id,
          party_type: dto.party_type,
          currency_code: dto.currency_code,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = account.balance.toNumber();
    const isDebit = this.resolveIsDebit(dto.type, dto.party_type);
    const balanceAfter = isDebit ? currentBalance - dto.amount : currentBalance + dto.amount;

    const entry = await this.prisma.current_account_entries.create({
      data: {
        current_account_id: account.id,
        type: dto.type as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: dto.description,
        reference_type: dto.reference_type,
        reference_id: dto.reference_id,
        payment_id: dto.payment_id,
        date: dto.date ? new Date(dto.date) : new Date(),
        created_by: userId,
      },
    });

    // Actualizar saldo
    await this.prisma.current_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    return entry;
  }

  async findByParty(partyId: string) {
    return this.prisma.current_accounts.findMany({
      where: { party_id: partyId, deleted_at: null },
      include: {
        party: { select: { id: true, name: true } },
      },
    });
  }

  async getEntries(partyId: string, currencyCode?: string) {
    const account = await this.prisma.current_accounts.findFirst({
      where: {
        party_id: partyId,
        ...(currencyCode ? { currency_code: currencyCode } : {}),
        deleted_at: null,
      },
    });

    if (!account) return [];

    const entries = await this.prisma.current_account_entries.findMany({
      where: { current_account_id: account.id, deleted_at: null },
      orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
    });

    const userIds = [...new Set(entries.map((e) => e.created_by).filter(Boolean))] as string[];
    const users =
      userIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    return entries.map((e) => ({
      ...e,
      user_name: e.created_by ? (userMap.get(e.created_by) ?? null) : null,
    }));
  }

  async getStatement(partyId: string, currencyCode: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
      include: {
        party: { select: { id: true, name: true } },
        entries: { orderBy: { date: 'asc' } },
      },
    });

    if (!account) throw new NotFoundException('Cuenta corriente no encontrada');

    const userIds = [...new Set(account.entries.map((e) => e.created_by).filter(Boolean))] as string[];
    const users =
      userIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const entriesWithUser = account.entries.map((e) => ({
      ...e,
      user_name: e.created_by ? (userMap.get(e.created_by) ?? null) : null,
    }));

    return {
      account,
      balance: account.balance,
      entries: entriesWithUser,
    };
  }

  async getBalance(partyId: string, currencyCode: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
    });

    return {
      party_id: partyId,
      currency_code: currencyCode,
      balance: account?.balance ?? 0,
    };
  }

  async findActive() {
    return this.prisma.current_accounts.findMany({
      where: {
        deleted_at: null,
        balance: { not: 0 },
      },
      include: {
        party: { select: { id: true, name: true, type: true, tax_id: true } },
      },
      orderBy: { balance: 'asc' },
    });
  }

  async findAll(filters?: { party_type?: string; currency_code?: string; balance_filter?: string }) {
    const where: any = { deleted_at: null };

    if (filters?.party_type) {
      // Soportar múltiples party_types separados por coma
      const types = filters.party_type.split(',').map(t => t.trim()).filter(Boolean);
      where.party_type = types.length === 1 ? types[0] : { in: types };
    }
    if (filters?.currency_code) where.currency_code = filters.currency_code;

    if (filters?.balance_filter === 'positive') where.balance = { gt: 0 };
    else if (filters?.balance_filter === 'negative') where.balance = { lt: 0 };
    else if (filters?.balance_filter === 'zero') where.balance = 0;

    return this.prisma.current_accounts.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, type: true, tax_id: true } },
      },
      orderBy: { balance: 'desc' },
    });
  }

  private resolveIsDebit(type: string, partyType: string): boolean {
    // isDebit = true → balance DISMINUYE (convención del backend)
    // isDebit = false → balance AUMENTA
    //
    // CUSTOMER (ventas - a cobrar):
    //   INVOICE     → balance sube (me deben)     → isDebit = false
    //   DEBIT_NOTE  → balance sube (aumenta deuda) → isDebit = false
    //   CREDIT_NOTE → balance baja (disminuye deuda) → isDebit = true
    //   PAYMENT     → balance baja (pagaron)       → isDebit = true
    //   COLLECTION  → balance baja (cobrado)       → isDebit = true
    //
    // SUPPLIER (compras - a pagar):
    //   INVOICE     → balance baja (les debo más)  → isDebit = true
    //   DEBIT_NOTE  → balance baja (aumenta deuda) → isDebit = true
    //   CREDIT_NOTE → balance sube (disminuye deuda) → isDebit = false
    //   PAYMENT     → balance sube (les pagué)      → isDebit = false

    if (partyType === 'CUSTOMER') {
      return ['CREDIT_NOTE', 'PAYMENT', 'COLLECTION'].includes(type)
    }
    // SUPPLIER
    return ['INVOICE', 'DEBIT_NOTE', 'LOAN', 'CHECK_ISSUED', 'TRANSFER', 'DEBIT'].includes(type)
  }
}
