import { InternationalOperationsService } from './international-operations.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('@/generated/prisma/client', () => ({ Prisma: {} }));
jest.mock('@/modules/erp/document-sequences/document-sequences.service', () => ({ DocumentSequencesService: class {} }));
jest.mock('@/modules/erp/documents-purchases/documents_purchases.service', () => ({ DocumentsPurchasesService: class {} }));

describe('international quotes and document associations', () => {
  function setup() {
    const source: any = { id: 'source', number: 12, status: 0, currency_code: 'USD', party_id: 'supplier', deleted_at: null, document_types: { category: 'QUOTE', direction: -1 }, document_items: [{ product_id: 'product', quantity: 3, original_unit_price: 20, unit_price: 18, price: 54, discount_percentage: 10, unit_conversion_factor: 1 }], document_taxes: [], commercial_adjustments: [] };
    const quote: any = { id: 'quote', operation_id: 'operation', container_id: 'container', expense_type: 'INTERNATIONAL_FREIGHT', custom_expense_description: null, exchange_rate: 1, converted_document_id: null, document: source };
    const created = { id: 'created', number: 5, status: 0, currency_code: 'USD', document_type_id: 'target' };
    const tx: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      international_operations: { findFirst: jest.fn().mockResolvedValue({ currency_code: 'USD' }) },
      international_containers: { findFirst: jest.fn().mockResolvedValue({ id: 'container' }) },
      international_operation_quotes: {
        findFirst: jest.fn().mockImplementation(({ where }) => typeof where.id === 'string' ? quote : null),
        create: jest.fn().mockImplementation(({ data }) => ({ id: 'association', ...data })),
        update: jest.fn().mockImplementation(({ data }) => ({ ...quote, ...data })),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      documents: { findFirst: jest.fn().mockResolvedValue(created) },
      document_types: { findFirst: jest.fn().mockResolvedValue({ id: 'target', category: 'ORDER', direction: -1, accepts_commercial_adjustments: true }) },
      international_operation_documents: { create: jest.fn().mockResolvedValue({}), findUnique: jest.fn().mockResolvedValue(null) },
      orden_compra_documents: { update: jest.fn().mockResolvedValue({}) },
    };
    const prisma = { ...tx, $transaction: jest.fn((callback) => callback(tx)) };
    const purchases = { create: jest.fn().mockResolvedValue(created), confirm: jest.fn().mockResolvedValue({ ...created, status: 2 }) };
    const service = new InternationalOperationsService({ getClientForCurrentContext: () => prisma } as any, {} as any, purchases as any);
    jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'operation', currency_code: 'USD' } as any);
    const dto: any = { document_type_id: 'target', container_id: 'container', expense_type: 'INTERNATIONAL_FREIGHT' };
    return { service, tx, prisma, purchases, quote, source, dto };
  }

  it('creates the selected proposal as a draft preserving container, category and unit prices', async () => {
    const { service, tx, purchases, dto } = setup();
    await expect(service.convertQuote('operation', 'quote', dto, 'user')).resolves.toMatchObject({ document: { status: 0 }, existing: false });
    expect(purchases.create).toHaveBeenCalledWith(expect.objectContaining({ party_id: 'supplier', items: [expect.objectContaining({ quantity: 3, unit_price: 20, discount_percentage: 10 })] }), 'user', tx);
    expect(tx.international_operation_documents.create).toHaveBeenCalledWith({ data: expect.objectContaining({ document_id: 'created', container_id: 'container', expense_type: 'INTERNATIONAL_FREIGHT' }) });
    expect(tx.orden_compra_documents.update).toHaveBeenCalledWith({ where: { document_id: 'created' }, data: { international_operation_id: 'operation' } });
    expect(purchases.confirm).not.toHaveBeenCalled();
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(purchases.create.mock.invocationCallOrder[0]);
  });

  it('confirms an invoice only when explicitly selected, in the same transaction after linking it', async () => {
    const { service, tx, purchases, dto } = setup();
    tx.document_types.findFirst.mockResolvedValue({ id: 'target', category: 'INVOICE' });
    await expect(service.convertQuote('operation', 'quote', { ...dto, confirm: true }, 'user')).resolves.toMatchObject({ document: { status: 2 } });
    expect(purchases.confirm).toHaveBeenCalledWith('created', 'user', undefined, tx);
    expect(tx.international_operation_documents.create.mock.invocationCallOrder[0]).toBeLessThan(purchases.confirm.mock.invocationCallOrder[0]);
    expect(tx.orden_compra_documents.update).not.toHaveBeenCalled();
  });

  it('rejects only alternative proposals in the same container and category', async () => {
    const { service, tx, dto } = setup();
    await service.convertQuote('operation', 'quote', dto, 'user');
    expect(tx.international_operation_quotes.updateMany).toHaveBeenCalledWith({ where: expect.objectContaining({ operation_id: 'operation', container_id: 'container', expense_type: 'INTERNATIONAL_FREIGHT', custom_expense_description: null, deleted_at: null, id: { not: 'quote' } }), data: { status: 'REJECTED' } });
  });

  it('reuses the previously generated document on retry', async () => {
    const { service, quote, purchases, dto } = setup();
    quote.converted_document_id = 'created';
    await expect(service.convertQuote('operation', 'quote', dto, 'user')).resolves.toMatchObject({ existing: true });
    expect(purchases.create).not.toHaveBeenCalled();
  });

  it('rejects changing an assigned container or category during conversion', async () => {
    const { service, purchases, dto } = setup();
    await expect(service.convertQuote('operation', 'quote', { ...dto, expense_type: 'INSURANCE' }, 'user')).rejects.toThrow('conservar el contenedor y la categoría');
    expect(purchases.create).not.toHaveBeenCalled();
  });

  it('does not create a second winning document for the same comparison group', async () => {
    const { service, tx, purchases, dto } = setup();
    tx.international_operation_quotes.findFirst.mockResolvedValueOnce(setup().quote).mockResolvedValueOnce({ id: 'winner' });
    await expect(service.convertQuote('operation', 'quote', dto, 'user')).rejects.toThrow('ya tienen un presupuesto transformado');
    expect(purchases.create).not.toHaveBeenCalled();
  });

  it('requires an existing container before associating documents', async () => {
    const { service, tx } = setup();
    await expect(service.associateDocument('operation', 'document')).rejects.toThrow('Primero creá un contenedor');
    expect(tx.international_operation_documents.create).not.toHaveBeenCalled();
    tx.international_containers.findFirst.mockResolvedValue(null);
    await expect(service.associateDocument('operation', 'document', undefined, 'foreign-container')).rejects.toThrow('no pertenece');
  });

  it.each(['VALE', 'OPENING_BALANCE', 'QUOTE', 'RECEIPT', 'REMITO'])('rejects %s in the order/invoice association endpoint', async category => {
    const { service, tx } = setup();
    tx.documents.findFirst.mockResolvedValue({ currency_code: 'USD', status: 2, document_types: { category, direction: -1 } });
    await expect(service.associateDocument('operation', 'document', undefined, 'container')).rejects.toThrow('Solo se pueden asociar órdenes y facturas');
    expect(tx.international_operation_documents.create).not.toHaveBeenCalled();
  });

  it.each([['ORDER', -1], ['INVOICE', -1], ['ORDER', 1], ['INVOICE', 1]])('accepts a %s with direction %s and a valid container', async (category, direction) => {
    const { service, tx } = setup();
    tx.documents.findFirst.mockResolvedValue({ currency_code: 'USD', status: 0, document_types: { category, direction } });
    await service.associateDocument('operation', 'document', 'INSURANCE' as any, 'container');
    expect(tx.international_operation_documents.create).toHaveBeenCalledWith({ data: expect.objectContaining({ container_id: 'container', expense_type: 'INSURANCE' }) });
  });

  it('keeps acceptance scoped to the category instead of rejecting all operation proposals', async () => {
    const { service, tx } = setup();
    await service.updateQuoteStatus('operation', 'quote', 'ACCEPTED');
    expect(tx.international_operation_quotes.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ container_id: 'container', expense_type: 'INTERNATIONAL_FREIGHT' }) }));
  });

  it('propagates confirmation failure from the transaction without creating a detached fallback document', async () => {
    const { service, prisma, purchases, dto } = setup();
    purchases.confirm.mockRejectedValue(new Error('Stock no disponible'));
    await expect(service.convertQuote('operation', 'quote', { ...dto, confirm: true }, 'user')).rejects.toThrow('Stock no disponible');
    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), { timeout: 30_000 });
    expect(purchases.create).toHaveBeenCalledTimes(1);
  });
});
