import { requestContext } from '@/common/context/request-context';
import { IntercompanyOverviewService } from './intercompany-overview.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));

describe('saldo de tesorería entre empresas', () => {
  const companyA = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const companyB = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const operationGroups = [{
    source_company_id: companyB, fund_company_id: companyA,
    operation_type: 'COLLECTION', currency_code: 'ARS', _sum: { amount: 100 },
  }];
  const transferGroups = [{
    source_company_id: companyA, dest_company_id: companyB,
    currency_code: 'ARS', _sum: { amount: 60 },
  }];
  const publicDb: any = {
    intercompany_treasury_operations: {
      groupBy: jest.fn().mockResolvedValue(operationGroups),
      findMany: jest.fn().mockResolvedValue([{ id: 'op-1', source_company_id: companyB, fund_company_id: companyA,
        source_type: 'payment', source_id: 'payment-1', operation_type: 'COLLECTION', fund_type: 'BANK_ACCOUNT',
        amount: 100, currency_code: 'ARS', description: 'Cobro de OV #123', effective_date: new Date('2026-11-13'),
        created_at: new Date('2026-11-13'), status: 'COMPLETED' }]),
    },
    companies: { findMany: jest.fn().mockResolvedValue([{ id: companyA, name: 'A' }, { id: companyB, name: 'B' }]) },
  };
  const tenant: any = {
    cash_box_transfers: {
      groupBy: jest.fn().mockResolvedValue(transferGroups),
      findMany: jest.fn().mockResolvedValue([{ id: 'transfer-1', source_company_id: companyA, dest_company_id: companyB,
        amount: 60, currency_code: 'ARS', description: 'Rendición', intercompany_purpose: 'SETTLEMENT',
        source_type: 'bank_account', dest_type: 'bank_account', created_at: new Date('2026-11-13'),
        status: 'completed', record_side: 'source' }]),
    },
  };
  const service = new IntercompanyOverviewService({ getDefaultClient: () => publicDb, getClientForCurrentContext: () => tenant } as any);

  it('muestra lo recibido, transferido y pendiente desde la empresa titular del banco', async () => {
    const result = await requestContext.run({ companyId: companyA }, () => service.overview());
    expect(result.summaries).toEqual([expect.objectContaining({
      company_id: companyB, collected_here_for_other: 100, transferred_out: 60, balance: 40,
    })]);
    expect(result.movements.map(row => row.description)).toEqual(['Cobro de OV #123', 'Rendición']);
  });

  it('muestra la misma cuenta con sentido inverso desde la empresa que cobró la OV', async () => {
    const result = await requestContext.run({ companyId: companyB }, () => service.overview());
    expect(result.summaries).toEqual([expect.objectContaining({
      company_id: companyA, collected_there_for_us: 100, transferred_in: 60, balance: -40,
    })]);
  });

  it('suma solamente transferencias completadas marcadas como rendición', async () => {
    await requestContext.run({ companyId: companyA }, () => service.overview());
    expect(tenant.cash_box_transfers.groupBy).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ status: 'completed', intercompany_purpose: 'SETTLEMENT' }),
    }));
  });
});
