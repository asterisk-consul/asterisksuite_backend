import { Injectable, NotFoundException } from '@nestjs/common';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';

@Injectable()
export class BusinessPartiesService {
  constructor(private prisma: LogisticaPrismaService) {}

  async create(data: CreateBusinessPartyDto) {
    return this.prisma.business_parties.create({
      data,
    });
  }

  async findAll(companyId: string) {
    return this.prisma.business_parties.findMany({
      where: { company_id: companyId },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const party = await this.prisma.business_parties.findUnique({
      where: { id },
      include: {
        party_locations: {
          include: {
            locations: true,
          },
        },
      },
    });

    if (!party) throw new NotFoundException('Business party not found');

    return party;
  }

  async update(id: string, data: UpdateBusinessPartyDto) {
    await this.findOne(id);

    return this.prisma.business_parties.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.business_parties.update({
      where: { id },
      data: { active: false },
    });
  }
}
