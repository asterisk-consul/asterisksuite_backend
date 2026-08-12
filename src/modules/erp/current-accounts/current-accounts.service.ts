import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';
import { CurrencyConversionService } from '../currencies/currency-conversion.service';

@Injectable()
export class CurrentAccountsService {
  constructor(
    private db: PrismaService,
    private conversionService: CurrencyConversionService,
  ) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async addEntry(dto: CreateCurrentAccountEntryDto, userId: string) {
    const baseCurrency = await this.conversionService.getBaseCurrency();

    // Always find/create account by party_id only (single account per party)
    let account = await this.prisma.current_accounts.findUnique({
      where: { party_id: dto.party_id },
    });

    if (!account) {
      account = await this.prisma.current_accounts.create({
        data: {
          party_id: dto.party_id,
          party_type: dto.party_type,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const isBaseCurrency = dto.currency_code.toUpperCase() === baseCurrency.code.toUpperCase();

    // ─── Calculate exchange rate and converted amount ─────────
    let exchangeRate = dto.exchange_rate ?? null;
    let rateType = (dto.rate_type as any) ?? null;
    let convertedAmount: number | null = null;

    if (isBaseCurrency) {
      // Base currency: converted_amount = amount (same currency)
      convertedAmount = dto.amount;
    } else {
      // Non-base currency: resolve rate and convert
      if (!exchangeRate) {
        try {
          const resolved = await this.conversionService.resolveRate(
            dto.currency_code,
            baseCurrency.code,
            dto.date ? new Date(dto.date) : new Date(),
            rateType,
          );
          exchangeRate = resolved.rate;
          rateType = resolved.rateType;
        } catch {
          // If rate not found, leave as null
        }
      }
      if (exchangeRate) {
        convertedAmount = this.conversionService.convertAmount(dto.amount, exchangeRate);
      }
    }

    // ─── Calculate balance change in base currency ────────────
    // balanceAfter = balance + (isDebit ? -convertedAmount : +convertedAmount)
    const currentBalance = account.balance.toNumber();
    const isDebit = this.resolveIsDebit(dto.type, dto.party_type);
    const balanceChange = convertedAmount ?? dto.amount;
    const balanceAfter = isDebit ? currentBalance - balanceChange : currentBalance + balanceChange;

    // ─── Create entry ─────────────────────────────────────────
    const entry = await this.prisma.current_account_entries.create({
      data: {
        current_account_id: account.id,
        type: dto.type as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: exchangeRate,
        rate_type: rateType,
        converted_amount: convertedAmount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: dto.description,
        reference_type: dto.reference_type,
        reference_id: dto.reference_id,
        payment_id: dto.payment_id,
        date: (() => {
          if (dto.date) {
            const dateStr = dto.date.includes('T') ? dto.date.split('T')[0] : dto.date
            const now = new Date()
            const [y, m, d] = dateStr.split('-').map(Number)
            return new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds())
          }
          return new Date()
        })(),
        created_by: userId,
      },
    });

    // ─── Update account balance (always in base currency) ─────
    await this.prisma.current_accounts.update({
      where: { id: account.id },
      data: {
        balance: balanceAfter,
        updated_at: new Date(),
      },
    });

    return entry;
  }

  async findByParty(partyId: string) {
    // Return single account per party (always base currency)
    return this.prisma.current_accounts.findMany({
      where: { party_id: partyId, deleted_at: null },
      include: {
        party: { select: { id: true, name: true } },
      },
    });
  }

  async getEntries(partyId: string) {
    const account = await this.prisma.current_accounts.findFirst({
      where: { party_id: partyId, deleted_at: null },
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

  async getStatement(partyId: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: { party_id: partyId },
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

  async getBalance(partyId: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: { party_id: partyId },
    });

    const baseCurrency = await this.conversionService.getBaseCurrency();

    return {
      party_id: partyId,
      currency_code: baseCurrency.code,
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

  async findAll(filters?: { party_type?: string; balance_filter?: string }) {
    const where: any = { deleted_at: null };

    if (filters?.party_type) {
      const types = filters.party_type.split(',').map(t => t.trim()).filter(Boolean);
      where.party_type = types.length === 1 ? types[0] : { in: types };
    }

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
    if (type === 'OPENING_BALANCE') return false
    if (partyType === 'CUSTOMER') {
      return ['CREDIT_NOTE', 'PAYMENT', 'COLLECTION'].includes(type);
    }
    return ['CREDIT_NOTE', 'PAYMENT', 'ADVANCE'].includes(type);
  }
}
