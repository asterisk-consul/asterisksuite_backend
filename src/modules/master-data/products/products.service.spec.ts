jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class PrismaService {} }));

import { ProductsService } from './products.service';

describe('ProductsService server-side table filters', () => {
  const findMany = jest.fn();
  const count = jest.fn();
  const db = {
    getClientForCurrentContext: () => ({
      products: { findMany, count },
    }),
  } as any;
  const service = new ProductsService(db);

  beforeEach(() => {
    jest.clearAllMocks();
    findMany.mockResolvedValue([]);
    count.mockResolvedValue(0);
  });

  it('busca por nombre o SKU y aplica filtros antes de paginar', async () => {
    const filters = JSON.stringify([
      { column: 'name', operator: 'contains', value: 'silla' },
      { column: 'product_type', operator: 'equals', value: 'FINISHED_PRODUCT' },
    ]);

    await service.findAll(2, 25, 'ABC', 'name', 'asc', filters);

    const query = findMany.mock.calls[0][0];
    expect(query.skip).toBe(25);
    expect(query.take).toBe(25);
    expect(query.select).toBeDefined();
    expect(query.include).toBeUndefined();
    expect(query.where.OR).toEqual([
      { sku: { contains: 'ABC', mode: 'insensitive' } },
      { name: { contains: 'ABC', mode: 'insensitive' } },
    ]);
    expect(query.where.AND).toEqual([
      { name: { contains: 'silla', mode: 'insensitive' } },
      { product_type: 'FINISHED_PRODUCT' },
    ]);
    expect(count).toHaveBeenCalledWith({ where: query.where });
  });

  it('calcula el badge sin depender de los productos de la página actual', async () => {
    count.mockResolvedValueOnce(120).mockResolvedValueOnce(7);

    await expect(service.getCounts()).resolves.toEqual({
      total: 120,
      active: 113,
      inactive: 7,
    });
  });
});
