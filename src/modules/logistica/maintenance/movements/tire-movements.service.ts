import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTireMovementDto } from './dto/movement.dto';
import { FilterTireMovementsDto } from './dto/movement.dto';

@Injectable()
export class TireMovementsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll(filters: FilterTireMovementsDto) {
    const { tire_id, vehicle_id, movement_type, date_from, date_to, page = 1, limit = 50 } = filters;

    const where: any = { deleted_at: null };
    if (tire_id) where.tire_id = tire_id;
    if (vehicle_id) where.vehicle_id = vehicle_id;
    if (movement_type) where.movement_type = movement_type;
    if (date_from || date_to) {
      where.date = {};
      if (date_from) where.date.gte = new Date(date_from);
      if (date_to) where.date.lte = new Date(date_to);
    }

    const [data, total] = await Promise.all([
      this.prisma.tire_movements.findMany({
        where,
        include: {
          tire: { select: { id: true, serial_number: true, product: { select: { name: true } } } },
          vehicle: { select: { id: true, plate: true } },
          position: { select: { id: true, position_number: true, axle: true, side: true } },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.tire_movements.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByTire(tireId: string) {
    return this.prisma.tire_movements.findMany({
      where: { tire_id: tireId, deleted_at: null },
      include: {
        vehicle: { select: { id: true, plate: true } },
        position: { select: { id: true, position_number: true, axle: true, side: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async create(dto: CreateTireMovementDto, userId: string) {
    return this.prisma.tire_movements.create({
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : new Date(),
        odometer: dto.odometer ? Number(dto.odometer) : null,
        created_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    const movement = await this.prisma.tire_movements.findFirst({ where: { id, deleted_at: null } });
    if (!movement) throw new NotFoundException('Movimiento no encontrado');

    return this.prisma.tire_movements.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }
}
