import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { requestContext } from '@/common/context/request-context';

type Summary = {
  company_id: string;
  company_name: string;
  currency_code: string;
  balance: number;
  collected_here_for_other: number;
  collected_there_for_us: number;
  paid_here_for_other: number;
  paid_there_for_us: number;
  transferred_out: number;
  transferred_in: number;
};

@Injectable()
export class IntercompanyOverviewService {
  constructor(private readonly db: PrismaService) {}

  private get companyId() {
    const id = requestContext.getStore()?.companyId;
    if (!id) throw new BadRequestException('No se pudo resolver la empresa actual');
    return id;
  }

  async availability() {
    const companyId = this.companyId;
    const publicDb = this.db.getDefaultClient();
    const tenant = this.db.getClientForCurrentContext();
    const [share, operation, transfer] = await Promise.all([
      publicDb.intercompany_treasury_shares.findFirst({
        where: { active: true, OR: [{ owner_company_id: companyId }, { consumer_company_id: companyId }] },
        select: { id: true },
      }),
      publicDb.intercompany_treasury_operations.findFirst({
        where: { OR: [{ source_company_id: companyId }, { fund_company_id: companyId }] },
        select: { id: true },
      }),
      tenant.cash_box_transfers.findFirst({
        where: { deleted_at: null, dest_company_id: { not: null }, OR: [{ source_company_id: companyId }, { dest_company_id: companyId }] },
        select: { id: true },
      }),
    ]);
    return { enabled: Boolean(share || operation || transfer) };
  }

