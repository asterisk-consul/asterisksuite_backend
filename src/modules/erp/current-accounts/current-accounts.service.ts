import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';
import { CurrencyConversionService } from '../currencies/currency-conversion.service';
import { parseLocalDateTime } from '@/common/utils/dates';

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
    } else if (account.party_type !== dto.party_type) {
      // Mantener la clasificación sincronizada con la parte interesada.
      // También repara cuentas antiguas creadas genéricamente como SUPPLIER.
      account = await this.prisma.current_accounts.update({
        where: { id: account.id },
        data: { party_type: dto.party_type },
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
            dto.date ? parseLocalDateTime(dto.date) : new Date(),
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
        date: parseLocalDateTime(dto.date),
        created_by: userId,
      },
    });

    console.log('[CC] addEntry dto.date:', dto.date, '→ parsed:', entry.date?.toISOString?.() ?? entry.date)

    // ─── Update account balance + last entry date ────────────
    await this.prisma.current_accounts.update({
      where: { id: account.id },
      data: {
        balance: balanceAfter,
        last_entry_date: entry.date,
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

  async getEntries(partyId: string, userId?: string) {
    const account = await this.prisma.current_accounts.findFirst({
      where: { party_id: partyId, deleted_at: null },
    });

    if (!account) return [];

    const entries = await this.prisma.current_account_entries.findMany({
      where: {
        current_account_id: account.id,
        deleted_at: null,
        ...(userId ? { created_by: userId } : {}),
      },
      orderBy: [{ created_at: 'desc' }],
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

    const entriesWithUser = entries.map((e) => ({
      ...e,
      user_name: e.created_by ? (userMap.get(e.created_by) ?? null) : null,
    }));

    return this.enrichEntriesWithDocumentChain(entriesWithUser);
  }

  async getStatement(partyId: string, userId?: string) {
    const account = await this.prisma.current_accounts.findUnique({
      where: { party_id: partyId },
      include: {
        party: { select: { id: true, name: true } },
        entries: {
          where: userId ? { created_by: userId } : undefined,
          orderBy: { created_at: 'asc' },
        },
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

    const enrichedEntries = await this.enrichEntriesWithDocumentChain(entriesWithUser);

    return {
      account,
      balance: account.balance,
      entries: enrichedEntries,
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
    const accounts = await this.prisma.current_accounts.findMany({
      where: {
        deleted_at: null,
        balance: { not: 0 },
      },
      include: {
        party: { select: { id: true, name: true, type: true, tax_id: true } },
        entries: {
          where: { deleted_at: null },
          orderBy: { date: 'desc' },
          take: 1,
          select: { type: true, description: true, reference_type: true, date: true },
        },
      },
      orderBy: { balance: 'asc' },
    });

    return accounts.map((a) => ({
      ...a,
      last_entry: a.entries[0] ?? null,
      entries: undefined,
    }));
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

    const accounts = await this.prisma.current_accounts.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, type: true, tax_id: true } },
        entries: {
          where: { deleted_at: null },
          orderBy: { date: 'desc' },
          take: 1,
          select: { type: true, description: true, reference_type: true, date: true },
        },
      },
      orderBy: { balance: 'desc' },
    });

    return accounts.map((a) => ({
      ...a,
      last_entry: a.entries[0] ?? null,
      entries: undefined,
    }));
  }

  private resolveIsDebit(type: string, partyType: string): boolean {
    if (type === 'OPENING_BALANCE') return false
    if (partyType === 'CUSTOMER') {
      return ['CREDIT_NOTE', 'PAYMENT', 'COLLECTION', 'WITHHOLDING'].includes(type);
    }
    return ['CREDIT_NOTE', 'PAYMENT', 'ADVANCE', 'WITHHOLDING'].includes(type);
  }

  // ─── Document chain builder ────────────────────────────────
  // Builds an ordered array from root → leaf for a given document

  private async buildDocumentChain(documentId: string): Promise<Array<{
    id: string; number: number; type_code: string; description: string | null; role: 'parent' | 'current' | 'child'
  }>> {
    const doc = await this.prisma.documents.findUnique({
      where: { id: documentId },
      include: {
        document_types: { select: { code: true } },
      },
    });
    if (!doc) return [];

    // Walk UP to root via parent_document_id
    const ancestors: any[] = [];
    let current = doc;
    while (current.parent_document_id) {
      const parent = await this.prisma.documents.findUnique({
        where: { id: current.parent_document_id },
        include: { document_types: { select: { code: true } } },
      });
      if (!parent) break;
      ancestors.unshift(parent);
      current = parent;
    }

    // Walk DOWN via child_documents
    const descendants: any[] = [];
    const collectChildren = async (parentId: string) => {
      const children = await this.prisma.documents.findMany({
        where: { parent_document_id: parentId, deleted_at: null },
        include: { document_types: { select: { code: true } } },
        orderBy: { created_at: 'asc' },
      });
      for (const child of children) {
        descendants.push(child);
        await collectChildren(child.id);
      }
    };
    await collectChildren(doc.id);

    // Build flat chain: root → ... → current doc → ... → leaf
    const chain = [...ancestors, doc, ...descendants];
    return chain.map((d) => ({
      id: d.id,
      number: d.number,
      type_code: d.document_types?.code ?? d.type_code ?? '—',
      description: d.descrip ?? null,
      role: d.id === doc.id ? 'current' as const
        : ancestors.some(a => a.id === d.id) ? 'parent' as const
        : 'child' as const,
    }));
  }

  private async enrichEntriesWithDocumentChain(entries: any[]) {
    const docEntries = entries.filter(
      (e) => (e.reference_type === 'document' || e.reference_type === 'document_reversal') && e.reference_id
    );

    const chainMap = new Map<string, any[]>();
    for (const e of docEntries) {
      if (!chainMap.has(e.reference_id)) {
        chainMap.set(e.reference_id, await this.buildDocumentChain(e.reference_id));
      }
    }

    return entries.map((e) => ({
      ...e,
      document_chain: chainMap.get(e.reference_id) ?? null,
    }));
  }
}
