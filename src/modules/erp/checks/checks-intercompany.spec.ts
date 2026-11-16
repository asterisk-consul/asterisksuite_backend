import { requestContext } from '@/common/context/request-context';
import { ChecksService } from './checks.service';
import { IntercompanyTreasuryService } from '../intercompany-treasury/intercompany-treasury.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));

describe('cheques en cuentas bancarias compartidas', () => {
  const ownerCompanyId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
  const sourceCompanyId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';
  const bankAccountId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccc';
  const checkId = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';

  const makeService = (isOwn: boolean) => {
    const check: any = {
      id: checkId, check_number: '123', is_own: isOwn,
      status: isOwn ? 'CONFIRMED' : 'PENDING', amount: 250, available_amount: 250,
      currency_code: 'ARS', due_date: '2026-01-01',
      bank_account_id: null,
      bank_account_company_id: isOwn ? ownerCompanyId : null,
      bank_account_external_id: isOwn ? bankAccountId : null,
    };
    const tx: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      checks: {
        findFirst: jest.fn().mockImplementation(async () => check),
        update: jest.fn().mockImplementation(async ({ data }: any) => Object.assign(check, data)),
      },
    };
    const local: any = {
      $transaction: jest.fn((callback: (client: any) => Promise<any>) => callback(tx)),
    };
    const owner: any = {
      bank_accounts: { findFirst: jest.fn().mockResolvedValue({ active: true, currency_code: 'ARS' }) },
    };
    const intercompany: any = {
      validateUse: jest.fn().mockResolvedValue({ owner_company: { schema_name: 'owner_db' } }),
      applyUsage: jest.fn().mockResolvedValue({ id: 'operation-1' }),
      reverseUsage: jest.fn().mockResolvedValue([]),
    };
    const db: any = {
      getClientForCurrentContext: () => local,
      getTenantClient: () => owner,
    };
    const service = new ChecksService(db, {} as any, intercompany);
    jest.spyOn(service, 'findOne').mockImplementation(async () => check);
    return { service, check, tx, owner, intercompany };
  };

  it('deposita un cheque de terceros en la empresa titular una sola vez', async () => {
    const { service, check, tx, intercompany } = makeService(false);
    await requestContext.run({ companyId: sourceCompanyId }, () => service.deposit(checkId, {
      bank_account_company_id: ownerCompanyId, bank_account_external_id: bankAccountId, amount: 250,
    }, 'user-1'));

    expect(intercompany.validateUse).toHaveBeenCalledWith(ownerCompanyId, 'BANK_ACCOUNT', bankAccountId, 'COLLECTION');
    expect(intercompany.applyUsage).toHaveBeenCalledWith(expect.objectContaining({
      sourceType: 'check', sourceId: checkId, operationType: 'COLLECTION', amount: 250,
    }));
    expect(tx.$queryRaw).toHaveBeenCalledTimes(1);
    expect(check.status).toBe('CLEARED');
    expect(check.bank_account_id).toBeNull();
    expect(check.bank_account_external_id).toBe(bankAccountId);
    expect(intercompany.reverseUsage).not.toHaveBeenCalled();
  });

  it('debita un cheque propio en la cuenta titular y no repite el débito', async () => {
    const { service, check, tx, intercompany } = makeService(true);
    await requestContext.run({ companyId: sourceCompanyId }, () => service.debitOwnCheck(checkId, '2026-01-02', 'user-1'));
    expect(intercompany.applyUsage).toHaveBeenCalledWith(expect.objectContaining({
      ownerCompanyId, fundId: bankAccountId, sourceType: 'check', sourceId: checkId,
      operationType: 'PAYMENT', amount: 250,
    }));
    expect(check.status).toBe('CLEARED');
    await expect(requestContext.run({ companyId: sourceCompanyId }, () => service.debitOwnCheck(checkId, '2026-01-02', 'user-1'))).rejects.toThrow();
    expect(intercompany.applyUsage).toHaveBeenCalledTimes(1);
    expect(tx.checks.update).toHaveBeenCalledTimes(1);
  });

  it('compensa el movimiento titular si falla el guardado del cheque de origen', async () => {
    const { service, tx, intercompany } = makeService(false);
    tx.checks.update.mockRejectedValueOnce(new Error('source write failed'));
    await expect(requestContext.run({ companyId: sourceCompanyId }, () => service.deposit(checkId, {
      bank_account_company_id: ownerCompanyId, bank_account_external_id: bankAccountId,
    }, 'user-1'))).rejects.toThrow('source write failed');
    expect(intercompany.reverseUsage).toHaveBeenCalledWith(sourceCompanyId, 'check', checkId, 'user-1');
  });
});

describe('débito bancario interempresa de un cheque', () => {
  it('no crea el movimiento en la titular si su saldo es insuficiente', async () => {
    const operation = { id: 'operation-1', status: 'PENDING', attempt: 1 };
    const publicDb: any = {
      intercompany_treasury_operations: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(operation),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        update: jest.fn().mockResolvedValue({ ...operation, status: 'FAILED' }),
      },
      companies: { findUnique: jest.fn().mockResolvedValue({ name: 'Empresa origen' }) },
    };
    const tx: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      bank_accounts: { findFirst: jest.fn().mockResolvedValue({ balance: 100, currency_code: 'ARS' }) },
    };
    const owner: any = {
      bank_accounts: { findFirst: jest.fn().mockResolvedValue({ balance: 100, currency_code: 'ARS' }) },
      bank_account_movements: { findFirst: jest.fn().mockResolvedValue(null) },
      $transaction: jest.fn((callback: (client: any) => Promise<any>) => callback(tx)),
    };
    const bankMovements: any = { openOperation: jest.fn(), addMovement: jest.fn() };
    const db: any = { getDefaultClient: () => publicDb, getTenantClient: () => owner };
    const service = new IntercompanyTreasuryService(db, bankMovements);
    jest.spyOn(service, 'validateUse').mockResolvedValue({ owner_company: { schema_name: 'owner_db' } } as any);

    await expect(requestContext.run({ companyId: 'source-company' }, () => service.applyUsage({
      ownerCompanyId: 'owner-company', fundType: 'BANK_ACCOUNT', fundId: 'bank-account',
      sourceType: 'check', sourceId: 'check-1', operationType: 'PAYMENT',
      amount: 250, currencyCode: 'ARS', date: new Date('2026-01-02'),
      description: 'Débito cheque propio', userId: 'user-1',
    }))).rejects.toThrow('Saldo insuficiente');
    expect(bankMovements.openOperation).not.toHaveBeenCalled();
    expect(bankMovements.addMovement).not.toHaveBeenCalled();
    expect(publicDb.intercompany_treasury_operations.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ status: 'FAILED' }),
    }));
  });
});
