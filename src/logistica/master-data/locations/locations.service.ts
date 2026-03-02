import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

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
      data: {
        address: dto.address || undefined,
        city: dto.city,
        province: dto.province,
        country: dto.country,
        postal_code: dto.postalCode,
        latitude: dto.latitude || undefined,
        longitude: dto.longitude || undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.locations.delete({
      where: { id },
    });
  }
}