  async overview() {
    const companyId = this.companyId;
    const publicDb = this.db.getDefaultClient();
    const tenant = this.db.getClientForCurrentContext();
    const operationWhere = {
      OR: [{ source_company_id: companyId }, { fund_company_id: companyId }],
    };
    const transferWhere = {
      deleted_at: null,
      dest_company_id: { not: null },
      OR: [{ source_company_id: companyId }, { dest_company_id: companyId }],
    };
    // Las sumas se calculan en PostgreSQL. Solo se cargan los últimos movimientos
    // para el historial, sin traer todas las operaciones de todos los tenants.
    const [operationGroups, transferGroups, recentOperations, recentTransfers] = await Promise.all([
      publicDb.intercompany_treasury_operations.groupBy({
        by: ['source_company_id', 'fund_company_id', 'operation_type', 'currency_code'],
        where: { ...operationWhere, status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      tenant.cash_box_transfers.groupBy({
        by: ['source_company_id', 'dest_company_id', 'currency_code'],
        where: { ...transferWhere, record_side: { in: ['source', 'destination'] }, status: 'completed', intercompany_purpose: 'SETTLEMENT' },
        _sum: { amount: true },
      }),
      publicDb.intercompany_treasury_operations.findMany({
        where: { ...operationWhere, status: { in: ['COMPLETED', 'REVERSED'] } },
        orderBy: { created_at: 'desc' }, take: 100,
        select: { id: true, source_company_id: true, fund_company_id: true, source_type: true, source_id: true, operation_type: true, fund_type: true, amount: true, currency_code: true, description: true, effective_date: true, created_at: true, status: true },
      }),
      tenant.cash_box_transfers.findMany({
        where: { ...transferWhere, status: { in: ['completed', 'reversed', 'cancelled'] } },
        orderBy: { created_at: 'desc' }, take: 100,
        select: { id: true, source_company_id: true, dest_company_id: true, amount: true, currency_code: true, converted_amount: true, description: true, reference: true, intercompany_purpose: true, source_type: true, dest_type: true, created_at: true, status: true, record_side: true },
      }),
    ]);
    const companyIds = new Set<string>();
    for (const row of operationGroups) companyIds.add(row.source_company_id === companyId ? row.fund_company_id : row.source_company_id);
    for (const row of transferGroups) {
      const other = row.source_company_id === companyId ? row.dest_company_id : row.source_company_id;
      if (other) companyIds.add(other);
    }
    for (const row of recentOperations) companyIds.add(row.source_company_id === companyId ? row.fund_company_id : row.source_company_id);
    for (const row of recentTransfers) {
      const other = row.source_company_id === companyId ? row.dest_company_id : row.source_company_id;
      if (other) companyIds.add(other);
    }
    const companies = companyIds.size ? await publicDb.companies.findMany({
      where: { id: { in: [...companyIds] } }, select: { id: true, name: true },
    }) : [];
    const names = new Map<string, string>(companies.map(company => [company.id, String(company.name)]));
    const summaries = new Map<string, Summary>();
    const getSummary = (otherId: string, currencyCode: string) => {
      const key = `${otherId}:${currencyCode}`;
      let summary = summaries.get(key);
      if (!summary) {
        summary = {
          company_id: otherId, company_name: names.get(otherId) ?? 'Otra empresa', currency_code: currencyCode,
          balance: 0, collected_here_for_other: 0, collected_there_for_us: 0,
          paid_here_for_other: 0, paid_there_for_us: 0, transferred_out: 0, transferred_in: 0,
        };
        summaries.set(key, summary);
      }
      return summary;
    };
    for (const row of operationGroups) {
      const fundHere = row.fund_company_id === companyId;
      const otherId = fundHere ? row.source_company_id : row.fund_company_id;
      const amount = Number(row._sum.amount ?? 0);
      const summary = getSummary(otherId, row.currency_code);
      const collection = row.operation_type === 'COLLECTION';
      summary.balance += collection ? (fundHere ? amount : -amount) : (fundHere ? -amount : amount);
      if (collection && fundHere) summary.collected_here_for_other += amount;
      if (collection && !fundHere) summary.collected_there_for_us += amount;
      if (!collection && fundHere) summary.paid_here_for_other += amount;
      if (!collection && !fundHere) summary.paid_there_for_us += amount;
    }
    for (const row of transferGroups) {
      const sourceHere = row.source_company_id === companyId;
      const otherId = sourceHere ? row.dest_company_id : row.source_company_id;
      if (!otherId) continue;
      const amount = Number(row._sum.amount ?? 0);
      const summary = getSummary(otherId, row.currency_code);
      summary.balance += sourceHere ? -amount : amount;
      if (sourceHere) summary.transferred_out += amount;
      else summary.transferred_in += amount;
    }
    const movements = [
      ...recentOperations.map(row => {
        const fundHere = row.fund_company_id === companyId;
        const collection = row.operation_type === 'COLLECTION';
        return {
          id: `operation:${row.id}`, kind: 'FONDO_COMPARTIDO', source_type: row.source_type,
          source_id: row.source_id, company_id: fundHere ? row.source_company_id : row.fund_company_id,
          company_name: names.get(fundHere ? row.source_company_id : row.fund_company_id) ?? 'Otra empresa',
          fund_type: row.fund_type, currency_code: row.currency_code, amount: Number(row.amount),
          balance_effect: row.status === 'COMPLETED' ? (collection ? (fundHere ? 1 : -1) : (fundHere ? -1 : 1)) * Number(row.amount) : 0,
          description: row.description ?? `${collection ? 'Cobro' : 'Pago'} registrado por otra empresa`,
          date: row.effective_date ?? row.created_at, status: row.status,
          purpose: null,
        };
      }),
      ...recentTransfers.map(row => {
        const sourceHere = row.source_company_id === companyId;
        const otherId = sourceHere ? row.dest_company_id : row.source_company_id;
        return {
          id: `transfer:${row.id}`, kind: 'TRANSFERENCIA', source_type: 'transfer', source_id: row.id,
          company_id: otherId, company_name: names.get(otherId ?? '') ?? 'Otra empresa',
          fund_type: `${row.source_type}->${row.dest_type}`, currency_code: row.currency_code,
          amount: Number(row.amount), converted_amount: row.converted_amount ? Number(row.converted_amount) : null,
          balance_effect: row.status === 'completed' && row.intercompany_purpose === 'SETTLEMENT' ? (sourceHere ? -1 : 1) * Number(row.amount) : 0,
          description: row.description ?? 'Transferencia entre empresas', date: row.created_at,
          status: row.status, purpose: row.intercompany_purpose,
          can_classify: sourceHere && row.record_side === 'source' && row.status === 'completed',
        };
      }),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 100);
    return { summaries: [...summaries.values()].sort((a, b) => a.company_name.localeCompare(b.company_name) || a.currency_code.localeCompare(b.currency_code)), movements };
  }
}
