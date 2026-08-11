import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CurrencyConversionService } from '../currencies/currency-conversion.service';

@Injectable()
export class TreasuryReportsService {
  constructor(
    private db: PrismaService,
    private readonly conversionService: CurrencyConversionService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async dashboard() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thirtyDays = new Date(today);
    thirtyDays.setDate(thirtyDays.getDate() + 30);

    const [
      bankBalances,
      cashBoxBalances,
      pendingOwnChecks,
      pendingThirdPartyChecks,
      upcomingChecks,
      totalPayments,
      totalCollections,
    ] = await Promise.all([
      this.prisma.bank_accounts.findMany({
        where: { active: true, deleted_at: null },
        select: { id: true, name: true, bank_name: true, currency_code: true, balance: true },
      }),
      this.prisma.cash_boxes.findMany({
        where: { deleted_at: null },
        include: {
          balances: {
            select: { currency_code: true, balance: true },
          },
        },
      }),
      this.prisma.checks.count({
        where: { is_own: true, status: 'PENDING', deleted_at: null },
      }),
      this.prisma.checks.count({
        where: { is_own: false, status: 'PENDING', deleted_at: null },
      }),
      this.prisma.checks.findMany({
        where: {
          is_own: true,
          status: 'PENDING',
          due_date: { gte: today, lte: thirtyDays },
          deleted_at: null,
        },
        select: {
          id: true,
          check_number: true,
          bank_name: true,
          amount: true,
          currency_code: true,
          due_date: true,
          payment_date: true,
        },
        orderBy: { due_date: 'asc' },
        take: 10,
      }),
      this.prisma.payments.aggregate({
        where: { type: 'PAYMENT', deleted_at: null },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.payments.aggregate({
        where: { type: 'COLLECTION', deleted_at: null },
        _sum: { amount: true },
        _count: true,
      }),
    ]);

    const totalBankBalance = bankBalances.reduce((sum, b) => sum + Number(b.balance), 0);

    const cashBoxesFlat = cashBoxBalances.flatMap((cb) =>
      cb.balances.map((b) => ({
        id: cb.id,
        name: cb.name,
        currency_code: b.currency_code,
        balance: Number(b.balance),
      })),
    );

    const pendingChecksByCurrency: Record<string, { count: number; total_amount: number; currency_code: string }> = {};
    upcomingChecks.forEach((c) => {
      if (!pendingChecksByCurrency[c.currency_code]) {
        pendingChecksByCurrency[c.currency_code] = { count: 0, total_amount: 0, currency_code: c.currency_code };
      }
      pendingChecksByCurrency[c.currency_code].count++;
      pendingChecksByCurrency[c.currency_code].total_amount += Number(c.amount);
    });

    return {
      bank_accounts: bankBalances,
      cash_boxes: cashBoxesFlat,
      pending_checks: Object.values(pendingChecksByCurrency),
      payment_totals: [
        {
          total_payments: Number(totalPayments._sum.amount ?? 0),
          total_collections: Number(totalCollections._sum.amount ?? 0),
          currency_code: 'ARS',
        },
      ],
      summary: {
        total_bank_balance: totalBankBalance,
        pending_own_checks: pendingOwnChecks,
        pending_third_party_checks: pendingThirdPartyChecks,
        total_payments: Number(totalPayments._sum.amount ?? 0),
        total_payments_count: totalPayments._count,
        total_collections: Number(totalCollections._sum.amount ?? 0),
        total_collections_count: totalCollections._count,
      },
      upcoming_checks: upcomingChecks,
    };
  }

  async movements(filters?: {
    type?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
  }) {
    const limit = filters?.limit ?? 50;
    const where: Record<string, any> = { deleted_at: null };

    if (filters?.date_from || filters?.date_to) {
      where.date = {};
      if (filters.date_from) where.date.gte = new Date(filters.date_from);
      if (filters.date_to) where.date.lte = new Date(filters.date_to);
    }

    const results: any[] = [];

    const includeTypes = !filters?.type || filters.type === 'all';

    if (includeTypes || filters?.type === 'bank_movement') {
      const bankMovements = await this.prisma.bank_account_movements.findMany({
        where,
        include: {
          bank_account: { select: { name: true, bank_name: true } },
        },
        orderBy: { date: 'desc' },
        take: limit,
      });

      const bankUserIds = [...new Set(bankMovements.map(m => m.created_by).filter(Boolean))] as string[];
      const bankUsers = bankUserIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: bankUserIds } },
            select: { id: true, name: true }
          })
        : [];
      const bankUserMap = new Map(bankUsers.map(u => [u.id, u.name]));

