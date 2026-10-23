import { BankAccountsService } from './bank-accounts.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));
jest.mock('./bank-account-ledger', () => ({ recalculateBankAccountLedger: jest.fn().mockResolvedValue(undefined) }));

describe('bank account internal transfers', () => {
  const source = { id: 'wallet-1', name: 'Mercado Pago', currency_code: 'ARS', balance: 500, active: true };
  const destination = { id: 'bank-1', name: 'Banco', currency_code: 'ARS', balance: 20, active: true };
  const transfer = { id: 'transfer-1', source_bank_account_id: source.id, destination_bank_account_id: destination.id, amount: 100 };

  const makeService = () => {
    const tx: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      bank_accounts: { findMany: jest.fn().mockResolvedValue([source, destination]) },
      bank_account_transfers: {
        create: jest.fn().mockResolvedValue(transfer),
        findUnique: jest.fn().mockResolvedValue(transfer),
      },
    };
    const prisma: any = {
      bank_accounts: { findMany: jest.fn().mockResolvedValue([source, destination]) },
      $transaction: jest.fn((callback: (client: any) => Promise<any>) => callback(tx)),
    };
    const bankMovements: any = {
      openOperation: jest.fn().mockResolvedValueOnce({ id: 'operation-source' }).mockResolvedValueOnce({ id: 'operation-destination' }),
      addMovement: jest.fn().mockResolvedValue({}),
      closeOperation: jest.fn().mockResolvedValue({}),
    };
    return {
      tx,
      prisma,
      bankMovements,
      service: new BankAccountsService({ getClientForCurrentContext: () => prisma } as any, bankMovements),
    };
  };

  it('records matching debit and credit movements for the wallet-to-bank transfer', async () => {
    const { service, tx, bankMovements } = makeService();

    await service.transfer(source.id, {
      destination_bank_account_id: destination.id,
      amount: 100,
      date: '2026-10-23',
      reference: 'MP-RET-123',
    }, 'user-1', 'OWNER');

    expect(tx.bank_account_transfers.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ source_bank_account_id: source.id, destination_bank_account_id: destination.id, amount: 100 }),
    }));
    expect(bankMovements.openOperation).toHaveBeenCalledTimes(2);
    expect(bankMovements.openOperation.mock.calls.map(([input]: any[]) => input.operationType)).toEqual(['ACCOUNT_TRANSFER', 'ACCOUNT_TRANSFER']);
    expect(bankMovements.addMovement.mock.calls.map(([input]: any[]) => [input.bankAccountId, input.amount, input.referenceId])).toEqual([
      [source.id, -100, transfer.id],
      [destination.id, 100, transfer.id],
    ]);
    expect(tx.$queryRaw).toHaveBeenCalledTimes(2);
  });

  it('requires access to both accounts for a non-admin user', async () => {
    const { service, prisma } = makeService();
    prisma.bank_account_user_roles = {
      findMany: jest.fn().mockResolvedValue([{ bank_account_id: source.id, role: 'OPERATOR' }]),
    };

    await expect(service.transfer(source.id, {
      destination_bank_account_id: destination.id,
      amount: 100,
      date: '2026-10-23',
    }, 'user-1', 'USER')).rejects.toThrow('Necesitás permisos de operación sobre las cuentas de origen y destino');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
