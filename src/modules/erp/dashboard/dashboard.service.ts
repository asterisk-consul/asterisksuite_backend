import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SaveDashboardConfigDto } from './dto/save-dashboard-config.dto';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

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

  async getDashboardData() {
    const companyId = getCurrentCompanyId();

    const [
      quotes,
      orders,
      remitos,
      hrVales,
      hrAccounts,
      warehouseStock,
    ] = await Promise.all([
      this.prisma.documents.groupBy({
        by: ['status'],
        where: {
          deleted_at: null,
          document_types: { category: 'QUOTE' },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status'],
        where: {
          deleted_at: null,
          document_types: { category: 'ORDER' },
        },
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.documents.groupBy({
        by: ['status'],
        where: {
          deleted_at: null,
          document_types: { category: 'REMITO' },
        },
        _count: { id: true },
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
    ]);

    return {
      quotes: {
        total: quotes.reduce((sum, g) => sum + g._count.id, 0),
        byStatus: Object.fromEntries(quotes.map(g => [g.status, g._count.id])),
        totalValue: Number(quotes.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      orders: {
        total: orders.reduce((sum, g) => sum + g._count.id, 0),
        byStatus: Object.fromEntries(orders.map(g => [g.status, g._count.id])),
        totalValue: Number(orders.reduce((sum, g) => sum + Number(g._sum.total ?? 0), 0)),
      },
      remitos: {
        total: remitos.reduce((sum, g) => sum + g._count.id, 0),
        byStatus: Object.fromEntries(remitos.map(g => [g.status, g._count.id])),
      },
      hr: {
        totalVales: hrVales.reduce((sum, g) => sum + g._count.id, 0),
        byStatus: Object.fromEntries(hrVales.map(g => [g.status, g._count.id])),
        totalDebit: Number(hrVales.filter(g => ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(g.status as string)).reduce((sum, g) => sum + Number(g._sum.amount ?? 0), 0)),
        totalCredit: Number(hrVales.filter(g => ['SUELDO', 'ADELANTO', 'EXTRAS', 'APORTE'].includes(g.status as string)).reduce((sum, g) => sum + Number(g._sum.amount ?? 0), 0)),
        accounts: hrAccounts,
      },
      stock: {
        totalProducts: warehouseStock.length,
        totalQuantity: warehouseStock.reduce((sum, s) => sum + Number(s.quantity), 0),
        totalReserved: warehouseStock.reduce((sum, s) => sum + Number(s.reserved_quantity), 0),
        lowStockCount: warehouseStock.filter(s => Number(s.quantity) < 5).length,
      },
    };
  }
}
