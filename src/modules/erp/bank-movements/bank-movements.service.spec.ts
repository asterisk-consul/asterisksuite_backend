import { BankMovementsService } from './bank-movements.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));
jest.mock('../bank-accounts/bank-account-ledger', () => ({
  recalculateBankAccountLedger: jest.fn().mockResolvedValue(undefined),
}));

describe('automatic bank debit and credit tax', () => {
  const concept = {
    id: 'tax-concept',
    code: 'IMP_DEBITOS',
    name: 'Imp. Débitos y Créditos',
    concept_type: 'TAX',
    nature: 'DEBIT',
    default_percentage: 0.6,
    calculates_iva: false,
    affects_balance: true,
    is_active: true,
    automatic_calculation: true,
    automatic_movement_nature: 'BOTH',
    automatic_all_accounts: true,
    automatic_accounts: [] as { id: string }[],
  };

  const makeService = (existing: any = null, concepts = [concept]) => {
    const prisma: any = {
      bank_account_movements: {
        findFirst: jest.fn().mockResolvedValue(existing),
        create: jest.fn().mockResolvedValue({ id: 'tax-movement' }),
      },
      bank_concepts: {
        findMany: jest.fn().mockResolvedValue(concepts),
        findFirst: jest.fn().mockImplementation(({ where }: any) => where.id ? concepts.find((item: any) => item.id === where.id) : existing),
      },
      bank_accounts: {
        findFirst: jest.fn().mockResolvedValue({ id: 'bank-1', balance: 100000, currency_code: 'ARS', active: true }),
        update: jest.fn().mockResolvedValue(undefined),
      },
      payment_bank_charges: { create: jest.fn().mockResolvedValue({ id: 'charge-1' }) },
    };

    return { prisma, service: new BankMovementsService({ getClientForCurrentContext: () => prisma } as any) };
  };

  it('creates a 0.6% debit charge for a confirmed bank operation', async () => {
    const { prisma, service } = makeService();

    await service.addAutomaticBankTax({
      sourceNature: 'DEBIT', sourceDescription: 'Pago #123',
      bankAccountId: 'bank-1',
      baseAmount: 100000,
      currencyCode: 'ARS',
      paymentId: 'payment-1',
      operationId: 'operation-1',
      referenceType: 'payment',
      referenceId: 'payment-1',
      date: new Date('2026-11-19'),
      userId: 'user-1',
    });

    expect(prisma.payment_bank_charges.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        base_amount: 100000,
        percentage_applied: 0.6,
        tax_amount: 600,
        total_amount: 600,
        nature: 'DEBIT',
      }),
    }));
    expect(prisma.bank_account_movements.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        amount: -600,
        type: 'TAX',
        reference_type: 'automatic_bank_tax',
        reference_id: 'payment-1',
      }),
    }));
  });

  it('does not create a second tax movement for the same source', async () => {
    const { prisma, service } = makeService({ id: 'existing-tax' });

    const result = await service.addAutomaticBankTax({
      sourceNature: 'DEBIT', sourceDescription: 'Pago #123',
      bankAccountId: 'bank-1',
      baseAmount: 100000,
      currencyCode: 'ARS',
      paymentId: 'payment-1',
      referenceType: 'payment',
      referenceId: 'payment-1',
    });

    expect(result).toEqual([]);
    expect(prisma.bank_account_movements.create).not.toHaveBeenCalled();
    expect(prisma.payment_bank_charges.create).not.toHaveBeenCalled();
  });

  it('calculates multiple automatic concepts from the original base', async () => {
    const secondConcept = { ...concept, id: 'second-tax', name: 'Segundo impuesto', default_percentage: 0.5 };
    const { prisma, service } = makeService(null, [concept, secondConcept]);

    await service.addAutomaticBankTax({
      bankAccountId: 'bank-1',
      sourceNature: 'DEBIT', sourceDescription: 'Pago #123',
      baseAmount: 100000,
      currencyCode: 'ARS',
      paymentId: 'payment-1',
      referenceType: 'payment',
      referenceId: 'payment-1',
    });

    expect(prisma.payment_bank_charges.create).toHaveBeenCalledTimes(2);
    expect(prisma.payment_bank_charges.create.mock.calls.map(([call]: any[]) => call.data.tax_amount)).toEqual([600, 500]);
    expect(prisma.payment_bank_charges.create.mock.calls.map(([call]: any[]) => call.data.base_amount)).toEqual([100000, 100000]);
  });

  it.each(['bank-1', 'bank-2'])('applies a restricted concept to selected account %s', async (bankAccountId) => {
    const restricted = { ...concept, automatic_all_accounts: false, automatic_accounts: [{ id: 'bank-1' }, { id: 'bank-2' }] };
    const { service, prisma } = makeService(null, [restricted]);
    await service.addAutomaticBankTax({ sourceNature: 'DEBIT', sourceDescription: 'Pago #123', bankAccountId, baseAmount: 100000, currencyCode: 'ARS', paymentId: 'payment-1', referenceType: 'payment', referenceId: 'payment-1' });
    expect(prisma.payment_bank_charges.create).toHaveBeenCalledTimes(1);
  });

  it('skips excluded concepts while preserving global concepts', async () => {
    const restricted = { ...concept, id: 'restricted', automatic_all_accounts: false, automatic_accounts: [{ id: 'bank-2' }] };
    const { service, prisma } = makeService(null, [restricted, concept]);
    await service.addAutomaticBankTax({ sourceNature: 'DEBIT', sourceDescription: 'Pago #123', bankAccountId: 'bank-1', baseAmount: 100000, currencyCode: 'ARS', paymentId: 'payment-1', referenceType: 'payment', referenceId: 'payment-1' });
    expect(prisma.payment_bank_charges.create).toHaveBeenCalledTimes(1);
    expect(prisma.payment_bank_charges.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ bank_concept_id: concept.id, tax_amount: 600 }) }));
  });
  it.each([
    ['BOTH', 'DEBIT', true], ['BOTH', 'CREDIT', true],
    ['DEBIT', 'DEBIT', true], ['DEBIT', 'CREDIT', false],
    ['CREDIT', 'DEBIT', false], ['CREDIT', 'CREDIT', true],
  ] as const)('scope %s with source %s applies=%s and remains a debit', async (scope, sourceNature, applies) => {
    const { service, prisma } = makeService(null, [{ ...concept, automatic_movement_nature: scope }]);
    const sourceDescription = sourceNature === 'DEBIT' ? 'Pago #123' : 'Cobro #456';
    await service.addAutomaticBankTax({ sourceNature, sourceDescription, bankAccountId: 'bank-1', baseAmount: 100000, currencyCode: 'ARS', paymentId: 'payment-1', referenceType: 'payment', referenceId: 'payment-1' });
    expect(prisma.bank_account_movements.create).toHaveBeenCalledTimes(applies ? 1 : 0);
    if (applies) expect(prisma.bank_account_movements.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ amount: -600, nature: 'DEBIT', description: `Imp. Débitos y Créditos (0.6%) sobre ${sourceNature === 'DEBIT' ? 'débito' : 'crédito'} bancario — ${sourceDescription}` }) }));
  });

  it('combines account and movement restrictions', async () => {
    const { service, prisma } = makeService(null, [{ ...concept, automatic_all_accounts: false, automatic_accounts: [{ id: 'bank-2' }], automatic_movement_nature: 'CREDIT' }]);
    await service.addAutomaticBankTax({ sourceNature: 'CREDIT', sourceDescription: 'Cheque #77 acreditado', bankAccountId: 'bank-1', baseAmount: 100000, currencyCode: 'ARS', referenceType: 'check', referenceId: 'check-1' });
    expect(prisma.bank_account_movements.create).not.toHaveBeenCalled();
  });

  it('describes a check credit while charging a debit without a payment', async () => {
    const { service, prisma } = makeService();
    await service.addAutomaticBankTax({ sourceNature: 'CREDIT', sourceDescription: 'Cheque #77 acreditado', bankAccountId: 'bank-1', baseAmount: 100000, currencyCode: 'ARS', referenceType: 'check', referenceId: 'check-1' });
    expect(prisma.bank_account_movements.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ amount: -600, description: expect.stringContaining('sobre crédito bancario — Cheque #77 acreditado') }) }));
  });
});
