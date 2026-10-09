import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';
import { CurrencyConversionService } from '../currencies/currency-conversion.service';
import { parseLocalDateTime } from '@/common/utils/dates';
import { recalculateCurrentAccountLedger } from './current-account-ledger';

const STATUS_CANCELLED = 3;

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
    // Los saldos iniciales cargados manualmente deben tener un documento
    // seleccionable en pagos/cobros. Los asientos generados al confirmar un
    // documento ya llegan vinculados y no deben crear otro documento.
    if (dto.type === 'OPENING_BALANCE' && !dto.reference_id) {
      return this.addOpeningBalance(dto, userId);
    }

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
    const isDebit = dto.balance_effect
      ? dto.balance_effect === 'DECREASE'
      : this.resolveIsDebit(dto.type, dto.party_type);
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
    await recalculateCurrentAccountLedger(this.prisma, account.id);

    return entry;
  }

  private async addOpeningBalance(dto: CreateCurrentAccountEntryDto, userId: string) {
    if (!['CUSTOMER', 'SUPPLIER'].includes(dto.party_type)) {
      throw new BadRequestException('El saldo inicial requiere un cliente o proveedor');
    }

    const baseCurrency = await this.conversionService.getBaseCurrency();
    const entryDate = dto.date ? parseLocalDateTime(dto.date) : new Date();
    const isBaseCurrency = dto.currency_code.toUpperCase() === baseCurrency.code.toUpperCase();
    let exchangeRate = dto.exchange_rate ?? null;
    let rateType = (dto.rate_type as any) ?? null;
    let convertedAmount: number | null = isBaseCurrency ? dto.amount : null;

    if (!isBaseCurrency) {
      if (!exchangeRate) {
        try {
          const resolved = await this.conversionService.resolveRate(
            dto.currency_code,
            baseCurrency.code,
            entryDate,
            rateType,
          );
          exchangeRate = resolved.rate;
          rateType = resolved.rateType;
        } catch {
          // La validación siguiente devuelve un mensaje funcional más claro.
        }
      }
      if (!exchangeRate) {
        throw new BadRequestException('No se pudo determinar el tipo de cambio del saldo inicial');
      }
      convertedAmount = this.conversionService.convertAmount(dto.amount, exchangeRate);
    }

    return this.prisma.$transaction(async (tx) => {
      const party = await tx.business_parties.findFirst({
        where: { id: dto.party_id, deleted_at: null },
        select: { id: true, type: true },
      });
      if (!party) throw new NotFoundException('Cliente o proveedor no encontrado');
      if (party.type !== dto.party_type) {
        throw new BadRequestException('El tipo de la parte interesada no coincide con el saldo inicial');
      }

      let account = await tx.current_accounts.findUnique({
        where: { party_id: dto.party_id },
      });
      if (!account) {
        account = await tx.current_accounts.create({
          data: {
            party_id: dto.party_id,
            party_type: dto.party_type,
            balance: 0,
            created_by: userId,
          },
        });
      }

      const activeEntries = await tx.current_account_entries.count({
        where: { current_account_id: account.id, deleted_at: null },
      });
      if (activeEntries > 0) {
        throw new BadRequestException('El saldo inicial solo puede cargarse antes del primer movimiento de la cuenta corriente');
      }

      const documentTypeCode = dto.party_type === 'CUSTOMER' ? 'SI-C' : 'SI-P';
      const documentType = await tx.document_types.findFirst({
        where: {
          code: documentTypeCode,
          category: 'OPENING_BALANCE',
          active: true,
          deleted_at: null,
        },
      });
      if (!documentType) {
        throw new BadRequestException(`No existe el tipo documental ${documentTypeCode} activo`);
      }
      if (!documentType.affects_payment) {
        throw new BadRequestException(`El tipo documental ${documentTypeCode} debe tener activada la opción Afecta pagos`);
      }

      const lastDocument = await tx.documents.findFirst({
        where: { document_type_id: documentType.id },
        orderBy: { number: 'desc' },
        select: { number: true },
      });
      const isDecrease = dto.balance_effect === 'DECREASE';
      const signedAmount = isDecrease ? -dto.amount : dto.amount;
      const signedConvertedAmount = isDecrease
        ? -(convertedAmount ?? dto.amount)
        : (convertedAmount ?? dto.amount);
      const description = (dto.description || 'Saldo inicial').slice(0, 50);

      const document = await tx.documents.create({
        data: {
          document_type_id: documentType.id,
          party_id: dto.party_id,
          number: (lastDocument?.number ?? 0) + 1,
          date: entryDate,
          status: 2,
          subtotal: signedAmount,
          exempt_amount: 0,
          total_taxes: 0,
          total: signedAmount,
          taxable_base: signedAmount,
          paid_amount: 0,
          currency_code: dto.currency_code,
          exchange_rate: exchangeRate,
          rate_type: rateType,
          converted_subtotal: signedConvertedAmount,
          converted_total: signedConvertedAmount,
          converted_taxable_base: signedConvertedAmount,
          converted_paid_amount: 0,
          descrip: description,
          source: 'opening_balance',
          created_by: userId,
        },
      });

      const currentBalance = Number(account.balance);
      const balanceAfter = currentBalance + signedConvertedAmount;
      const entry = await tx.current_account_entries.create({
        data: {
          current_account_id: account.id,
          type: 'OPENING_BALANCE',
          amount: dto.amount,
          currency_code: dto.currency_code,
          exchange_rate: exchangeRate,
          rate_type: rateType,
          converted_amount: convertedAmount,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: dto.description || 'Saldo inicial',
          reference_type: 'document',
          reference_id: document.id,
          date: entryDate,
          created_by: userId,
        },
      });

      await tx.current_accounts.update({
        where: { id: account.id },
        data: {
          party_type: dto.party_type,
          balance: balanceAfter,
          last_entry_date: entryDate,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
      await recalculateCurrentAccountLedger(tx, account.id);

      return entry;
    });
  }

  async deleteOpeningBalance(partyId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const account = await tx.current_accounts.findFirst({
        where: { party_id: partyId, deleted_at: null },
      });
      if (!account) throw new NotFoundException('Cuenta corriente no encontrada');

      const entries = await tx.current_account_entries.findMany({
        where: { current_account_id: account.id, deleted_at: null },
        select: { id: true, type: true, reference_type: true, reference_id: true },
      });
      if (entries.length !== 1 || entries[0].type !== 'OPENING_BALANCE') {
        throw new BadRequestException(
          'El saldo inicial solo puede eliminarse cuando es el único movimiento de la cuenta corriente',
        );
      }

      const now = new Date();
      await tx.current_account_entries.update({
        where: { id: entries[0].id },
        data: { deleted_at: now, deleted_by: userId },
      });
      if (entries[0].reference_type === 'document' && entries[0].reference_id) {
        await tx.documents.updateMany({
          where: {
            id: entries[0].reference_id,
            document_types: { category: 'OPENING_BALANCE' },
            deleted_at: null,
          },
          data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
        });
      }
      await tx.current_accounts.update({
        where: { id: account.id },
        data: { balance: 0, last_entry_date: null, updated_by: userId },
      });
      await recalculateCurrentAccountLedger(tx, account.id);
      return { success: true, balance: 0 };
    });
  }

  async removeDocumentEffects(documentId: string, userId: string, tx?: any) {
    const prisma = tx ?? this.prisma;
    const entries = await prisma.current_account_entries.findMany({
      where: {
        reference_id: documentId,
        reference_type: {
          in: [
            'document',
            'document_reversal',
            'order_invoice_replacement',
            'order_invoice_replacement_reversal',
          ],
        },
        deleted_at: null,
      },
      orderBy: { created_at: 'asc' },
    });

    const entriesByAccount = new Map<string, typeof entries>();
    for (const entry of entries) {
      const accountEntries = entriesByAccount.get(entry.current_account_id) ?? [];
      accountEntries.push(entry);
      entriesByAccount.set(entry.current_account_id, accountEntries);
    }

    for (const [accountId, accountEntries] of entriesByAccount) {
      const removedDelta = accountEntries.reduce(
        (sum, entry) => sum + Number(entry.balance_after) - Number(entry.balance_before),
        0,
      );
      const account = await prisma.current_accounts.findUnique({
        where: { id: accountId },
        select: { balance: true },
      });
      if (!account) continue;

      const now = new Date();
      await prisma.current_account_entries.updateMany({
        where: { id: { in: accountEntries.map(entry => entry.id) } },
        data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
      });
      await prisma.current_accounts.update({
        where: { id: accountId },
        data: { balance: Number(account.balance) - removedDelta, updated_at: now, updated_by: userId },
      });
      await recalculateCurrentAccountLedger(prisma, accountId);
    }

    return entries.length;
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
      orderBy: [{ date: 'desc' }, { created_at: 'desc' }, { id: 'desc' }],
    });

    const visibleEntries = await this.excludeCancelledDocumentEntries(entries);
    const userIds = [...new Set(visibleEntries.map((e) => e.created_by).filter(Boolean))] as string[];
    const users =
      userIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const entriesWithUser = visibleEntries.map((e) => ({
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
          where: {
            deleted_at: null,
            ...(userId ? { created_by: userId } : {}),
          },
          orderBy: [{ date: 'asc' }, { created_at: 'asc' }, { id: 'asc' }],
        },
      },
    });

    if (!account) throw new NotFoundException('Cuenta corriente no encontrada');

    const visibleEntries = await this.excludeCancelledDocumentEntries(account.entries);
    const userIds = [...new Set(visibleEntries.map((e) => e.created_by).filter(Boolean))] as string[];
    const users =
      userIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: userIds } },
            select: { id: true, name: true },
          })
        : [];
    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const entriesWithUser = visibleEntries.map((e) => ({
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

  private async excludeCancelledDocumentEntries<T extends {
    reference_type: string | null;
    reference_id: string | null;
    created_by: string | null;
  }>(entries: T[]): Promise<T[]> {
    const documentReferenceTypes = new Set([
      'document',
      'document_reversal',
      'order_invoice_replacement',
      'order_invoice_replacement_reversal',
    ]);
    const documentIds = [...new Set(entries
      .filter(entry => entry.reference_id && documentReferenceTypes.has(entry.reference_type ?? ''))
      .map(entry => entry.reference_id!))];
    if (documentIds.length === 0) return entries;

    const cancelledDocuments = await this.prisma.documents.findMany({
      where: { id: { in: documentIds }, status: STATUS_CANCELLED },
      select: { id: true },
    });
    const cancelledIds = new Set(cancelledDocuments.map(document => document.id));
    return entries.filter(entry => !entry.reference_id || !cancelledIds.has(entry.reference_id));
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
