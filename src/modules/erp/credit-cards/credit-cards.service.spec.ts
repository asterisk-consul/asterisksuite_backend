import { CreditCardsService } from './credit-cards.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));
jest.mock('../bank-accounts/bank-account-ledger', () => ({
  recalculateBankAccountLedger: jest.fn().mockResolvedValue(undefined),
}));

describe('credit card statement payment', () => {
  const summaryItem = {
    transaction_id: 'transaction-1',
    installment_number: 1,
    amount: 125,
    currency_code: 'ARS',
  };
  const pendingSummary = {
    id: 'summary-1',
    status: 'pending',
    balance: 125,
    total_installments: 125,
    total_payments: 0,
    month: 10,
    year: 2026,
    currency_code: 'ARS',
    items: [summaryItem],
    credit_card: { id: 'card-1', name: 'Visa empresa' },
  };
  const paidSummary = { ...pendingSummary, status: 'paid', total_payments: 125, balance: 0 };
  const bankOperation = { id: 'bank-operation-1', source_id: 'summary-1' };

  const makeService = (reverse = false) => {
    const tx: any = {
      credit_card_summaries: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue(reverse ? paidSummary : pendingSummary),
        update: jest.fn().mockResolvedValue(reverse ? pendingSummary : paidSummary),
      },
      credit_card_installments: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        count: jest.fn().mockResolvedValue(0),
      },
      credit_card_transactions: {
        update: jest.fn().mockResolvedValue({}),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      bank_operations: { findFirst: jest.fn().mockResolvedValue(bankOperation) },
    };
    const finalSummary = reverse ? pendingSummary : paidSummary;
    const prisma: any = {
      credit_card_summaries: {
        findFirst: jest.fn().mockResolvedValue(reverse ? paidSummary : pendingSummary),
        findUnique: jest.fn().mockResolvedValue(finalSummary),
      },
      bank_accounts: {
        findFirst: jest.fn().mockResolvedValue({ id: 'bank-1', name: 'Banco', balance: 1000, currency_code: 'ARS' }),
      },
      bank_operations: { findFirst: jest.fn().mockResolvedValue(bankOperation) },
      $transaction: jest.fn((callback: (client: any) => Promise<any>) => callback(tx)),
    };
    const bankMovements: any = {
      openOperation: jest.fn().mockResolvedValue(bankOperation),
      addMovement: jest.fn().mockResolvedValue({}),
      closeOperation: jest.fn().mockResolvedValue({}),
      cancelOperation: jest.fn().mockResolvedValue({ ok: true }),
    };
    const service = new CreditCardsService({ getClientForCurrentContext: () => prisma } as any, bankMovements);
    return { service, prisma, tx, bankMovements };
  };

  it('pays the full summary with exactly one bank debit and marks its installment paid', async () => {
    const { service, tx, bankMovements } = makeService();

    await service.paySummary('summary-1', { bank_account_id: 'bank-1', date: '2026-11-10' }, 'user-1');

    expect(bankMovements.addMovement).toHaveBeenCalledTimes(1);
    expect(bankMovements.addMovement.mock.calls[0][0]).toMatchObject({
      type: 'PAYMENT',
      nature: 'DEBIT',
      amount: -125,
      referenceType: 'credit_card_summary',
      referenceId: 'summary-1',
    });
    expect(tx.credit_card_installments.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ transaction_id: 'transaction-1', status: 'PENDING' }),
      data: expect.objectContaining({ status: 'PAID', paid_amount: 125 }),
    }));
    expect(tx.credit_card_summaries.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'summary-1' },
      data: expect.objectContaining({ status: 'paid', balance: 0 }),
    }));
  });

  it('reverses the bank operation and restores the summary installment to pending', async () => {
    const { service, tx, bankMovements } = makeService(true);

    await service.reverseSummaryPayment('summary-1', 'user-1');

    expect(bankMovements.cancelOperation).toHaveBeenCalledWith('bank-operation-1', 'user-1', tx);
    expect(tx.credit_card_installments.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ transaction_id: 'transaction-1', status: 'PAID' }),
      data: expect.objectContaining({ status: 'PENDING', paid_date: null, paid_amount: null }),
    }));
    expect(tx.credit_card_summaries.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'summary-1' },
      data: expect.objectContaining({ status: 'pending', total_payments: 0, balance: 125 }),
    }));
  });

  it('registers a card sale collection as pending until the acquirer settlement is confirmed', async () => {
    const transaction = {
      id: 'collection-1',
      credit_card_id: 'channel-1',
      payment_id: 'payment-1',
      currency_code: 'ARS',
      amount: 1000,
      clearing_status: 'PENDING',
      settlement_id: null,
      credit_card: { name: 'Adquirente' },
    };
    const batch = { id: 'settlement-1' };
    const tx: any = {
      credit_card_settlements: { create: jest.fn().mockResolvedValue(batch), findUnique: jest.fn().mockResolvedValue(batch) },
      credit_card_transactions: { update: jest.fn().mockResolvedValue({}), updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
    };
    const prisma: any = {
      credit_card_transactions: {
        findMany: jest.fn().mockResolvedValue([transaction]),
        findUnique: jest.fn().mockResolvedValue({ ...transaction, clearing_status: 'CLEARED' }),
      },
      bank_accounts: { findFirst: jest.fn().mockResolvedValue({ id: 'bank-1', currency_code: 'ARS' }) },
      $transaction: jest.fn((callback: (client: any) => Promise<any>) => callback(tx)),
    };
    const bankMovements: any = {
      openOperation: jest.fn().mockResolvedValue(bankOperation),
      addMovement: jest.fn().mockResolvedValue({}),
      closeOperation: jest.fn().mockResolvedValue({}),
    };
    const service = new CreditCardsService({ getClientForCurrentContext: () => prisma } as any, bankMovements);

    await service.settle('collection-1', {
      bank_account_id: 'bank-1',
      date: '2026-10-23',
      commission_amount: 50,
      tax_amount: 10,
      withholding_amount: 20,
      other_deductions: 5,
      net_amount: 915,
      reference: 'LIQ-123',
    }, 'user-1');

    expect(bankMovements.addMovement).toHaveBeenCalledTimes(5);
    expect(bankMovements.addMovement.mock.calls.map(([movement]: any[]) => movement.amount)).toEqual([
      1000, -50, -10, -20, -5,
    ]);
    expect(tx.credit_card_transactions.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ id: { in: ['collection-1'] }, clearing_status: 'PENDING' }),
      data: expect.objectContaining({ clearing_status: 'CLEARED', settlement_bank_id: 'bank-1', settlement_id: 'settlement-1' }),
    }));
    expect(tx.credit_card_transactions.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'collection-1' }, data: expect.objectContaining({ net_amount: 915 }),
    }));
  });

  it('groups same-channel collections into one net bank operation and allocates deductions by cents', async () => {
    const channel = { id: 'channel-1', name: 'Mercado Pago QR', commission_rate: 5 };
    const collections = [
      { id: 'collection-1', credit_card_id: 'channel-1', payment_id: 'payment-1', currency_code: 'ARS', amount: 1000, clearing_status: 'PENDING', settlement_id: null, credit_card: channel },
      { id: 'collection-2', credit_card_id: 'channel-1', payment_id: 'payment-2', currency_code: 'ARS', amount: 500, clearing_status: 'PENDING', settlement_id: null, credit_card: channel },
    ];
    const batch = { id: 'settlement-1', credit_card_id: 'channel-1', bank_account_id: 'wallet-1' };
    const tx: any = {
      credit_card_settlements: {
        create: jest.fn().mockResolvedValue(batch),
        findUnique: jest.fn().mockResolvedValue(batch),
      },
      credit_card_transactions: {
        updateMany: jest.fn().mockResolvedValue({ count: 2 }),
        update: jest.fn().mockResolvedValue({}),
      },
    };
    const prisma: any = {
      credit_card_transactions: { findMany: jest.fn().mockResolvedValue(collections) },
      bank_accounts: { findFirst: jest.fn().mockResolvedValue({ id: 'wallet-1', currency_code: 'ARS' }) },
      $transaction: jest.fn((callback: (client: any) => Promise<any>) => callback(tx)),
    };
    const bankMovements: any = {
      openOperation: jest.fn().mockResolvedValue({ id: 'operation-1' }),
      addMovement: jest.fn().mockResolvedValue({}),
      closeOperation: jest.fn().mockResolvedValue({}),
    };
    const service = new CreditCardsService({ getClientForCurrentContext: () => prisma } as any, bankMovements);

    await service.settleBatch({
      transaction_ids: ['collection-1', 'collection-2'],
      bank_account_id: 'wallet-1',
      date: '2026-10-23',
      commission_amount: 75,
      tax_amount: 15,
      withholding_amount: 30,
      other_deductions: 5,
      net_amount: 1375,
      reference: 'MP-SETTLEMENT-1',
    }, 'user-1');

    expect(bankMovements.openOperation).toHaveBeenCalledTimes(1);
    expect(bankMovements.addMovement.mock.calls.map(([movement]: any[]) => movement.amount)).toEqual([1500, -75, -15, -30, -5]);
    expect(bankMovements.addMovement.mock.calls[0][0]).toMatchObject({
      cardSettlementId: 'settlement-1',
      referenceId: 'settlement-1',
    });
    expect(tx.credit_card_transactions.updateMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ clearing_status: 'PENDING', settlement_id: null }),
      data: expect.objectContaining({ clearing_status: 'CLEARED', settlement_id: 'settlement-1' }),
    }));
    const allocated = tx.credit_card_transactions.update.mock.calls.map(([call]: any[]) => call.data);
    expect(allocated.map((row: any) => row.other_deductions)).toEqual([3.33, 1.67]);
    expect(allocated.map((row: any) => row.net_amount)).toEqual([916.67, 458.33]);
  });

  it('rejects collections from different channels before creating a settlement', async () => {
    const rows = [
      { id: 'collection-1', credit_card_id: 'channel-1', currency_code: 'ARS', amount: 100, clearing_status: 'PENDING', credit_card: { id: 'channel-1', name: 'MP' } },
      { id: 'collection-2', credit_card_id: 'channel-2', currency_code: 'ARS', amount: 100, clearing_status: 'PENDING', credit_card: { id: 'channel-2', name: 'Getnet' } },
    ];
    const prisma: any = {
      credit_card_transactions: { findMany: jest.fn().mockResolvedValue(rows) },
      bank_accounts: { findFirst: jest.fn() },
      $transaction: jest.fn(),
    };
    const service = new CreditCardsService({ getClientForCurrentContext: () => prisma } as any, {} as any);

    await expect(service.settleBatch({
      transaction_ids: ['collection-1', 'collection-2'],
      bank_account_id: 'wallet-1',
      date: '2026-10-23',
      commission_amount: 0,
      net_amount: 200,
    }, 'user-1')).rejects.toThrow('Agrupá únicamente cobros del mismo canal y moneda');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('loads pending collections in a bounded page for the settlement screen', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = new CreditCardsService({
      getClientForCurrentContext: () => ({
        credit_card_transactions: { count: jest.fn().mockResolvedValue(145), findMany },
      }),
    } as any, {} as any);

    const result = await service.pendingCollections(2);

    expect(result).toMatchObject({ total: 145, page: 2, page_size: 100, items: [] });
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 100, take: 100 }));
  });
});
