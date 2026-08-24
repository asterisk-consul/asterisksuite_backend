import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';

@Injectable()
export class ContainersService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(operationId: string, dto: CreateContainerDto) {
    const operation = await this.prisma.international_operations.findFirst({
      where: { id: operationId, deleted_at: null },
    });
    if (!operation) throw new NotFoundException('Operación no encontrada');

    return this.prisma.international_containers.create({
      data: {
        operation_id: operationId,
        container_number: dto.container_number,
        container_type: dto.container_type ?? 'TWENTY_DV',
        seal_number: dto.seal_number,
        booking_number: dto.booking_number,
        bill_of_lading: dto.bill_of_lading,
        vessel_name: dto.vessel_name,
        voyage_number: dto.voyage_number,
        origin_port: dto.origin_port,
        origin_port_id: dto.origin_port_id,
        destination_port: dto.destination_port,
        destination_port_id: dto.destination_port_id,
        estimated_departure_date: dto.estimated_departure_date
          ? new Date(dto.estimated_departure_date)
          : null,
        estimated_arrival_date: dto.estimated_arrival_date
          ? new Date(dto.estimated_arrival_date)
          : null,
        weight: dto.weight ? parseFloat(dto.weight) : null,
        volume: dto.volume ? parseFloat(dto.volume) : null,
        notes: dto.notes,
      },
      include: { events: true },
    });
  }

  async findAll(operationId: string) {
    return this.prisma.international_containers.findMany({
      where: { operation_id: operationId, deleted_at: null },
      include: {
        events: { orderBy: { event_date: 'asc' } },
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async findOne(id: string) {
    const container = await this.prisma.international_containers.findFirst({
      where: { id, deleted_at: null },
      include: {
        events: { orderBy: { event_date: 'asc' } },
        operation: { select: { id: true, number: true, name: true } },
        origin_port_loc: true,
        destination_port_loc: true,
      },
    });
    if (!container) throw new NotFoundException('Contenedor no encontrado');
    return container;
  }

  async update(id: string, dto: UpdateContainerDto) {
    await this.findOne(id);

    return this.prisma.international_containers.update({
      where: { id },
      data: {
        ...(dto.container_number && { container_number: dto.container_number }),
        ...(dto.container_type && { container_type: dto.container_type }),
        ...(dto.seal_number !== undefined && { seal_number: dto.seal_number }),
        ...(dto.booking_number !== undefined && { booking_number: dto.booking_number }),
        ...(dto.bill_of_lading !== undefined && { bill_of_lading: dto.bill_of_lading }),
        ...(dto.vessel_name !== undefined && { vessel_name: dto.vessel_name }),
        ...(dto.voyage_number !== undefined && { voyage_number: dto.voyage_number }),
        ...(dto.origin_port !== undefined && { origin_port: dto.origin_port }),
        ...(dto.origin_port_id !== undefined && { origin_port_id: dto.origin_port_id }),
        ...(dto.destination_port !== undefined && { destination_port: dto.destination_port }),
        ...(dto.destination_port_id !== undefined && { destination_port_id: dto.destination_port_id }),
        ...(dto.estimated_departure_date !== undefined && {
          estimated_departure_date: dto.estimated_departure_date
            ? new Date(dto.estimated_departure_date)
            : null,
        }),
        ...(dto.actual_departure_date !== undefined && {
          actual_departure_date: dto.actual_departure_date
            ? new Date(dto.actual_departure_date)
            : null,
        }),
        ...(dto.estimated_arrival_date !== undefined && {
          estimated_arrival_date: dto.estimated_arrival_date
            ? new Date(dto.estimated_arrival_date)
            : null,
        }),
        ...(dto.actual_arrival_date !== undefined && {
          actual_arrival_date: dto.actual_arrival_date
            ? new Date(dto.actual_arrival_date)
            : null,
        }),
        ...(dto.status && { status: dto.status }),
        ...(dto.weight !== undefined && { weight: dto.weight ? parseFloat(dto.weight) : null }),
        ...(dto.volume !== undefined && { volume: dto.volume ? parseFloat(dto.volume) : null }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: { events: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.international_containers.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
