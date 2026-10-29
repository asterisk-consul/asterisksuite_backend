import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class LocationsService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateLocationDto) {
    return this.prisma.locations.create({
      data: {
        address: dto.address,
        city: dto.city,
        province: dto.province,
        country: dto.country,
        postal_code: dto.postalCode,
        latitude: dto.latitude,
        longitude: dto.longitude,
      },
    });
  }

  async findAll() {
    return this.prisma.locations.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async search(query = '', requestedLimit = 30) {
    const term = query.trim().slice(0, 120);
    const take = Math.min(Math.max(Math.trunc(requestedLimit) || 30, 1), 50);

    return this.prisma.locations.findMany({
      where: term
        ? {
            OR: [
              { address: { contains: term, mode: 'insensitive' } },
              { city: { contains: term, mode: 'insensitive' } },
              { province: { contains: term, mode: 'insensitive' } },
              { country: { contains: term, mode: 'insensitive' } },
              { postal_code: { contains: term, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: [{ city: 'asc' }, { address: 'asc' }],
      take,
      select: {
        id: true,
        address: true,
        city: true,
        province: true,
        country: true,
        postal_code: true,
      },
    });
  }

  async findOne(id: string) {
    const location = await this.prisma.locations.findUnique({
      where: { id },
      include: {
        warehouses: true,
      },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    return location;
  }

  async update(id: string, dto: UpdateLocationDto) {
    await this.findOne(id);

    return this.prisma.locations.update({
      where: { id },
      data: omitUndefined({
        address: dto.address || undefined,
        city: dto.city,
        province: dto.province,
        country: dto.country,
        postal_code: dto.postalCode,
        latitude: dto.latitude || undefined,
        longitude: dto.longitude || undefined,
      }),
    });
  }

  // async activate(id: string) {
  //   await this.findOne(id);

  //   return this.prisma.locations.update({
  //     where: { id },
  //     data: {
  //       active: true,
  //     },
  //   });
  // }

  // async deactivate(id: string) {
  //   await this.findOne(id);

  //   return this.prisma.locations.update({
  //     where: { id },
  //     data: {
  //       active: false,
  //     },
  //   });
  // }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.locations.delete({
      where: { id },
    });
  }
}
