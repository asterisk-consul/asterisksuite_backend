import { HrService } from './hr.service';
import { HrTreasuryTargetTypeDto } from './dto/confirm-hr-vale.dto';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('../bank-movements/bank-movements.service', () => ({ BankMovementsService: class {} }));
jest.mock('../current-accounts/current-account-ledger', () => ({ recalculateCurrentAccountLedger: jest.fn() }));

describe('partner contributions and remuneration', () => {
  const decimal = (value: number) => ({ toNumber: () => value, valueOf: () => value });
  function setup(type = 'RETIRO', amount = 200, status = 'DRAFT') {
    const vale = { id: 'vale', party_id: 'partner', party_type: 'PARTNER', type, amount: decimal(amount), currency_code: 'ARS', status, deleted_at: null, number: 1 };
    const tx: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      documents: { aggregate: jest.fn().mockResolvedValue({ _sum: { total: 500, paid_amount: 200 } }) },
      hr_vales: {
        findUnique: jest.fn().mockResolvedValue(vale),
        groupBy: jest.fn().mockResolvedValue([{ type: 'APORTE', _sum: { amount: 1000 } }, { type: 'RETIRO', _sum: { amount: 800 } }]),
        update: jest.fn().mockImplementation(({ data }) => ({ ...vale, ...data })),
      },
      hr_accounts: { findUnique: jest.fn().mockResolvedValue({ id: 'account', balance: decimal(200) }), update: jest.fn() },
      hr_account_entries: { create: jest.fn() },
    };
    const client = { ...tx, $transaction: jest.fn((callback) => callback(tx)) };
    const service = new HrService({ getClientForCurrentContext: () => client } as any, {} as any);
    jest.spyOn(service, 'findOneVale').mockResolvedValue(vale as any);
    const document = jest.spyOn(service as any, 'createValeDocument').mockResolvedValue({ id: 'document' });
    const treasury = jest.spyOn(service as any, 'createPartnerTreasuryMovement').mockResolvedValue(undefined);
    return { service, tx, document, treasury };
  }
  const instrument = { treasury_target_type: HrTreasuryTargetTypeDto.CASH_BOX, treasury_target_id: 'cash' };

  it('uses only confirmed contributions and withdrawals in the selected currency', async () => {
    const { service, tx } = setup();
    await expect(service.getPartnerFunds('partner', 'USD')).resolves.toEqual({ currency_code: 'USD', contributions: 1000, withdrawals: 800, balance: 200, available: 200, remuneration_pending: 300 });
    expect(tx.hr_vales.groupBy).toHaveBeenCalledWith(expect.objectContaining({ where: {
      party_id: 'partner', party_type: 'PARTNER', currency_code: 'USD',
      type: { in: ['APORTE', 'RETIRO'] }, status: { in: ['CONFIRMED', 'PAID'] }, deleted_at: null,
    } }));
  });

  it('blocks a withdrawal above the remaining contributions before moving money', async () => {
    const { service, tx, document, treasury } = setup('RETIRO', 200.01);
    await expect(service.confirmVale('vale', 'user', instrument)).rejects.toThrow('supera los aportes disponibles');
    expect(tx.hr_account_entries.create).not.toHaveBeenCalled();
    expect(document).not.toHaveBeenCalled();
    expect(treasury).not.toHaveBeenCalled();
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(tx.hr_vales.groupBy.mock.invocationCallOrder[0]);
  });

  it('allows withdrawing exactly the available contributions', async () => {
    const { service, tx, treasury } = setup();
    await expect(service.confirmVale('vale', 'user', instrument)).resolves.toMatchObject({ status: 'PAID' });
    expect(tx.hr_accounts.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ balance: 0 }) }));
    expect(treasury).toHaveBeenCalledTimes(1);
  });

  it('creates a partner remuneration as debt awaiting payment without consuming contributions', async () => {
    const { service, tx, document, treasury } = setup('SUELDO', 500);
    await expect(service.confirmVale('vale', 'user')).resolves.toMatchObject({ status: 'CONFIRMED', paid_at: null });
    expect(tx.hr_accounts.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ balance: 700 }) }));
    expect(document).toHaveBeenCalledWith(expect.anything(), 'user', tx, false);
    expect(treasury).not.toHaveBeenCalled();
    expect(tx.hr_vales.groupBy).not.toHaveBeenCalled();
  });

  it('blocks cancellation of a contribution already backing withdrawals', async () => {
    const { service, tx } = setup('APORTE', 1000, 'PAID');
    await expect(service.cancelVale('vale', 'user')).rejects.toThrow('dejaría retiros sin respaldo');
    expect(tx.hr_account_entries.create).not.toHaveBeenCalled();
  });

  it('rechecks the vale after acquiring the person lock to prevent duplicate confirmation', async () => {
    const { service, tx, treasury } = setup();
    tx.hr_vales.findUnique.mockResolvedValue({ status: 'PAID' });
    await expect(service.confirmVale('vale', 'user', instrument)).rejects.toThrow('ya fue confirmado');
    expect(treasury).not.toHaveBeenCalled();
  });

  it('keeps historical deficits visible while exposing zero available funds', async () => {
    const { service, tx } = setup();
    tx.hr_vales.groupBy.mockResolvedValue([{ type: 'RETIRO', _sum: { amount: 500 } }]);
    await expect(service.getPartnerFunds('partner', 'ARS')).resolves.toMatchObject({ balance: -500, available: 0 });
  });

  it.each([500, -500])('cancels the original account movement by its signed delta (%s)', async (delta) => {
    const { service, tx } = setup('SUELDO');
    tx.documents.findFirst = jest.fn().mockResolvedValue({ id: 'document', number: 1, currency_code: 'ARS' });
    tx.documents.update = jest.fn();
    tx.current_account_entries = {
      findFirst: jest.fn().mockResolvedValue({ amount: decimal(500), current_account_id: 'account', balance_before: 0, balance_after: delta }),
      create: jest.fn(),
    };
    tx.current_accounts = { findUnique: jest.fn().mockResolvedValue({ id: 'account', balance: decimal(delta) }), update: jest.fn() };
    await (service as any).reverseValeDocument({ number: 1, party_id: 'partner' }, 'user', tx);
    expect(tx.current_account_entries.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ balance_before: delta, balance_after: 0 }) }));
    expect(tx.current_accounts.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ balance: 0 }) }));
  });
});
