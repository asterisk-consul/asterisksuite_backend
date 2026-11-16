jest.mock('@/prisma/prisma.service', () => ({ PrismaService: class {} }));
jest.mock('@/generated/prisma/client', () => ({
  Prisma: { sql: (strings: TemplateStringsArray, ...values: unknown[]) => ({ strings, values }) },
  PartyType: {
    CUSTOMER: 'CUSTOMER', SUPPLIER: 'SUPPLIER', EMPLOYEE: 'EMPLOYEE', PARTNER: 'PARTNER',
    TAX_AUTHORITY: 'TAX_AUTHORITY', UTILITY: 'UTILITY', FINANCIAL: 'FINANCIAL', SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  },
}));

import { BusinessPartiesService } from './business-parties.service';

describe('Identidad de partes interesadas', () => {
  const makeService = () => {
    const client = {
      $queryRaw: jest.fn().mockResolvedValue([]),
      business_parties: { create: jest.fn(), update: jest.fn() },
      business_party_roles: { upsert: jest.fn() },
    };
    const db = { getClientForCurrentContext: () => client };
    const service = new BusinessPartiesService(db as any);
    return { client, service };
  };

  it('guarda un ente impositivo sin tipo ni número de documento', async () => {
    const { client, service } = makeService();
    const party = { id: 'party-id', type: 'TAX_AUTHORITY', name: 'ARCA', active: true };
    client.business_parties.create.mockResolvedValue(party);
    jest.spyOn(service, 'findOne').mockResolvedValue(party as any);

    await service.create({ type: 'TAX_AUTHORITY', name: '  ARCA  ', active: true } as any);

    expect(client.business_parties.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ name: 'ARCA', document_type: null, tax_id: null }),
    }));
    expect(client.$queryRaw).toHaveBeenCalledTimes(1);
  });

  it('rechaza un nombre repetido aunque no haya documento', async () => {
    const { client, service } = makeService();
    client.$queryRaw.mockResolvedValueOnce([{ name: 'ARCA' }]);

    await expect(service.create({ type: 'TAX_AUTHORITY', name: 'arca', active: true } as any))
      .rejects.toThrow('mismo nombre');
    expect(client.business_parties.create).not.toHaveBeenCalled();
  });

  it('sigue validando el formato del documento de un cliente', async () => {
    const { client, service } = makeService();

    await expect(service.create({ type: 'CUSTOMER', name: 'Cliente nuevo', document_type: 'CUIT', tax_id: '123', active: true } as any))
      .rejects.toThrow('11 dígitos');
    expect(client.business_parties.create).not.toHaveBeenCalled();
  });

  it('rechaza renombrar una ficha con el nombre de otra', async () => {
    const { client, service } = makeService();
    jest.spyOn(service, 'findOne').mockResolvedValue({ id: 'party-id', type: 'TAX_AUTHORITY', name: 'ARCA', tax_id: null, document_type: null } as any);
    client.$queryRaw.mockResolvedValueOnce([{ name: 'AFIP' }]);

    await expect(service.update('party-id', { name: 'afip' } as any)).rejects.toThrow('mismo nombre');
    expect(client.business_parties.update).not.toHaveBeenCalled();
  });
});
