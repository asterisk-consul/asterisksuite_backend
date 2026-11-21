import { BankConceptsService } from './bank-concepts.service';
jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));

describe('automatic concept account scope', () => {
  const id = 'a3fd34d9-aeba-41e9-b9a4-13570a2d2f20';
  const setup = () => {
    const db = {
      bank_accounts: { count: jest.fn().mockResolvedValue(1) },
      bank_concepts: {
        create: jest.fn(), update: jest.fn(),
        findFirst: jest.fn().mockResolvedValue({ id: 'concept', automatic_all_accounts: false, automatic_accounts: [{ id }] }),
      },
    };
    return { db, service: new BankConceptsService({ getClientForCurrentContext: () => db } as any) };
  };
  it('rejects specific scope without accounts', async () => {
    const { service, db } = setup();
    await expect(service.create({ automatic_all_accounts: false, automatic_account_ids: [] })).rejects.toThrow('Seleccioná al menos');
    expect(db.bank_concepts.create).not.toHaveBeenCalled();
  });
  it.each(['INVALID', null, false])('rejects invalid movement scope %s', async (scope) => {
    const { service, db } = setup();
    await expect(service.create({ automatic_movement_nature: scope })).rejects.toThrow('Débitos, Créditos o Ambos');
    expect(db.bank_concepts.create).not.toHaveBeenCalled();
  });
  it('rejects accounts outside the tenant or soft deleted', async () => {
    const { service, db } = setup();
    db.bank_accounts.count.mockResolvedValue(0);
    await expect(service.create({ automatic_all_accounts: false, automatic_account_ids: [id] })).rejects.toThrow('no existe');
    expect(db.bank_concepts.create).not.toHaveBeenCalled();
  });
  it('deduplicates valid accounts and uses a nested atomic relation write', async () => {
    const { service, db } = setup();
    await service.create({ automatic_all_accounts: false, automatic_account_ids: [id, id] });
    expect(db.bank_concepts.create).toHaveBeenCalledWith(expect.objectContaining({ data: { automatic_all_accounts: false, automatic_accounts: { connect: [{ id }] } } }));
  });
  it('preserves selection on unrelated partial updates', async () => {
    const { service, db } = setup();
    await service.update('concept', { available_payments: true });
    expect(db.bank_concepts.update).toHaveBeenCalledWith(expect.objectContaining({ data: { available_payments: true } }));
  });
  it('clears restrictions when switching to all accounts', async () => {
    const { service, db } = setup();
    await service.update('concept', { automatic_all_accounts: true });
    expect(db.bank_concepts.update).toHaveBeenCalledWith(expect.objectContaining({ data: { automatic_all_accounts: true, automatic_accounts: { set: [] } } }));
  });
});
