import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';

@Injectable()
export class BusinessPartiesService {
  constructor(private prisma: PrismaService) {}

  // ✅ CREATE con relaciones
  async create(data: CreateBusinessPartyDto) {
    const { locations, contacts, ...partyData } = data;

    return this.prisma.business_parties.create({
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
      },

      include: this.fullInclude(),
    });
  }

  // ✅ FIND ALL
  async findAll(companyId: string) {
    return this.prisma.business_parties.findMany({
      where: {
        company_id: companyId,
        active: true,
      },
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

    const { locations, contacts, ...partyData } = data;

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
    };
  }
}
