import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { QueryPaymentReportDto } from './dto/query-payment-report.dto';
import { parseLocalDateTime } from '@/common/utils/dates';

@Injectable()
export class PaymentReportsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private get publicPrisma() {
    return this.db.getDefaultClient();
  }

  async findByUser(dto: QueryPaymentReportDto) {
    const startDate = dto.date_from ? parseLocalDateTime(dto.date_from) : new Date(new Date().setHours(0, 0, 0, 0));
    const endDate = dto.date_to ? parseLocalDateTime(dto.date_to + 'T23:59:59.999') : new Date(new Date().setHours(23, 59, 59, 999));

    const where: any = {
      deleted_at: null,
      date: { gte: startDate, lte: endDate },
    };

    if (dto.created_by) where.created_by = dto.created_by;
    if (dto.currency_code) where.currency_code = dto.currency_code;

    const payments = await this.prisma.payments.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, type: true } },
        cash_box: { select: { id: true, name: true } },
        bank_account: { select: { id: true, name: true } },
      },
      orderBy: { date: 'asc' },
    });

    // Obtener nombres de usuarios desde public.users
    const userIds = [...new Set(payments.map(p => p.created_by).filter(Boolean))] as string[];
    const users = userIds.length > 0
      ? await this.publicPrisma.users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true },
        })
      : [];
    const userMap = new Map<string, { id: string; email: string; name: string }>(users.map(u => [u.id, u]));

    // Agrupar por usuario
    const grouped = new Map<string, any>();

    for (const payment of payments) {
      const userId = payment.created_by ?? 'unknown';
      if (!grouped.has(userId)) {
        const user = userMap.get(userId);
        grouped.set(userId, {
          user_id: userId,
          user_name: user?.name ?? user?.email ?? 'Desconocido',
          total_collections: 0,
          total_payments: 0,
          net: 0,
          count: 0,
          by_method: {} as Record<string, number>,
          details: [],
        });
      }

      const group = grouped.get(userId);
      const amount = payment.amount.toNumber();

      if (payment.type === 'COLLECTION') {
        group.total_collections += amount;
      } else {
        group.total_payments += amount;
      }
      group.net = group.total_collections - group.total_payments;
      group.count += 1;

      const method = payment.payment_method;
      group.by_method[method] = (group.by_method[method] ?? 0) + amount;

      group.details.push({
        id: payment.id,
        number: payment.number,
        type: payment.type,
        payment_method: payment.payment_method,
        amount,
        currency_code: payment.currency_code,
        date: payment.date,
        party_name: payment.party?.name ?? null,
        description: payment.description,
      });
    }

    return {
      date_from: startDate,
      date_to: endDate,
      total_users: grouped.size,
      total_payments: payments.length,
      users: Array.from(grouped.values()),
    };
  }

  async cashBoxDaily(dto: QueryPaymentReportDto) {
    if (!dto.cash_box_id) {
      throw new Error('cash_box_id es requerido');
    }

    const date = dto.date ? parseLocalDateTime(dto.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    // Obtener sesión del día
    const session = await this.prisma.cash_box_sessions.findFirst({
      where: {
        cash_box_id: dto.cash_box_id,
        opened_at: { gte: startOfDay, lte: endOfDay },
        deleted_at: null,
      },
      orderBy: { opened_at: 'desc' },
    });

    // Obtener movimientos del día
    const movements = await this.prisma.cash_box_movements.findMany({
      where: {
        cash_box_id: dto.cash_box_id,
        date: { gte: startOfDay, lte: endOfDay },
        deleted_at: null,
      },
      include: {
        payment: { select: { id: true, number: true, party: { select: { name: true } } } },
      },
      orderBy: { date: 'asc' },
    });

    // Obtener usuarios
    const userIds = [...new Set(movements.map(m => m.created_by).filter(Boolean))] as string[];
    const users = userIds.length > 0
      ? await this.publicPrisma.users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true },
        })
      : [];
    const userMap = new Map<string, { id: string; email: string; name: string }>(users.map(u => [u.id, u]));

    let totalIncome = 0;
    let totalExpenses = 0;
    const byType: Record<string, number> = {};
    const byUser: Record<string, { user_name: string; income: number; expenses: number; count: number }> = {};

    for (const mov of movements) {
      const amount = mov.amount.toNumber();
      const isOutflow = ['PAYMENT', 'LOAN', 'CHECK_ISSUED', 'TRANSFER'].includes(mov.type);

      if (isOutflow) {
        totalExpenses += amount;
      } else {
        totalIncome += amount;
      }

      byType[mov.type] = (byType[mov.type] ?? 0) + amount;

      const userId = mov.created_by ?? 'unknown';
      if (!byUser[userId]) {
        const user = userMap.get(userId);
        byUser[userId] = {
          user_name: user?.name ?? user?.email ?? 'Desconocido',
          income: 0,
          expenses: 0,
          count: 0,
        };
      }
      if (isOutflow) {
        byUser[userId].expenses += amount;
      } else {
        byUser[userId].income += amount;
      }
      byUser[userId].count += 1;
    }

    return {
      cash_box_id: dto.cash_box_id,
      date: startOfDay,
      session: session ? {
        id: session.id,
        status: session.status,
        opening_balance: session.opening_balance.toNumber(),
        closing_balance: session.closing_balance?.toNumber() ?? null,
        actual_balance: session.actual_balance?.toNumber() ?? null,
        difference: session.difference?.toNumber() ?? null,
      } : null,
      total_income: totalIncome,
      total_expenses: totalExpenses,
      net: totalIncome - totalExpenses,
      movement_count: movements.length,
      by_type: byType,
      by_user: Object.values(byUser),
    };
  }

  async bankDaily(dto: QueryPaymentReportDto) {
    if (!dto.bank_account_id) {
      throw new Error('bank_account_id es requerido');
    }

    const date = dto.date ? parseLocalDateTime(dto.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const account = await this.prisma.bank_accounts.findUnique({
      where: { id: dto.bank_account_id },
    });

    const movements = await this.prisma.bank_account_movements.findMany({
      where: {
        bank_account_id: dto.bank_account_id,
        date: { gte: startOfDay, lte: endOfDay },
        deleted_at: null,
      },
      include: {
        payment: { select: { id: true, number: true, party: { select: { name: true } } } },
      },
      orderBy: { date: 'asc' },
    });

    let totalInflows = 0;
    let totalOutflows = 0;
    const byType: Record<string, number> = {};

    for (const mov of movements) {
      const amount = mov.amount.toNumber();
      const isOutflow = ['PAYMENT', 'LOAN', 'CHECK_ISSUED', 'TRANSFER'].includes(mov.type);

      if (isOutflow) {
        totalOutflows += amount;
      } else {
        totalInflows += amount;
      }

      byType[mov.type] = (byType[mov.type] ?? 0) + amount;
    }

    // Saldo al inicio del día (saldo actual - movimientos del día)
    const currentBalance = account?.balance.toNumber() ?? 0;
    const openingBalance = currentBalance - totalInflows + totalOutflows;

    return {
      bank_account_id: dto.bank_account_id,
      bank_name: account?.name ?? null,
      date: startOfDay,
      opening_balance: openingBalance,
      total_inflows: totalInflows,
      total_outflows: totalOutflows,
      net: totalInflows - totalOutflows,
      closing_balance: currentBalance,
      movement_count: movements.length,
      by_type: byType,
      movements: movements.map(m => ({
        id: m.id,
        type: m.type,
        amount: m.amount.toNumber(),
        currency_code: m.currency_code,
        balance_before: m.balance_before.toNumber(),
        balance_after: m.balance_after.toNumber(),
        description: m.description,
        date: m.date,
        party_name: m.payment?.party?.name ?? null,
      })),
    };
  }

  async dailySummary(dto: QueryPaymentReportDto) {
    const date = dto.date ? parseLocalDateTime(dto.date) : new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const where: any = {
      deleted_at: null,
      date: { gte: startOfDay, lte: endOfDay },
    };

    if (dto.currency_code) where.currency_code = dto.currency_code;

    const payments = await this.prisma.payments.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, type: true } },
      },
      orderBy: { date: 'asc' },
    });

    // Obtener usuarios
    const userIds = [...new Set(payments.map(p => p.created_by).filter(Boolean))] as string[];
    const users = userIds.length > 0
      ? await this.publicPrisma.users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true },
        })
      : [];
    const userMap = new Map<string, { id: string; email: string; name: string }>(users.map(u => [u.id, u]));

    let totalCollections = 0;
    let totalPaymentsSum = 0;
    const byMethod: Record<string, number> = {};
    const byUser: Record<string, { user_name: string; collections: number; payments: number; count: number }> = {};
    const byCashBox: Record<string, { collections: number; payments: number; count: number }> = {};
    const byBankAccount: Record<string, { collections: number; payments: number; count: number }> = {};

    for (const payment of payments) {
      const amount = payment.amount.toNumber();

      if (payment.type === 'COLLECTION') {
        totalCollections += amount;
      } else {
        totalPaymentsSum += amount;
      }

      // Por método
      byMethod[payment.payment_method] = (byMethod[payment.payment_method] ?? 0) + amount;

      // Por usuario
      const userId = payment.created_by ?? 'unknown';
      if (!byUser[userId]) {
        const user = userMap.get(userId);
        byUser[userId] = {
          user_name: user?.name ?? user?.email ?? 'Desconocido',
          collections: 0,
          payments: 0,
          count: 0,
        };
      }
      if (payment.type === 'COLLECTION') {
        byUser[userId].collections += amount;
      } else {
        byUser[userId].payments += amount;
      }
      byUser[userId].count += 1;

      // Por caja
      if (payment.cash_box_id) {
        const cbId = payment.cash_box_id;
        if (!byCashBox[cbId]) byCashBox[cbId] = { collections: 0, payments: 0, count: 0 };
        if (payment.type === 'COLLECTION') {
          byCashBox[cbId].collections += amount;
        } else {
          byCashBox[cbId].payments += amount;
        }
        byCashBox[cbId].count += 1;
      }

      // Por banco
      if (payment.bank_account_id) {
        const baId = payment.bank_account_id;
        if (!byBankAccount[baId]) byBankAccount[baId] = { collections: 0, payments: 0, count: 0 };
        if (payment.type === 'COLLECTION') {
          byBankAccount[baId].collections += amount;
        } else {
          byBankAccount[baId].payments += amount;
        }
        byBankAccount[baId].count += 1;
      }
    }

    return {
      date: startOfDay,
      total_collections: totalCollections,
      total_payments: totalPaymentsSum,
      net: totalCollections - totalPaymentsSum,
      total_transactions: payments.length,
      by_method: byMethod,
      by_user: Object.values(byUser),
      by_cash_box: Object.entries(byCashBox).map(([id, data]) => ({ cash_box_id: id, ...data })),
      by_bank_account: Object.entries(byBankAccount).map(([id, data]) => ({ bank_account_id: id, ...data })),
    };
  }
}
