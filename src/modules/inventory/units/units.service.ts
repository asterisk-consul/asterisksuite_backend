import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@Injectable()
export class UnitsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUnitDto) {
    const existing = await this.prisma.units.findFirst({
      where: {
        OR: [{ name: data.name.trim() }, { symbol: data.symbol.trim() }],
      },
    });

    if (existing) {
      throw new ConflictException(
        'Ya existe una unidad con ese nombre o símbolo',
      );
    }

    return this.prisma.units.create({
      data: {
        name: data.name.trim(),
        symbol: data.symbol.trim(),
        unit_type: data.unit_type,
        active: data.active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.units.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const unit = await this.prisma.units.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!unit) {
      throw new NotFoundException('Unidad no encontrada');
    }

    return unit;
  }

  async update(id: string, data: UpdateUnitDto) {
    await this.findOne(id);

    if (data.name || data.symbol) {
      const existing = await this.prisma.units.findFirst({
        where: {
          OR: [
            data.name ? { name: data.name.trim() } : undefined,

            data.symbol ? { symbol: data.symbol.trim() } : undefined,
          ].filter(Boolean) as any,

          NOT: {
            id,
          },
        },
      });

      if (existing) {
        throw new ConflictException(
          'Ya existe otra unidad con ese nombre o símbolo',
        );
      }
    }

    return this.prisma.units.update({
      where: { id },
      data: {
        ...data,
        name: data.name?.trim(),
        symbol: data.symbol?.trim(),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.units.update({
      where: { id },
      data: {
        active: false,
        deleted_at: new Date(),
      },
    });
  }
}
