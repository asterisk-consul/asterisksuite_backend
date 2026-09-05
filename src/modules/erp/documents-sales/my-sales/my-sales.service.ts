import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';

@Injectable()
export class MySalesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private get userId(): string | undefined {
    return requestContext.getStore()?.userId;
  }

  private async getEmployeeId(): Promise<string | null> {
    const userId = this.userId;
    if (!userId) return null;
    const employee = await this.prisma.employees.findFirst({
      where: { user_id: userId, deleted_at: null },
      select: { id: true },
    });
    return employee?.id ?? null;
  }

  private getDateRange(period?: string) {
    if (!period) {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59),
      };
    }
    const [year, month] = period.split('-').map(Number);
    return {
      start: new Date(year, month - 1, 1),
      end: new Date(year, month, 0, 23, 59, 59),
    };
  }

  async getSummary(period?: string) {
    const employeeId = await this.getEmployeeId();
    if (!employeeId) return { error: 'Empleado no encontrado' };

    const { start, end } = this.getDateRange(period);

    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: employeeId,
        document: { date: { gte: start, lte: end }, status: { in: [1, 2] }, deleted_at: null },
      },
      include: {
        seller: {
          select: { commission_base: true },
        },
        document: {
          select: {
            id: true, number: true, date: true, total: true, subtotal: true,
            currency_code: true, party_id: true, status: true,
            child_documents: {
              where: { deleted_at: null, document_types: { category: 'INVOICE' }, status: { in: [1, 2] } },
              select: { id: true, total: true, paid_amount: true },
            },
          },
        },
      },
      orderBy: { document: { date: 'desc' } },
    });

    let totalVentas = 0, totalFacturado = 0, totalCobrado = 0, totalPendienteFacturar = 0;
    const clientesSet = new Set<string>();

    for (const ov of ordenes) {
      const doc = ov.document;
      totalVentas += Number(doc.total);
      clientesSet.add(doc.party_id);
      if (doc.child_documents.length > 0) {
        for (const f of doc.child_documents) {
          totalFacturado += Number(f.total);
          totalCobrado += Number(f.paid_amount);
        }
      } else {
        totalPendienteFacturar += Number(doc.total);
      }
    }

    const pendienteCobro = totalFacturado - totalCobrado;
    const totalComision = ordenes.reduce((sum, ov) => {
      const rate = ov.commission_rate ? Number(ov.commission_rate) : 0;
      const base = ov.commission_base ?? ov.seller?.commission_base ?? 'INVOICED';
      let baseAmount = Number(ov.document.subtotal);
      if (base === 'PAID') {
        baseAmount = ov.document.child_documents.reduce((s, f) => s + Number(f.paid_amount ?? 0), 0);
      }
      return sum + (baseAmount * rate / 100);
    }, 0);
    const comisionPendiente = ordenes.filter((ov) => !ov.commission_settled_at).reduce((sum, ov) => {
      const rate = ov.commission_rate ? Number(ov.commission_rate) : 0;
      const base = ov.commission_base ?? ov.seller?.commission_base ?? 'INVOICED';
      let baseAmount = Number(ov.document.subtotal);
      if (base === 'PAID') {
        baseAmount = ov.document.child_documents.reduce((s, f) => s + Number(f.paid_amount ?? 0), 0);
      }
      return sum + (baseAmount * rate / 100);
    }, 0);

    return {
      seller_id: employeeId,
      period: period || new Date().toISOString().slice(0, 7),
      total_ventas: totalVentas,
      total_facturado: totalFacturado,
      total_cobrado: totalCobrado,
      pendiente_cobro: pendienteCobro,
      pendiente_facturar: totalPendienteFacturar,
      cantidad_ov: ordenes.length,
      clientes_vendidos: clientesSet.size,
      comision_generada: totalComision,
      comision_pendiente: comisionPendiente,
    };
  }

  async getOrders(period?: string, page = 1, pageSize = 20) {
    const employeeId = await this.getEmployeeId();
    if (!employeeId) return [];
    const { start, end } = this.getDateRange(period);

    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: employeeId,
        document: { date: { gte: start, lte: end }, deleted_at: null },
      },
      include: {
        document: {
          select: {
            id: true, number: true, date: true, total: true, subtotal: true,
            currency_code: true, status: true,
            business_parties: { select: { id: true, name: true } },
            child_documents: {
              where: { deleted_at: null, document_types: { category: 'INVOICE' }, status: { in: [1, 2] } },
              select: { id: true, total: true, paid_amount: true },
            },
          },
        },
      },
      orderBy: { document: { date: 'desc' } },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return ordenes.map((ov) => {
      const doc = ov.document;
      const facturado = doc.child_documents.reduce((s, f) => s + Number(f.total), 0);
      const cobrado = doc.child_documents.reduce((s, f) => s + Number(f.paid_amount), 0);
      const pendiente = facturado - cobrado;
      let status = 'Sin facturar';
      if (doc.child_documents.length > 0) {
        status = pendiente <= 0 ? 'Cobrada' : cobrado > 0 ? 'Parcial' : 'Pendiente';
      }
      return {
        id: doc.id, number: doc.number, date: doc.date,
        client_name: doc.business_parties?.name || 'Sin cliente',
        total: Number(doc.total), facturado, cobrado, pendiente,
        status, currency_code: doc.currency_code,
        commission_rate: ov.commission_rate ? Number(ov.commission_rate) : null,
      };
    });
  }

  async getPending() {
    const employeeId = await this.getEmployeeId();
    if (!employeeId) return [];

    const facturas = await this.prisma.documents.findMany({
      where: {
        parent_document: { orden_venta_doc: { seller_id: employeeId } },
        document_types: { category: 'INVOICE' },
        status: { in: [1, 2] },
        deleted_at: null,
      },
      include: { business_parties: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' },
    });

    const clientMap = new Map<string, any>();
    for (const f of facturas) {
      const cid = f.party_id;
      if (!clientMap.has(cid)) {
        clientMap.set(cid, {
          client_id: cid, client_name: f.business_parties?.name || 'Sin cliente',
          facturas: 0, total_facturado: 0, cobrado: 0, pendiente: 0,
        });
      }
      const e = clientMap.get(cid);
      e.facturas++;
      e.total_facturado += Number(f.total);
      e.cobrado += Number(f.paid_amount);
      e.pendiente += Number(f.total) - Number(f.paid_amount);
    }

    return Array.from(clientMap.values()).sort((a: any, b: any) => b.pendiente - a.pendiente);
  }

  async getByClient(period?: string) {
    const employeeId = await this.getEmployeeId();
    if (!employeeId) return [];
    const { start, end } = this.getDateRange(period);

    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: employeeId,
        document: { date: { gte: start, lte: end }, deleted_at: null },
      },
      include: {
        document: {
          select: {
            id: true, total: true, party_id: true,
            business_parties: { select: { id: true, name: true } },
            child_documents: {
              where: { deleted_at: null, document_types: { category: 'INVOICE' }, status: { in: [1, 2] } },
              select: { total: true, paid_amount: true },
            },
          },
        },
      },
    });

    const clientMap = new Map<string, any>();
    for (const ov of ordenes) {
      const doc = ov.document;
      const cid = doc.party_id;
      if (!clientMap.has(cid)) {
        clientMap.set(cid, {
          client_id: cid, client_name: doc.business_parties?.name || 'Sin cliente',
          ordenes: 0, facturado: 0, cobrado: 0, pendiente: 0,
        });
      }
      const e = clientMap.get(cid);
      e.ordenes++;
      for (const f of doc.child_documents) {
        e.facturado += Number(f.total);
        e.cobrado += Number(f.paid_amount);
      }
    }

    for (const e of clientMap.values()) {
      e.pendiente = e.facturado - e.cobrado;
    }

    return Array.from(clientMap.values()).sort((a: any, b: any) => b.pendiente - a.pendiente);
  }

  async getAnalysis() {
    const employeeId = await this.getEmployeeId();
    if (!employeeId) return { current: null, previous: null };

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const previousMonth = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

    const [current, previous] = await Promise.all([
      this.getMonthSummary(employeeId, currentMonth),
      this.getMonthSummary(employeeId, previousMonth),
    ]);

    return { current, previous };
  }

  private async getMonthSummary(employeeId: string, period: string) {
    const { start, end } = this.getDateRange(period);

    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: employeeId,
        document: { date: { gte: start, lte: end }, deleted_at: null },
      },
      include: {
        document: {
          select: {
            total: true, subtotal: true,
            child_documents: {
              where: { deleted_at: null, document_types: { category: 'INVOICE' }, status: { in: [1, 2] } },
              select: { total: true, paid_amount: true },
            },
          },
        },
      },
    });

    let ventas = 0, facturado = 0, cobrado = 0;
    for (const ov of ordenes) {
      ventas += Number(ov.document.total);
      for (const f of ov.document.child_documents) {
        facturado += Number(f.total);
        cobrado += Number(f.paid_amount);
      }
    }

    return {
      period,
      ventas,
      facturado,
      cobrado,
      pendiente: facturado - cobrado,
      cantidad_ov: ordenes.length,
    };
  }
}
