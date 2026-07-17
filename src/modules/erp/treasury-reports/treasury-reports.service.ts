import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TreasuryReportsService {
  constructor(private db: PrismaService) {}

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
}
