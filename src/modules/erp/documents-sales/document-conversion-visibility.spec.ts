import { DocumentsSalesService } from './documents_sales.services';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('@/generated/prisma/client', () => ({ Prisma: {} }));
jest.mock('../documents/dto/create-document.dto', () => ({ CreateDocumentDto: class {} }));
jest.mock('../documents/dto/update-document.dto', () => ({ UpdateDocumentDto: class {} }));
jest.mock('./documents-sales-totals.service', () => ({ DocumentsSalesTotalsService: class {} }));
jest.mock('../current-accounts/current-accounts.service', () => ({ CurrentAccountsService: class {} }));
jest.mock('../tax-engine/services/tax-resolution.service', () => ({ TaxResolutionService: class {} }));
jest.mock('../tax-engine/services/tax-calculation.service', () => ({ TaxCalculationService: class {} }));
jest.mock('../currencies/currency-conversion.service', () => ({ CurrencyConversionService: class {} }));
jest.mock('@/common/services/fiscal-validation.service', () => ({ FiscalValidationService: class {} }));
jest.mock('../pricing/product-party-pricing/product-party-pricing.service', () => ({ ProductPartyPricingService: class {} }));

describe('Creator visibility after sales document conversion', () => {
  const actor = 'seller-user';
  let service: DocumentsSalesService;
  let prisma: any;
  let source: any;
  let saved: any;
  let taxResolution: any;
  let taxCalculation: any;

  beforeEach(() => {
    source = {
      id: 'source', created_by: 'another-user', status: 2, number: 1,
      party_id: 'customer', currency_code: 'ARS', document_types: { direction: 1 },
      document_items: [{ id: 'item', product_id: 'product', quantity: 2, unit_price: 10, price: 20 }],
    };
    prisma = {
      document_types: { findFirst: jest.fn().mockResolvedValue({
        id: 'target-type',
        category: 'INVOICE',
        direction: 1,
        letter_type: 'A',
        calculates_taxes: true,
        document_sequences: null,
      }) },
      documents: {
        create: jest.fn(async ({ data }) => { saved = { ...data, id: 'child', assigned_to: null }; return saved; }),
        update: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      document_items: { update: jest.fn(), findMany: jest.fn().mockResolvedValue(source.document_items) },
      document_taxes: { createMany: jest.fn() },
      $transaction: jest.fn(async callback => callback(prisma)),
    };
    taxResolution = {
      resolve: jest.fn().mockResolvedValue({ productTaxes: new Map(), operationTaxes: [], settings: {} }),
    };
    taxCalculation = {
      calculateWithCommercialAdjustments: jest.fn().mockReturnValue({
        calculation: {
          document: {
            items: [{
              productId: 'product', quantity: 1, unitPrice: 10, price: 10,
              exemptAmount: 0, taxableBase: 10, totalTaxes: 2.1, total: 12.1,
              taxes: [{ tax_id: 'vat', rate: 21, amount: 2.1, taxableBase: 10, isIncludedInPrice: false }],
            }],
            documentTaxes: [{ tax_id: 'vat', rate: 21, taxableBase: 10, amount: 2.1 }],
            subtotal: 10, exemptAmount: 0, taxableBase: 10, totalTaxes: 2.1, total: 12.1,
          },
        },
        adjustments: [],
        originalSubtotal: 10,
      }),
    };
    service = new DocumentsSalesService(
      { getClientForCurrentContext: () => prisma } as any,
      { calculate: () => ({ subtotal: 20, exempt_amount: 0, taxable_base: 20, total_taxes: 0, total: 20 }) } as any,
      {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any,
    );
    (service as any).commercialFlow = { createForOrder: jest.fn(), inheritFromParent: jest.fn() };
    (service as any).taxResolution = taxResolution;
    (service as any).taxCalculation = taxCalculation;
    (service as any).conversionService = { getBaseCurrency: jest.fn().mockResolvedValue({ code: 'ARS' }) };
    (service as any).fiscalValidation = { resolveFiscalContext: jest.fn().mockResolvedValue({}) };
    jest.spyOn(service, 'findOne').mockImplementation(async id => id === 'source' ? source : saved);
    jest.spyOn(service as any, 'resolveSequence').mockResolvedValue(null);
    jest.spyOn(service as any, 'getNextNumber').mockResolvedValue(2);
    jest.spyOn(service as any, 'persistItems').mockResolvedValue(undefined);
  });

  it.each(['accept', 'deliver', 'partialDeliver', 'partialInvoice'] as const)(
    '%s preserves the authenticated creator needed by the seller list', async method => {
      const result = method === 'accept' || method === 'deliver'
        ? await service[method]('source', actor)
        : await service[method]('source', [{ document_item_id: 'item', quantity: 1 }], actor);

      expect(result.created_by).toBe(actor);
      expect(result.parent_document_id).toBe(source.id);
      expect(source.created_by).toBe('another-user');

      // Exercise the real list method: the generated row must satisfy its ownership clause.
      await service.findAll(undefined, undefined, undefined, 1, actor);
      const filter = prisma.documents.findMany.mock.calls[0][0].where;
      expect(filter.OR.some((clause: Record<string, unknown>) =>
        Object.entries(clause).every(([key, value]) => result[key] === value),
      )).toBe(true);

      await service.findAll(undefined, undefined, undefined, 1, 'different-seller');
      const otherFilter = prisma.documents.findMany.mock.calls[1][0].where;
      expect(otherFilter.OR.some((clause: Record<string, unknown>) =>
        Object.entries(clause).every(([key, value]) => result[key] === value),
      )).toBe(false);

      await service.findAll(undefined, undefined, undefined, 1);
      expect(prisma.documents.findMany.mock.calls[2][0].where.OR).toBeUndefined();
    },
  );

  it('transfers commercial adjustments and prorates fixed amounts for partial documents', () => {
    const sourceWithAdjustment = {
      document_items: [{ quantity: 2, original_unit_price: 100, discount_percentage: 0 }],
      commercial_adjustments: [{
        concept: 'Bonificación', value_type: 'AMOUNT', basis: 'NET', value: 20,
        base_amount: 200, calculated_amount: 20, net_discount: 20, tax_reduction: 0, total_reduction: 20,
      }],
    };

    const carried = (service as any).carryCommercialAdjustments(sourceWithAdjustment, { accepts_commercial_adjustments: true }, [
      { quantity: 1, original_unit_price: 100, unit_price: 100 } as any,
    ]);

    expect(carried.adjustments[0].value).toBe(10);
    expect(carried.adjustments[0].total_reduction).toBe(10);
    expect(carried.totalReduction).toBe(10);
  });

  it('does not silently drop adjustments when the destination type rejects them', () => {
    const sourceWithAdjustment = {
      document_items: [{ quantity: 1, original_unit_price: 100 }],
      commercial_adjustments: [{ concept: 'Bonificación', value_type: 'PERCENTAGE', value: 10 }],
    };

    expect(() => (service as any).carryCommercialAdjustments(
      sourceWithAdjustment,
      { accepts_commercial_adjustments: false },
      [{ quantity: 1, original_unit_price: 100, unit_price: 100 }],
    )).toThrow('El documento de destino no acepta los conceptos comerciales');
  });

  it('recalculates taxes with the invoice document type when invoicing an order', async () => {
    await service.partialInvoice('source', [{ document_item_id: 'item', quantity: 1 }], actor);

    expect(taxResolution.resolve).toHaveBeenCalledWith(expect.objectContaining({
      documentTypeId: 'target-type',
      operationType: 'SALE',
    }));
    expect(prisma.documents.create.mock.calls[0][0].data.total_taxes).toBe(2.1);
    expect(prisma.documents.create.mock.calls[0][0].data.total).toBe(12.1);
    expect(prisma.document_taxes.createMany).toHaveBeenCalledWith({
      data: [expect.objectContaining({ tax_id: 'vat', tax_amount: 2.1, is_manual: false })],
    });
  });

  it('excludes only the cancellation status that belongs to each sales category', async () => {
    await service.findAll(undefined, undefined, ['QUOTE', 'ORDER', 'REMITO'], 1, undefined, undefined, false, undefined, undefined, undefined, undefined, undefined, true);

    expect(prisma.documents.findMany.mock.calls[0][0].where.AND).toEqual([
      { NOT: { document_types: { category: 'QUOTE' }, status: 6 } },
      { NOT: { document_types: { category: 'ORDER' }, status: 8 } },
      { NOT: { document_types: { category: 'REMITO' }, status: 3 } },
    ]);
  });
});
