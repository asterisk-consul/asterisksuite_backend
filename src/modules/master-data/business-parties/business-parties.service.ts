import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';

@Injectable()
export class BusinessPartiesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ✅ CREATE con relaciones + auto-creación de employee/partner
  async create(data: CreateBusinessPartyDto) {
    const { locations, contacts, bank_accounts, ...partyData } = data;

    const party = await this.prisma.business_parties.create({
      data: {
        ...partyData,

        party_locations: locations
          ? {
              create: locations.map((l) => ({
                location_id: l.location_id,
                label: l.label,
              })),
            }
          : undefined,

        party_contacts: contacts
          ? {
              create: contacts.map((c) => ({
                first_name: c.first_name,
                last_name: c.last_name,
                role: c.role,
                phone: c.phone,
                email: c.email,
              })),
            }
          : undefined,

        party_bank_accounts: bank_accounts
          ? {
              create: bank_accounts.map((b) => ({
                cbu: b.cbu,
                alias: b.alias,
                bank_name: b.bank_name,
                account_type: b.account_type,
                currency: b.currency,
                description: b.description,
                holder_name: b.holder_name,
                is_default: b.is_default ?? false,
              })),
            }
          : undefined,
      },

      include: this.fullInclude(),
    });

    // Auto-crear employee o partner si el tipo lo indica
    if (party.type === 'EMPLOYEE') {
      const nameParts = party.name.split(' ');
      const firstName = nameParts[0] || party.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      await this.prisma.employees.create({
        data: {
          party_id: party.id,
          first_name: firstName,
          last_name: lastName,
          document_type: 'CUIT',
          document_number: party.tax_id,
          currency_code: 'USD',
          is_active: true,
          created_by: party.created_by,
        },
      });
    }

    if (party.type === 'PARTNER') {
      const nameParts = party.name.split(' ');
      const firstName = nameParts[0] || party.name;
      const lastName = nameParts.slice(1).join(' ') || '';

      await this.prisma.partners.create({
        data: {
          party_id: party.id,
          first_name: firstName,
          last_name: lastName,
          document_type: 'CUIT',
          document_number: party.tax_id,
          is_active: true,
          created_by: party.created_by,
        },
      });
    }

    return party;
  }

  // ✅ FIND ALL
  async findAll(type?: string) {
    return this.prisma.business_parties.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { created_at: 'desc' },
      include: this.fullInclude(),
    });
  }

  // ✅ FIND ONE
  async findOne(id: string) {
    const party = await this.prisma.business_parties.findUnique({
      where: { id },
      include: this.fullInclude(),
    });

    if (!party) throw new NotFoundException('Business party not found');

    return party;
  }

  // ✅ UPDATE (con sync de relaciones)
  async update(id: string, data: UpdateBusinessPartyDto) {
    await this.findOne(id);

    const { locations, contacts, bank_accounts, ...partyData } = data;

    return this.prisma.business_parties.update({
      where: { id },
      data: {
        ...partyData,

        // 🔥 LOCATIONS sync
        party_locations: locations
          ? {
              deleteMany: {},
              create: locations.map((l) => ({
                location_id: l.location_id,
                label: l.label,
              })),
            }
          : undefined,

        // 🔥 CONTACTS sync
        party_contacts: contacts
          ? {
              deleteMany: {},
              create: contacts.map((c) => ({
                first_name: c.first_name,
                last_name: c.last_name,
                role: c.role,
                phone: c.phone,
                email: c.email,
              })),
            }
          : undefined,

        // 🔥 BANK ACCOUNTS sync
        party_bank_accounts: bank_accounts
          ? {
              deleteMany: {},
              create: bank_accounts.map((b) => ({
                cbu: b.cbu,
                alias: b.alias,
                bank_name: b.bank_name,
                account_type: b.account_type,
                currency: b.currency,
                description: b.description,
                holder_name: b.holder_name,
                is_default: b.is_default ?? false,
              })),
            }
          : undefined,
      },

      include: this.fullInclude(),
    });
  }

  // ✅ SOFT DELETE
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.business_parties.update({
      where: { id },
      data: { active: false },
    });
  }

  // 🔥 INCLUDE CENTRALIZADO (clave para frontend)
  private fullInclude() {
    return {
      party_locations: {
        include: {
          locations: true,
        },
      },
      party_contacts: true,
      party_bank_accounts: true,
    };
  }
}
