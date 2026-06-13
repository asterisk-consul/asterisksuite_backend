import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePartyContactDto } from './dto/create-party-contact.dto';
import { UpdatePartyContactDto } from './dto/update-party-contact.dto';

@Injectable()
export class PartyContactsService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreatePartyContactDto) {
    return this.prisma.party_contacts.create({
      data: dto,
    });
  }

  async findAll(party_id?: string) {
    return this.prisma.party_contacts.findMany({
      where: party_id ? { party_id } : undefined,
      orderBy: { created_at: 'desc' },
      include: {
        business_parties: true,
      },
    });
  }

  async findOne(id: string) {
    const contact = await this.prisma.party_contacts.findUnique({
      where: { id },
      include: {
        business_parties: true,
      },
    });

    if (!contact) {
      throw new NotFoundException(`PartyContact with id "${id}" not found`);
    }

    return contact;
  }

  async update(id: string, dto: UpdatePartyContactDto) {
    await this.findOne(id); // ensure exists

    return this.prisma.party_contacts.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id); // ensure exists

    return this.prisma.party_contacts.delete({
      where: { id },
    });
  }
}
