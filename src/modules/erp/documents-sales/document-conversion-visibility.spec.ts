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

  beforeEach(() => {
    source = {
      id: 'source', created_by: 'another-user', status: 2, number: 1,
      party_id: 'customer', currency_code: 'ARS', document_types: { direction: 1 },
      document_items: [{ id: 'item', product_id: 'product', quantity: 2, unit_price: 10, price: 20 }],
    };
    prisma = {
      document_types: { findFirst: jest.fn().mockResolvedValue({ id: 'target-type' }) },
      documents: {
        create: jest.fn(async ({ data }) => { saved = { ...data, id: 'child', assigned_to: null }; return saved; }),
        update: jest.fn(),
        findMany: jest.fn().mockResolvedValue([]),
      },
      document_items: { update: jest.fn(), findMany: jest.fn().mockResolvedValue(source.document_items) },
      $transaction: jest.fn(async callback => callback(prisma)),
    };
    service = new DocumentsSalesService(
      { getClientForCurrentContext: () => prisma } as any,
      { calculate: () => ({ subtotal: 20, exempt_amount: 0, taxable_base: 20, total_taxes: 0, total: 20 }) } as any,
      {} as any, {} as any, {} as any, {} as any, {} as any, {} as any, {} as any,
    );
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
});
