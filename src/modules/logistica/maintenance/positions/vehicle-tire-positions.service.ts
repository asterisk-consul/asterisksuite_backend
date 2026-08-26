import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVehicleTirePositionDto } from './dto/position.dto';
import { UpdateVehicleTirePositionDto } from './dto/position.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class VehicleTirePositionsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findByVehicle(vehicleId: string) {
    return this.prisma.vehicle_tire_positions.findMany({
      where: { vehicle_id: vehicleId, deleted_at: null },
      orderBy: { position_number: 'asc' },
      include: {
        tires: {
          where: { status: 'INSTALLED', deleted_at: null },
          select: { id: true, serial_number: true, product: { select: { name: true } } },
        },
      },
    });
  }

  async findOne(id: string) {
    const position = await this.prisma.vehicle_tire_positions.findFirst({
      where: { id, deleted_at: null },
      include: {
        vehicle: { select: { id: true, plate: true, brand: true, model: true } },
        tires: {
          where: { status: 'INSTALLED', deleted_at: null },
          select: { id: true, serial_number: true, product: { select: { name: true } } },
        },
      },
    });
    if (!position) throw new NotFoundException('Posición no encontrada');
    return position;
  }

  async create(dto: CreateVehicleTirePositionDto, userId: string) {
    const vehicle = await this.prisma.vehicles.findFirst({
      where: { id: dto.vehicle_id, deleted_at: null },
    });
    if (!vehicle) throw new BadRequestException('Vehículo no encontrado');

    const existing = await this.prisma.vehicle_tire_positions.findFirst({
      where: { vehicle_id: dto.vehicle_id, position_number: dto.position_number, deleted_at: null },
    });
    if (existing) throw new BadRequestException(`La posición ${dto.position_number} ya existe para este vehículo`);

    return this.prisma.vehicle_tire_positions.create({
      data: { ...dto, created_by: userId },
    });
  }

  async update(id: string, dto: UpdateVehicleTirePositionDto, userId: string) {
    await this.findOne(id);

    if (dto.position_number) {
      const existing = await this.prisma.vehicle_tire_positions.findFirst({
        where: { vehicle_id: (await this.findOne(id)).vehicle_id, position_number: dto.position_number, deleted_at: null, id: { not: id } },
      });
      if (existing) throw new BadRequestException(`La posición ${dto.position_number} ya existe para este vehículo`);
    }

    return this.prisma.vehicle_tire_positions.update({
      where: { id },
      data: omitUndefined({ ...dto, updated_by: userId }),
    });
  }

  async remove(id: string, userId: string) {
    const position = await this.findOne(id);

    const occupied = await this.prisma.tires.findFirst({
      where: { current_position_id: id, status: 'INSTALLED', deleted_at: null },
    });
    if (occupied) throw new BadRequestException('No se puede eliminar una posición ocupada');

    return this.prisma.vehicle_tire_positions.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    });
  }
}
