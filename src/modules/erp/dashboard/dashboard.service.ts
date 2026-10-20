import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SaveDashboardConfigDto } from './dto/save-dashboard-config.dto';
@Injectable()
export class DashboardService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getConfig(userId: string, dashboardKey: string) {
    const config = await this.prisma.dashboard_configs.findUnique({
      where: {
        user_id_dashboard_key: {
          user_id: userId,
          dashboard_key: dashboardKey,
        },
      },
    });

    return config ? { widgets: config.config } : null;
  }

  async saveConfig(userId: string, dto: SaveDashboardConfigDto) {
    console.log('[Dashboard] saveConfig service:', { userId, dashboard_key: dto.dashboard_key, widgetsCount: dto.widgets?.length, widgets: JSON.stringify(dto.widgets)?.substring(0, 200) });
    try {
      const config = await this.prisma.dashboard_configs.upsert({
        where: {
          user_id_dashboard_key: {
            user_id: userId,
            dashboard_key: dto.dashboard_key,
          },
        },
        create: {
          user_id: userId,
          dashboard_key: dto.dashboard_key,
          config: dto.widgets as any,
        },
        update: {
          config: dto.widgets as any,
        },
      });

      console.log('[Dashboard] saveConfig success');
      return config.config;
    } catch (error) {
      console.error('[Dashboard] saveConfig error:', error);
      throw error;
    }
  }

  async deleteConfig(userId: string, dashboardKey: string) {
    await this.prisma.dashboard_configs.deleteMany({
      where: {
        user_id: userId,
        dashboard_key: dashboardKey,
      },
    });

    return { success: true };
  }

  async getDashboardData(checksDays?: number, documentDays?: number) {
    const now = new Date();
    // Los documentos usan una fecha de negocio sin hora. Calculamos "hoy" en
    // Argentina y lo representamos a las 00:00 UTC para comparar Date/DateTime
    // sin depender de la zona horaria del contenedor.
    const argentinaNow = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const today = new Date(Date.UTC(
      argentinaNow.getUTCFullYear(),
      argentinaNow.getUTCMonth(),
      argentinaNow.getUTCDate(),
    ));
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    const checksAhead = new Date(today);
    checksAhead.setDate(checksAhead.getDate() + (checksDays ?? 30));

    // Rango de fechas para los documentos del dashboard (default: 30 días).
    // documentDays = 1 → desde hoy (00:00)
    const documentRange = documentDays && documentDays > 0 ? documentDays : 30;
    const documentsFrom = new Date(today);
    documentsFrom.setUTCDate(documentsFrom.getUTCDate() - documentRange + 1);
    const documentDateFilter = { gte: documentsFrom, lt: tomorrow };

    const [
      quotes,
      orders,
      remitos,
      invoices,
      creditNotes,
      debitNotes,
      hrVales,
      hrAccounts,
      warehouseStock,
      receivableAccounts,
      costedProducts,
      currentAccountsData,
      pendingPickingCount,
      activeTrips,
      dueChecks,
      pendingPayments,
      totalProductsCount,
      productsByUsage,
      dashboardDocumentTypes,
    ] = await Promise.all([
      this.prisma.documents.groupBy({
        by: ['status', 'document_type_id'],
        where: {
          deleted_at: null,
          document_types: { category: 'QUOTE' },
          date: documentDateFilter,
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status', 'document_type_id'],
        where: {
          deleted_at: null,
          document_types: { category: 'ORDER' },
          date: documentDateFilter,
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status', 'document_type_id'],
        where: {
          deleted_at: null,
          document_types: { category: 'REMITO' },
          date: documentDateFilter,
        },
        _count: { id: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status', 'document_type_id'],
        where: {
          deleted_at: null,
          document_types: { category: 'INVOICE' },
          date: documentDateFilter,
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status', 'document_type_id'],
        where: {
          deleted_at: null,
          document_types: { category: 'CREDIT_NOTE' },
          date: documentDateFilter,
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status', 'document_type_id'],
        where: {
          deleted_at: null,
          document_types: { category: 'DEBIT_NOTE' },
          date: documentDateFilter,
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.hr_vales.groupBy({
        by: ['status'],
        where: { deleted_at: null },
        _count: { id: true },
        _sum: { amount: true },
      }),
      this.prisma.hr_accounts.findMany({
        where: { deleted_at: null },
        select: { id: true, party_id: true, party_type: true, currency_code: true, balance: true },
      }),
      this.prisma.warehouse_stock.findMany({
        where: { deleted_at: null },
        select: { product_id: true, quantity: true, reserved_quantity: true },
      }),
      // Por cobrar: circuito de ventas completo (cuentas corrientes de clientes).
      // Incluye órdenes cuando el circuito contabiliza OV, facturas, notas de
      // crédito, cobros aplicados y saldos iniciales.
      this.prisma.current_accounts.aggregate({
        where: {
          deleted_at: null,
          active: true,
          party_type: 'CUSTOMER',
          balance: { gt: 0 },
        },
        _count: { id: true },
        _sum: { balance: true },
      }),
      // Productos costeados: distinct product_ids con al menos un product_costs activo
      this.prisma.product_costs.findMany({
        where: { active: true, deleted_at: null },
        select: { product_id: true },
        distinct: ['product_id'],
      }),
      // Cuentas corrientes top 5 por |balance|
      this.prisma.current_accounts.findMany({
        where: { active: true, deleted_at: null },
        include: {
          party: { select: { id: true, name: true } },
        },
        orderBy: { balance: 'desc' },
        take: 5,
      }),
      // Picking pendiente: órdenes con status CREATED
      this.prisma.picking_orders.count({
        where: { status: 'CREATED', deleted_at: null },
      }),
      // Viajes activos: PLANNED o IN_PROGRESS
      this.prisma.trips.groupBy({
        by: ['status'],
        where: {
          deleted_at: null,
          status: { in: ['PLANNED', 'IN_PROGRESS'] },
        },
        _count: { id: true },
      }),
      // Cheques a vencer: propios, pendientes, due_date en N días
      this.prisma.checks.findMany({
        where: {
          is_own: true,
          status: 'PENDING',
          due_date: { gte: today, lte: checksAhead },
          deleted_at: null,
        },
        select: {
          id: true,
          check_number: true,
          bank_name: true,
          amount: true,
          currency_code: true,
          due_date: true,
        },
        orderBy: { due_date: 'asc' },
        take: 10,
      }),
      // Pagos/cobros pendientes: status CONFIRMED (confirmados, no pagados aún)
      this.prisma.payments.groupBy({
        by: ['type'],
        where: { status: 'CONFIRMED', deleted_at: null },
        _count: { id: true },
        _sum: { amount: true },
      }),
      // Productos totales
      this.prisma.products.count({
        where: { deleted_at: null },
      }),
      // Productos por uso: venta / compra / ambos
      this.prisma.products.groupBy({
        by: ['usage_type'],
        where: { deleted_at: null },
        _count: { id: true },
      }),
      this.prisma.document_types.findMany({
        where: { deleted_at: null },
        select: { id: true, direction: true },
      }),
    ]);

    const documentTypeDirections = new Map(
      dashboardDocumentTypes.map((type) => [type.id, Number(type.direction)]),
    );
    const splitByDirection = (groups: Array<{ document_type_id: string; _count: { id: number } }>) =>
      groups.reduce(
        (acc, group) => {
          if (documentTypeDirections.get(group.document_type_id) === -1) acc.purchases += group._count.id;
          else acc.sales += group._count.id;
          return acc;
        },
        { sales: 0, purchases: 0 },
      );
    const groupByStatus = (groups: Array<{ status: number; _count: { id: number } }>) =>
      groups.reduce<Record<number, number>>((acc, group) => {
        acc[group.status] = (acc[group.status] ?? 0) + group._count.id;
        return acc;
      }, {});

    // Por cobrar: saldos positivos de cuentas corrientes de clientes
    const receivables = {
      total: receivableAccounts._count?.id ?? 0,
      totalAmount: Number(receivableAccounts._sum?.balance ?? 0),
    };

    // Costeados vs no costeados
    const totalProductIds = warehouseStock.map((s) => s.product_id);
    const uniqueProductIds = [...new Set(totalProductIds)];
    const costedCount = costedProducts.length;

    // Productos por uso (venta / compra)
    const usageCounts: Record<string, number> = Object.fromEntries(
      productsByUsage.map((g) => [String(g.usage_type), g._count.id]),
    );
    const saleOnly = usageCounts.SALE ?? 0;
    const purchaseOnly = usageCounts.PURCHASE ?? 0;
    const bothUsage = usageCounts.BOTH ?? 0;

    // Cuentas corrientes
    const currentAccounts = currentAccountsData.map((ca) => ({
      id: ca.id,
      party_id: ca.party_id,
      party_name: ca.party?.name ?? 'Sin nombre',
      balance: Number(ca.balance),
    }));

    // Viajes activos
    const tripsData = activeTrips.reduce(
      (acc, g) => {
        if (g.status === 'PLANNED') acc.planned = g._count.id;
        if (g.status === 'IN_PROGRESS') acc.inProgress = g._count.id;
        return acc;
      },
      { planned: 0, inProgress: 0 },
    );

    // Cheques a vencer
    const checksDueCount = dueChecks.length;
    const checksDueTotal = dueChecks.reduce((sum, c) => sum + Number(c.amount), 0);

    // Pagos/cobros pendientes
    const paymentsDue = pendingPayments.reduce(
      (acc, g) => {
        if (g.type === 'PAYMENT') {
          acc.payments.count = g._count.id;
          acc.payments.total = Number(g._sum.amount ?? 0);
        }
        if (g.type === 'COLLECTION') {
          acc.collections.count = g._count.id;
          acc.collections.total = Number(g._sum.amount ?? 0);
        }
        return acc;
      },
      { payments: { count: 0, total: 0 }, collections: { count: 0, total: 0 } },
    );

    return {
      meta: {
        days: documentRange,
        documents_from: documentsFrom.toISOString().slice(0, 10),
      },
      quotes: {
        total: quotes.reduce((sum, g) => sum + g._count.id, 0),
        byDirection: splitByDirection(quotes),
        byStatus: groupByStatus(quotes),
        totalValue: Number(quotes.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      orders: {
        total: orders.reduce((sum, g) => sum + g._count.id, 0),
        byDirection: splitByDirection(orders),
        byStatus: groupByStatus(orders),
        totalValue: Number(orders.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      remitos: {
        total: remitos.reduce((sum, g) => sum + g._count.id, 0),
        byDirection: splitByDirection(remitos),
        byStatus: groupByStatus(remitos),
      },
      invoices: {
        total: invoices.reduce((sum, g) => sum + g._count.id, 0),
        byDirection: splitByDirection(invoices),
        byStatus: groupByStatus(invoices),
        totalValue: Number(invoices.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      creditNotes: {
        total: creditNotes.reduce((sum, g) => sum + g._count.id, 0),
        byDirection: splitByDirection(creditNotes),
        byStatus: groupByStatus(creditNotes),
        totalValue: Number(creditNotes.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      debitNotes: {
        total: debitNotes.reduce((sum, g) => sum + g._count.id, 0),
        byDirection: splitByDirection(debitNotes),
        byStatus: groupByStatus(debitNotes),
        totalValue: Number(debitNotes.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      hr: {
        totalVales: hrVales.reduce((sum, g) => sum + g._count.id, 0),
        byStatus: Object.fromEntries(hrVales.map(g => [g.status, g._count.id])),
        totalDebit: Number(hrVales.filter(g => ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(g.status as string)).reduce((sum, g) => sum + Number(g._sum.amount ?? 0), 0)),
        totalCredit: Number(hrVales.filter(g => ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION', 'APORTE'].includes(g.status as string)).reduce((sum, g) => sum + Number(g._sum.amount ?? 0), 0)),
        accounts: hrAccounts,
      },
      stock: {
        totalProducts: uniqueProductIds.length,
        totalQuantity: warehouseStock.reduce((sum, s) => sum + Number(s.quantity), 0),
        totalReserved: warehouseStock.reduce((sum, s) => sum + Number(s.reserved_quantity), 0),
        lowStockCount: warehouseStock.filter(s => Number(s.quantity) < 5).length,
      },
      receivables,
      costing: {
        totalProducts: uniqueProductIds.length,
        costed: costedCount,
        uncosted: uniqueProductIds.length - costedCount,
      },
      products: {
        total: totalProductsCount,
        withStock: uniqueProductIds.length,
        withStockUnits: Number(warehouseStock.reduce((sum, s) => sum + Number(s.quantity), 0)),
        costed: costedCount,
        uncosted: Math.max(uniqueProductIds.length - costedCount, 0),
        forSale: saleOnly + bothUsage,
        forPurchase: purchaseOnly + bothUsage,
      },
      currentAccounts,
      picking: {
        pending: pendingPickingCount,
      },
      trips: tripsData,
      checksDue: {
        count: checksDueCount,
        totalAmount: checksDueTotal,
        items: dueChecks.map((c) => ({
          id: c.id,
          check_number: c.check_number,
          bank_name: c.bank_name,
          amount: Number(c.amount),
          currency_code: c.currency_code,
          due_date: c.due_date.toISOString(),
        })),
      },
      paymentsDue,
    };
  }

  async getPersonalData(userId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [recentActivity, pendingDocuments, monthlyPayments, monthlyAmountResult] = await Promise.all([
      this.prisma.audit_logs.findMany({
        where: { changed_by: userId },
        orderBy: { changed_at: 'desc' },
        take: 5,
        select: {
          table_name: true,
          action: true,
          changed_at: true,
          new_data: true,
        },
      }),
      this.prisma.documents.count({
        where: {
          created_by: userId,
          deleted_at: null,
          status: { in: [0, 1] },
        },
      }),
      this.prisma.payments.count({
        where: {
          created_by: userId,
          deleted_at: null,
          date: { gte: startOfMonth },
        },
      }),
      this.prisma.payments.aggregate({
        where: {
          created_by: userId,
          deleted_at: null,
          date: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
    ]);

    const tableLabels: Record<string, string> = {
      documents: 'Documento',
      payments: 'Pago',
      current_account_entries: 'Movimiento CC',
      checks: 'Cheque',
      cash_box_movements: 'Movimiento caja',
    };

    const actionLabels: Record<string, string> = {
      CREATE: 'Creó',
      UPDATE: 'Actualizó',
      DELETE: 'Eliminó',
    };

    return {
      recentActivity: recentActivity.map((log) => ({
        table: tableLabels[log.table_name] || log.table_name,
        action: actionLabels[log.action] || log.action,
        date: log.changed_at.toISOString(),
        detail: log.new_data ? (log.new_data as any).number || (log.new_data as any).description || '' : '',
      })),
      pendingDocuments,
      monthlyPayments,
      monthlyAmount: Number(monthlyAmountResult._sum.amount ?? 0),
    };
  }
}