      results.push(
        ...bankMovements.map((m) => ({
          source: 'bank',
          date: m.date,
          type: m.type,
          amount: Number(m.amount),
          currency_code: m.currency_code,
          description: m.description,
          source_name: `${m.bank_account.bank_name} - ${m.bank_account.name}`,
          user_name: m.created_by ? (bankUserMap.get(m.created_by) ?? null) : null,
          reference_type: m.reference_type,
          reference_id: m.reference_id,
        })),
      );
    }

    if (includeTypes || filters?.type === 'cash_movement') {
      const cashMovements = await this.prisma.cash_box_movements.findMany({
        where,
        include: {
          cash_box: { select: { name: true } },
        },
        orderBy: { date: 'desc' },
        take: limit,
      });

      const cashUserIds = [...new Set(cashMovements.map(m => m.created_by).filter(Boolean))] as string[];
      const cashUsers = cashUserIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: cashUserIds } },
            select: { id: true, name: true }
          })
        : [];
      const cashUserMap = new Map(cashUsers.map(u => [u.id, u.name]));

      results.push(
        ...cashMovements.map((m) => ({
          source: 'cash_box',
          date: m.date,
          type: m.type,
          amount: Number(m.amount),
          currency_code: m.currency_code,
          description: m.description,
          source_name: m.cash_box.name,
          user_name: m.created_by ? (cashUserMap.get(m.created_by) ?? null) : null,
          reference_type: m.reference_type,
          reference_id: m.reference_id,
        })),
      );
    }

    if (includeTypes || filters?.type === 'payment') {
      const payments = await this.prisma.payments.findMany({
        where,
        orderBy: { date: 'desc' },
        take: limit,
      });

      const paymentUserIds = [...new Set(payments.map(p => p.created_by).filter(Boolean))] as string[];
      const paymentUsers = paymentUserIds.length > 0
        ? await this.db.getDefaultClient().users.findMany({
            where: { id: { in: paymentUserIds } },
            select: { id: true, name: true }
          })
        : [];
      const paymentUserMap = new Map(paymentUsers.map(u => [u.id, u.name]));

      results.push(
        ...payments.map((p) => ({
          source: 'payment',
          date: p.date,
          type: p.type,
          amount: Number(p.amount),
          currency_code: p.currency_code,
          description: p.description,
          source_name: p.payment_method,
          user_name: p.created_by ? (paymentUserMap.get(p.created_by) ?? null) : null,
          reference_type: 'payment',
          reference_id: p.id,
        })),
      );
    }

    results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return results.slice(0, limit);
  }

  async libroIva(dateFrom?: string, dateTo?: string) {
    const where: any = {
      deleted_at: null,
      status: 2,
      document_types: {
        affects_tax_book: true,
      },
    };

    // Si no hay documentos con affects_tax_book, traer todos los de venta/compra
    const documentsWithTaxBook = await this.prisma.documents.findMany({
      where,
      select: { id: true },
      take: 1,
    });

    if (documentsWithTaxBook.length === 0) {
      where.document_types = {
        direction: { in: [1, -1] },
      };
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const baseCurrency = await this.conversionService.getBaseCurrency();

    const documents = await this.prisma.documents.findMany({
      where,
      include: {
        document_types: {
          select: { code: true, description: true, direction: true }
        },
        business_parties: {
          select: { name: true, tax_id: true }
        },
        document_taxes: {
          include: {
            taxes: { select: { name: true, code: true } }
          }
        }
      },
      orderBy: { date: 'asc' },
    });

    return documents.map(doc => {
      const isForeign = doc.currency_code && doc.currency_code.toUpperCase() !== baseCurrency.code.toUpperCase();

      return {
        id: doc.id,
        date: doc.date,
        number: doc.number,
        type_code: doc.document_types?.code,
        type_description: doc.document_types?.description,
        direction: doc.document_types?.direction,
        party_name: doc.business_parties?.name || '—',
        party_tax_id: doc.business_parties?.tax_id || '—',
        currency_code: doc.currency_code,
        exchange_rate: Number(doc.exchange_rate ?? 1),
        subtotal: isForeign ? Number(doc.converted_subtotal ?? doc.subtotal) : Number(doc.subtotal),
        total_taxes: isForeign ? Number(doc.converted_total_taxes ?? doc.total_taxes) : Number(doc.total_taxes),
        total: isForeign ? Number(doc.converted_total ?? doc.total) : Number(doc.total),
        taxable_base: isForeign ? Number(doc.converted_taxable_base ?? doc.taxable_base ?? doc.subtotal) : Number(doc.taxable_base || doc.subtotal),
        taxes: doc.document_taxes.map(t => ({
          name: t.taxes?.name,
          code: t.taxes?.code,
          rate: Number(t.tax_rate),
          amount: isForeign ? Number(t.converted_tax_amount ?? t.tax_amount) : Number(t.tax_amount)
        }))
      };
    });
  }

  async regulatoryPayments(dateFrom?: string, dateTo?: string) {
    const where: any = {
      deleted_at: null,
      status: { in: ['CONFIRMED', 'PAID'] },
      party: {
        type: { in: ['TAX_AUTHORITY', 'UTILITY'] },
      },
    };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const payments = await this.prisma.payments.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: 'asc' },
    });

    const byPartyAndMonth: Record<string, {
      party_id: string;
      party_name: string;
      party_type: string;
      months: Record<string, number>;
      total: number;
    }> = {};

    for (const p of payments) {
      const partyId = p.party_id ?? 'unknown';
      const partyName = p.party?.name ?? 'Sin ente';
      const partyType = p.party?.type ?? 'UNKNOWN';
      const monthKey = p.date.toISOString().slice(0, 7);
      const amount = Number(p.amount);

      if (!byPartyAndMonth[partyId]) {
        byPartyAndMonth[partyId] = {
          party_id: partyId,
          party_name: partyName,
          party_type: partyType,
          months: {},
          total: 0,
        };
      }

      byPartyAndMonth[partyId].months[monthKey] =
        (byPartyAndMonth[partyId].months[monthKey] ?? 0) + amount;
      byPartyAndMonth[partyId].total += amount;
    }

    const allMonths = [...new Set(payments.map(p => p.date.toISOString().slice(0, 7)))].sort();

    return {
      months: allMonths,
      parties: Object.values(byPartyAndMonth).sort((a, b) => b.total - a.total),
    };
  }

  async utilityPayments(dateFrom?: string, dateTo?: string) {
    const where: any = {
      deleted_at: null,
      status: { in: ['CONFIRMED', 'PAID'] },
      party: {
        type: 'UTILITY',
      },
    };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    const payments = await this.prisma.payments.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: 'asc' },
    });

    const byPartyAndMonth: Record<string, {
      party_id: string;
      party_name: string;
      months: Record<string, number>;
      total: number;
    }> = {};

    for (const p of payments) {
      const partyId = p.party_id ?? 'unknown';
      const partyName = p.party?.name ?? 'Sin servicio';
      const monthKey = p.date.toISOString().slice(0, 7);
      const amount = Number(p.amount);

      if (!byPartyAndMonth[partyId]) {
        byPartyAndMonth[partyId] = {
          party_id: partyId,
          party_name: partyName,
          months: {},
          total: 0,
        };
      }

      byPartyAndMonth[partyId].months[monthKey] =
        (byPartyAndMonth[partyId].months[monthKey] ?? 0) + amount;
      byPartyAndMonth[partyId].total += amount;
    }

    const allMonths = [...new Set(payments.map(p => p.date.toISOString().slice(0, 7)))].sort();

    return {
      months: allMonths,
      parties: Object.values(byPartyAndMonth).sort((a, b) => b.total - a.total),
    };
  }
}
