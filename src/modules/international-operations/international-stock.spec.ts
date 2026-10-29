import { hasInternationalTransitMovements, registerInternationalPurchaseInTransit } from './international-stock';

jest.mock('@/generated/prisma/client', () => ({ Prisma: { Decimal: require('@prisma/client/runtime/client').Decimal } }));
jest.mock('./transit-reservations', () => ({ relocateTransitReservations: jest.fn() }));

describe('international order and invoice transit coverage', () => {
  function setup() {
    const docs = new Map<string, any>();
    const movements: any[] = [];
    const stock = new Map<string, number>();
    const container = { id: 'container', container_number: 'C-1', status: 'SHIPPED', transit_warehouse_id: 'transit' };
    const tx: any = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      international_containers: { findFirst: jest.fn().mockImplementation(() => container) },
      documents: {
        findUnique: jest.fn().mockImplementation(({ where }) => {
          const doc = docs.get(where.id);
          if (!doc) return null;
          const parent = docs.get(doc.parent_document_id);
          return { ...doc, parent_document: parent ? { id: parent.id, document_types: parent.document_types } : null };
        }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      international_operation_documents: {
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockImplementation(({ where }) => {
          const root = where.document.OR[0].id;
          return [...docs.values()].filter(doc => doc.assigned !== false && doc.expense_type === 'MERCHANDISE' && (doc.id === root || doc.parent_document_id === root)).map(document => ({ document_id: document.id, document }));
        }),
      },
      warehouse_stock_movements: {
        findMany: jest.fn().mockImplementation(({ where }) => movements.filter(m => where.reference_id.in.includes(m.reference_id) && where.reference_type.in.includes(m.reference_type))),
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockImplementation(({ data }) => { movements.push(data); return data; }),
      },
      warehouse_stock: { upsert: jest.fn().mockImplementation(({ create, update }) => { stock.set(create.product_id, (stock.get(create.product_id) ?? 0) + Number(update.quantity.increment)); }) },
    };
    function add(id: string, category: string, quantity = 10, parentId?: string) {
      const doc = { id, status: 2, deleted_at: null, parent_document_id: parentId, document_types: { category, direction: -1 }, expense_type: 'MERCHANDISE', document_items: [{ product_id: 'product', quantity, stock_quantity: quantity }] };
      docs.set(id, doc);
      return doc;
    }
    return { tx, docs, add, container, movements, stock };
  }

  it('enters confirmed OC merchandise with its own audit reference', async () => {
    const { tx, add, movements, stock } = setup();
    add('order', 'ORDER');
    await expect(registerInternationalPurchaseInTransit(tx, 'order', 'container', 'user')).resolves.toBe(true);
    expect(stock.get('product')).toBe(10);
    expect(movements[0]).toMatchObject({ reference_type: 'intl_order_transit', reference_id: 'order', direction: 'IN', created_by: 'user' });
    expect(tx.$queryRaw.mock.invocationCallOrder[0]).toBeLessThan(tx.warehouse_stock_movements.create.mock.invocationCallOrder[0]);
  });

  it('does not enter the same units again when the OC is invoiced', async () => {
    const { tx, add, stock, movements } = setup();
    add('order', 'ORDER');
    await registerInternationalPurchaseInTransit(tx, 'order', 'container');
    add('invoice', 'INVOICE', 10, 'order');
    await expect(registerInternationalPurchaseInTransit(tx, 'invoice', 'container')).resolves.toBe(false);
    expect(stock.get('product')).toBe(10);
    expect(movements).toHaveLength(1);
  });

  it('is also idempotent if the invoice is synchronized before its OC', async () => {
    const { tx, add, stock } = setup();
    add('order', 'ORDER');
    add('invoice', 'INVOICE', 10, 'order');
    await registerInternationalPurchaseInTransit(tx, 'invoice', 'container');
    await expect(registerInternationalPurchaseInTransit(tx, 'order', 'container')).resolves.toBe(false);
    expect(stock.get('product')).toBe(10);
  });

  it('enters only the additional units when an invoice exceeds the OC coverage', async () => {
    const { tx, add, stock, movements } = setup();
    add('order', 'ORDER');
    await registerInternationalPurchaseInTransit(tx, 'order', 'container');
    add('invoice', 'INVOICE', 12, 'order');
    await registerInternationalPurchaseInTransit(tx, 'invoice', 'container');
    expect(stock.get('product')).toBe(12);
    expect(Number(movements[1].quantity)).toBe(2);
    await expect(registerInternationalPurchaseInTransit(tx, 'invoice', 'container')).resolves.toBe(false);
  });

  it('does not remove or re-enter covered units for a smaller invoice', async () => {
    const { tx, add, stock } = setup();
    add('order', 'ORDER');
    await registerInternationalPurchaseInTransit(tx, 'order', 'container');
    add('invoice', 'INVOICE', 6, 'order');
    await registerInternationalPurchaseInTransit(tx, 'invoice', 'container');
    expect(stock.get('product')).toBe(10);
  });

  it('adds independent documents instead of treating equal products as duplicates', async () => {
    const { tx, add, stock } = setup();
    add('order', 'ORDER');
    add('independent-invoice', 'INVOICE');
    await registerInternationalPurchaseInTransit(tx, 'order', 'container');
    await registerInternationalPurchaseInTransit(tx, 'independent-invoice', 'container');
    expect(stock.get('product')).toBe(20);
  });

  it('uses stock units and aggregates repeated product lines', async () => {
    const { tx, add, stock } = setup();
    const order = add('order', 'ORDER');
    order.document_items = [{ product_id: 'product', quantity: 2, stock_quantity: 20 }, { product_id: 'product', quantity: 1, stock_quantity: 10 }];
    await registerInternationalPurchaseInTransit(tx, 'order', 'container');
    expect(stock.get('product')).toBe(30);
  });

  it('does not re-enter goods already transferred out of the transit warehouse', async () => {
    const { tx, add, stock, movements } = setup();
    add('order', 'ORDER');
    await registerInternationalPurchaseInTransit(tx, 'order', 'container');
    stock.set('product', 0);
    await expect(registerInternationalPurchaseInTransit(tx, 'order', 'container')).resolves.toBe(false);
    expect(stock.get('product')).toBe(0);
    expect(movements).toHaveLength(1);
  });

  it.each(['PREPARING', 'LOADED', 'DELIVERED'])('does not enter stock for a container in %s', async status => {
    const { tx, add, container, movements } = setup();
    add('order', 'ORDER');
    container.status = status;
    await expect(registerInternationalPurchaseInTransit(tx, 'order', 'container')).resolves.toBe(false);
    expect(movements).toHaveLength(0);
  });

  it.each([0, 3])('does not enter a draft or cancelled OC (status %s)', async status => {
    const { tx, add, movements } = setup();
    add('order', 'ORDER').status = status;
    await expect(registerInternationalPurchaseInTransit(tx, 'order', 'container')).resolves.toBe(false);
    expect(movements).toHaveLength(0);
  });

  it('ignores non-merchandise associations', async () => {
    const { tx, add, movements } = setup();
    add('order', 'ORDER').expense_type = 'INTERNATIONAL_FREIGHT';
    await expect(registerInternationalPurchaseInTransit(tx, 'order', 'container')).resolves.toBe(false);
    expect(movements).toHaveLength(0);
  });

  it('protects an OC when the transit entry was recorded from its invoice', async () => {
    const { tx, add } = setup();
    add('order', 'ORDER');
    tx.documents.findMany.mockResolvedValue([{ id: 'invoice' }]);
    tx.warehouse_stock_movements.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'movement' });
    await expect(hasInternationalTransitMovements(tx, 'order')).resolves.toBe(true);
  });

  it('rejects assigning an OC and its invoice to different containers', async () => {
    const { tx, add, movements } = setup();
    add('order', 'ORDER');
    add('invoice', 'INVOICE', 10, 'order');
    tx.international_operation_documents.findFirst.mockResolvedValue({ container_id: 'other-container' });
    await expect(registerInternationalPurchaseInTransit(tx, 'invoice', 'container')).rejects.toThrow('mismo contenedor');
    expect(movements).toHaveLength(0);
  });
});
