import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SaveDashboardConfigDto } from './dto/save-dashboard-config.dto';
@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

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

  async getStockReplenishmentNotifications() {
    const policies = await this.prisma.stock_replenishment_policies.findMany({
      where: {
        deleted_at: null,
        active: true,
        reorder_point: { gt: 0 },
        product: { is: { deleted_at: null, active: true, manages_stock: true } },
        warehouse: { is: { deleted_at: null, active: true, is_virtual: false } },
      },
      select: {
        product_id: true,
        warehouse_id: true,
        reorder_point: true,
        product: {
          select: {
            name: true,
            sku: true,
            warehouse_stock: {
              where: { deleted_at: null },
              select: { warehouse_id: true, quantity: true, reserved_quantity: true },
            },
          },
        },
        warehouse: { select: { name: true } },
      },
      orderBy: [{ product_id: 'asc' }, { warehouse_id: 'asc' }],
      take: 500,
    });

    return policies.flatMap((policy) => {
      const stock = policy.product.warehouse_stock.find((row) => row.warehouse_id === policy.warehouse_id);
      const available = Math.max(Number(stock?.quantity ?? 0) - Number(stock?.reserved_quantity ?? 0), 0);
      const reorderPoint = Number(policy.reorder_point);
      if (available > reorderPoint) return [];
      return [{
        id: `${policy.product_id}:${policy.warehouse_id}`,
        product_id: policy.product_id,
        product_name: policy.product.name,
        product_sku: policy.product.sku,
        warehouse_name: policy.warehouse.name,
        available,
        reorder_point: reorderPoint,
        critical: available <= 0,
      }];
    }).slice(0, 50);
  }

  async getOldAccountBalanceNotifications() {
    const today = new Date(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date()) + 'T00:00:00.000Z');
    const cutoff = new Date(today);
    cutoff.setUTCDate(cutoff.getUTCDate() - 30);
    const [rows, baseCurrency] = await Promise.all([
      this.prisma.current_accounts.findMany({
        where: {
          deleted_at: null,
          active: true,
          last_entry_date: { lte: cutoff },
          OR: [
            { party_type: 'CUSTOMER', balance: { gt: 0 } },
            { party_type: 'SUPPLIER', balance: { gt: 0 } },
          ],
        },
        select: {
          id: true,
          party_id: true,
          party_type: true,
          balance: true,
          last_entry_date: true,
          party: { select: { name: true } },
        },
        orderBy: [{ last_entry_date: 'asc' }, { id: 'asc' }],
        take: 100,
      }),
      this.prisma.currencies.findFirst({ where: { is_base: true, active: true }, select: { code: true } }),
    ]);

    return rows.map((account) => {
      const lastMovement = account.last_entry_date ? new Date(account.last_entry_date) : cutoff;
      const daysWithoutMovement = Math.max(30, Math.floor((today.getTime() - lastMovement.getTime()) / 86_400_000));
      return {
        id: account.id,
        party_id: account.party_id,
        party_name: account.party?.name ?? 'Parte interesada',
        party_type: account.party_type,
        balance: Number(account.balance),
        currency_code: baseCurrency?.code ?? null,
        days_without_movement: daysWithoutMovement,
        severity: daysWithoutMovement >= 90 ? 'HIGH' : daysWithoutMovement >= 60 ? 'MEDIUM' : 'LOW',
      };
    });
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
    checksAhead.setUTCDate(checksAhead.getUTCDate() + (checksDays ?? 30));

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
      replenishmentPolicies,
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
      this.prisma.stock_replenishment_policies.findMany({
        where: {
          deleted_at: null,
          active: true,
          product: { is: { deleted_at: null, active: true, manages_stock: true } },
          warehouse: { is: { deleted_at: null, active: true, is_virtual: false } },
        },
        select: {
          product_id: true,
          warehouse_id: true,
          reorder_point: true,
          target_stock: true,
          lead_time_days: true,
          product: {
            select: {
              warehouse_stock: {
                where: { deleted_at: null },
                select: {
                  warehouse_id: true,
                  quantity: true,
                  reserved_quantity: true,
                  warehouses: { select: { is_virtual: true, active: true, deleted_at: true } },
                },
              },
            },
          },
        },
      }).catch((error) => {
        this.logger.warn(`No se pudo cargar el resumen de reposición: ${error?.message ?? error}`);
        return null;
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
      // Cheques propios pendientes de débito con vencimiento dentro del período.
      this.prisma.checks.findMany({
        where: {
          is_own: true,
          status: { in: ['PENDING', 'CONFIRMED'] },
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

    // El resumen de reposición usa las mismas reglas que /stock/reposicion y
    // solo considera políticas activas asociadas a depósitos físicos.
    const activeReplenishmentPolicies = replenishmentPolicies ?? [];
    let stockReplenishmentAvailable = replenishmentPolicies !== null;
    const replenishmentPolicyCount = new Map<string, number>();
    for (const policy of activeReplenishmentPolicies) {
      replenishmentPolicyCount.set(policy.product_id, (replenishmentPolicyCount.get(policy.product_id) ?? 0) + 1);
    }
    const transitWarehouseIds = [...new Set(activeReplenishmentPolicies.flatMap(policy =>
      policy.product.warehouse_stock.filter(row => row.warehouses.is_virtual).map(row => row.warehouse_id),
    ))];
    const transitContainers = transitWarehouseIds.length ? await this.prisma.international_containers.findMany({
      where: { transit_warehouse_id: { in: transitWarehouseIds }, deleted_at: null },
      select: {
        transit_warehouse_id: true,
        estimated_arrival_date: true,
        actual_arrival_date: true,
        operation: { select: { estimated_arrival_date: true, actual_arrival_date: true } },
      },
    }).catch((error) => {
      stockReplenishmentAvailable = false;
      this.logger.warn(`No se pudieron considerar los arribos del resumen de reposición: ${error?.message ?? error}`);
      return null;
    }) : [];
    const transitByWarehouse = new Map<string, any>((transitContainers ?? [])
      .filter(container => container.transit_warehouse_id)
      .map(container => [container.transit_warehouse_id!, container] as [string, any]));
    const replenishmentRows = activeReplenishmentPolicies.map(policy => {
      const number = (value: unknown) => Number(value ?? 0);
      const physical = policy.product.warehouse_stock.find(row => row.warehouse_id === policy.warehouse_id);
      const availableNow = Math.max(number(physical?.quantity) - number(physical?.reserved_quantity), 0);
      const horizon = new Date();
      horizon.setDate(horizon.getDate() + policy.lead_time_days);
      const transitRows = policy.product.warehouse_stock.filter(row =>
        row.warehouses.is_virtual && row.warehouses.active && !row.warehouses.deleted_at,
      );
      const arrivingWithinLeadTime = transitRows.reduce((sum, row) => {
        const container = transitByWarehouse.get(row.warehouse_id);
        const arrival = container?.actual_arrival_date ?? container?.estimated_arrival_date
          ?? container?.operation?.actual_arrival_date ?? container?.operation?.estimated_arrival_date;
        return arrival && new Date(arrival) <= horizon
          ? sum + Math.max(number(row.quantity) - number(row.reserved_quantity), 0)
          : sum;
      }, 0);
      const assignedTransit = replenishmentPolicyCount.get(policy.product_id) === 1 ? arrivingWithinLeadTime : 0;
      const projected = availableNow + assignedTransit;
      const reorderPoint = number(policy.reorder_point);
      const status = availableNow <= 0 ? 'CRITICAL'
        : projected <= reorderPoint ? 'REORDER'
          : availableNow <= reorderPoint && projected > reorderPoint ? 'COVERED'
            : 'OK';
      return {
        productId: policy.product_id,
        status,
        suggested: Math.max(number(policy.target_stock) - projected, 0),
      };
    });
    const actionRows = replenishmentRows.filter(row => row.status === 'CRITICAL' || row.status === 'REORDER');
    const stockReplenishment = {
      available: stockReplenishmentAvailable,
      configuredLocations: activeReplenishmentPolicies.length,
      actionProducts: new Set(actionRows.map(row => row.productId)).size,
      criticalCount: replenishmentRows.filter(row => row.status === 'CRITICAL').length,
      reorderCount: replenishmentRows.filter(row => row.status === 'REORDER').length,
      coveredCount: replenishmentRows.filter(row => row.status === 'COVERED').length,
      suggestedQuantity: actionRows.reduce((sum, row) => sum + row.suggested, 0),
    };

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
        replenishment: stockReplenishment,
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

    const [recentActivity, pendingDocuments, pendingIntakes, monthlyPayments, monthlyAmountResult] = await Promise.all([
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
      this.prisma.documents.findMany({
        where: {
          deleted_at: null,
          AND: [
            { OR: [
              { status: 0 },
              { document_types: { category: 'INVOICE' }, status: 1 },
              { document_types: { category: 'CREDIT_NOTE' }, status: 1 },
              { document_types: { category: 'DEBIT_NOTE' }, status: 1 },
              { document_types: { category: 'REMITO' }, status: 1 },
              { document_types: { category: 'ORDER' }, status: { in: [1, 2, 3, 4] } },
            ] },
            { OR: [
              { assigned_to: userId },
              { assigned_to: null, created_by: userId },
            ] },
          ],
        },
        orderBy: [{ date: 'asc' }, { created_at: 'asc' }],
        select: {
          id: true,
          number: true,
          date: true,
          status: true,
          descrip: true,
          created_at: true,
          document_types: { select: { description: true, category: true, direction: true } },
          business_parties: { select: { name: true } },
        },
      }),
      this.prisma.intake_records.findMany({
        where: {
          deleted_at: null,
          completed_at: null,
          OR: [
            { assigned_to: userId, status: { in: ['SENT', 'IN_PROGRESS'] } },
            { assigned_to: null, created_by: userId, status: 'DRAFT' },
          ],
        },
        orderBy: { created_at: 'asc' },
        select: { id: true, title: true, notes: true, suggested_type: true, status: true, created_at: true },
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

    const pendingItems = [
      ...pendingDocuments.map((document) => {
        const category = document.document_types.category;
        const isPurchase = document.document_types.direction < 0;
        const statusLabels: Record<string, Record<number, string>> = {
          QUOTE: { 0: 'Borrador', 1: 'Enviado' },
          ORDER: { 0: 'Borrador', 1: 'Aprobada', 2: 'En preparación', 3: 'Lista para despacho', 4: 'Entrega parcial' },
          REMITO: { 0: 'Borrador', 1: 'En tránsito' },
          INVOICE: { 0: 'Borrador', 1: 'Pendiente de confirmación' },
          CREDIT_NOTE: { 0: 'Borrador', 1: 'Pendiente de confirmación' },
          DEBIT_NOTE: { 0: 'Borrador', 1: 'Pendiente de confirmación' },
        };
        const to = isPurchase
          ? category === 'ORDER'
            ? `/erp/purchases/orders/${document.id}`
            : category === 'REMITO'
              ? `/erp/purchases/remitos/${document.id}`
              : `/erp/purchases/purchases-documents/${document.id}`
          : `/erp/sales/${document.id}`;
        return {
          id: document.id,
          kind: 'DOCUMENT' as const,
          title: `${document.document_types.description} · N.º ${document.number}`,
          detail: [document.business_parties?.name, document.descrip].filter(Boolean).join(' · '),
          status: statusLabels[category ?? '']?.[document.status] ?? (document.status === 0 ? 'Borrador' : 'Pendiente'),
          date: document.date.toISOString(),
          to,
        };
      }),
      ...pendingIntakes.map((record) => ({
        id: record.id,
        kind: 'CAPTURE' as const,
        title: record.title || 'Comprobante por completar',
        detail: record.notes || 'Captura de comprobante',
        status: record.status === 'DRAFT' ? 'Borrador' : record.status === 'IN_PROGRESS' ? 'En proceso' : 'Recibido',
        date: record.created_at.toISOString(),
        to: `/erp/treasury/intake?record=${record.id}`,
      })),
    ].sort((a, b) => a.date.localeCompare(b.date));

    return {
      recentActivity: recentActivity.map((log) => ({
        table: tableLabels[log.table_name] || log.table_name,
        action: actionLabels[log.action] || log.action,
        date: log.changed_at.toISOString(),
        detail: log.new_data ? (log.new_data as any).number || (log.new_data as any).description || '' : '',
      })),
      pendingDocuments: pendingItems.length,
      pendingItems,
      monthlyPayments,
      monthlyAmount: Number(monthlyAmountResult._sum.amount ?? 0),
    };
  }
}
