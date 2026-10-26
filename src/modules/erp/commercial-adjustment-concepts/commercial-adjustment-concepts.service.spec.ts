import { BadRequestException, ConflictException } from '@nestjs/common';
jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));
import { CommercialAdjustmentConceptsService } from './commercial-adjustment-concepts.service';

describe('CommercialAdjustmentConceptsService', () => {
  const findMany = jest.fn();
  const findFirst = jest.fn();
  const create = jest.fn();
  const update = jest.fn();
  const prisma = {
    commercial_adjustment_concepts: { findMany, findFirst, create, update },
  };
  const db = { getClientForCurrentContext: jest.fn(() => prisma) };
  const service = new CommercialAdjustmentConceptsService(db as any);

  beforeEach(() => jest.clearAllMocks());

  it('filters active templates by document circuit while including shared templates', async () => {
    findMany.mockResolvedValue([]);
    await service.findAll('SALES');

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { deleted_at: null, is_active: true, applies_to: { in: ['SALES', 'BOTH'] } },
        orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
      }),
    );
  });

  it('rejects unsupported module filters', async () => {
    await expect(service.findAll('STOCK')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('prevents duplicate names within the tenant', async () => {
    findMany.mockResolvedValue([{ id: 'existing', name: 'Bonificación' }]);
    await expect(
      service.create({
        name: '  bonificación ',
        applies_to: 'BOTH',
        value_type: 'PERCENTAGE',
        basis: 'NET',
        default_value: 5,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(create).not.toHaveBeenCalled();
  });

  it('does not allow a default percentage over 100', async () => {
    findMany.mockResolvedValue([]);
    await expect(
      service.create({
        name: 'Descuento',
        applies_to: 'SALES',
        value_type: 'PERCENTAGE',
        basis: 'NET',
        default_value: 101,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(create).not.toHaveBeenCalled();
  });

  it('validates an existing default when changing an amount concept to a percentage', async () => {
    findFirst.mockResolvedValue({ id: 'concept-id', name: 'Descuento', value_type: 'AMOUNT', default_value: 150 });
    findMany.mockResolvedValue([]);

    await expect(service.update('concept-id', { value_type: 'PERCENTAGE' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(update).not.toHaveBeenCalled();
  });
});
