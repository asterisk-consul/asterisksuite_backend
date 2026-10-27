import { DocumentsPurchasesService } from './documents_purchases.service';

jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('@/generated/prisma/client', () => ({ Prisma: {} }));
jest.mock('../documents/dto/create-document.dto', () => ({ CreateDocumentDto: class {} }));
jest.mock('../documents/dto/update-document.dto', () => ({ UpdateDocumentDto: class {} }));

describe('Purchase document visibility', () => {
  it('shows assigned documents and unassigned documents created by the user', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = Object.create(DocumentsPurchasesService.prototype) as DocumentsPurchasesService;
    Object.defineProperty(service, 'db', { value: { getClientForCurrentContext: () => ({ documents: { findMany } }) } });

    await service.findAll(undefined, undefined, undefined, -1, 'buyer-user');

    expect(findMany.mock.calls[0][0].where.OR).toEqual([
      { assigned_to: 'buyer-user' },
      { assigned_to: null, created_by: 'buyer-user' },
    ]);
  });

  it('does not restrict administrators by creator or assignee', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = Object.create(DocumentsPurchasesService.prototype) as DocumentsPurchasesService;
    Object.defineProperty(service, 'db', { value: { getClientForCurrentContext: () => ({ documents: { findMany } }) } });

    await service.findAll(undefined, undefined, undefined, -1);

    expect(findMany.mock.calls[0][0].where.OR).toBeUndefined();
  });

  it('uses purchase cancellation states when hiding cancelled documents', async () => {
    const findMany = jest.fn().mockResolvedValue([]);
    const service = Object.create(DocumentsPurchasesService.prototype) as DocumentsPurchasesService;
    Object.defineProperty(service, 'db', { value: { getClientForCurrentContext: () => ({ documents: { findMany } }) } });

    await service.findAll(undefined, undefined, ['ORDER', 'REMITO', 'INVOICE'], -1, undefined, false, undefined, undefined, undefined, undefined, undefined, true);

    expect(findMany.mock.calls[0][0].where.AND).toEqual([
      { NOT: { document_types: { category: 'ORDER' }, status: 3 } },
      { NOT: { document_types: { category: 'REMITO' }, status: 3 } },
      { NOT: { document_types: { category: 'INVOICE' }, status: 3 } },
    ]);
  });
});
