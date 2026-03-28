import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class WarehousesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWarehouseDto) {
    return this.prisma.warehouses.create({
      data: {
        name: data.name,
        code: data.code,
        location_id: data.locationId,
        active: data.active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.warehouses.findMany({
      include: {
        locations: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const warehouse = await this.prisma.warehouses.findUnique({
      where: { id },
      include: {
        locations: true,
        warehouse_stock: true,
      },
    });

    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }

    return warehouse;
  }

  async update(id: string, data: UpdateWarehouseDto) {
    await this.findOne(id);

    return this.prisma.warehouses.update({
      where: { id },
      data: omitUndefined({
        name: data.name,
        code: data.code,
        location_id: data.locationId,
        active: data.active,
      }),
      include: {
        locations: true,
      },
    });
  }

  async desactivate(id: string) {
    await this.findOne(id);

    return this.prisma.warehouses.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }
  async active(id: string) {
    await this.findOne(id);

    return this.prisma.warehouses.update({
      where: { id },
      data: {
        active: true,
      },
    });
  }
}
