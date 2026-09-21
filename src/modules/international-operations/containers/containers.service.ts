import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

    // Crear almacén virtual "En Tránsito" para este contenedor
    const sanitized = (dto.container_number ?? 'SN')
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    let code = `TR-${sanitized}`;
    let counter = 1;
    while (
      await this.prisma.warehouses.findFirst({ where: { code, deleted_at: null } })
    ) {
      counter += 1;
      code = `TR-${sanitized}-${counter}`;
    }
    const transitWarehouse = await this.prisma.warehouses.create({
      data: {
        name: `EN-TRÁNSITO-${dto.container_number ?? code}`,
        code,
        active: true,
        is_virtual: true,
      },
    });

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
        transit_warehouse_id: transitWarehouse.id,
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
        container_documents: {
          include: {
            document: {
              include: {
                document_items: {
                  where: { deleted_at: null },
                  include: {
                    products: { select: { id: true, name: true, sku: true } },
                  },
                },
                document_types: { select: { code: true, description: true, category: true } },
              },
            },
          },
        },
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

  async deliver(id: string, destinationWarehouseId: string, userId?: string) {
    const container = await this.findOne(id);

    if (!container.transit_warehouse_id) {
      throw new BadRequestException(
        `El contenedor ${container.container_number ?? id} no tiene almacén de tránsito asociado`,
      );
    }
    if (container.transit_warehouse_id === destinationWarehouseId) {
      throw new BadRequestException('El almacén de destino debe ser distinto al almacén de tránsito');
    }

    const destination = await this.prisma.warehouses.findFirst({
      where: { id: destinationWarehouseId, active: true, deleted_at: null },
    });
    if (!destination) {
      throw new BadRequestException('El depósito de destino no existe o está inactivo');
    }

    const transitStock = await this.prisma.warehouse_stock.findMany({
      where: {
        warehouse_id: container.transit_warehouse_id,
        deleted_at: null,
        quantity: { gt: 0 },
      },
      select: { product_id: true, quantity: true },
    });

    if (!transitStock.length) {
      throw new BadRequestException('No hay stock en tránsito para transferir');
    }

    const moved: { product_id: string; quantity: string }[] = [];
    for (const row of transitStock) {
      const qty = row.quantity;
      await this.prisma.warehouse_stock_movements.create({
        data: {
          warehouse_id: container.transit_warehouse_id,
          product_id: row.product_id,
          movement_type: 'TRANSIT_TRANSFER',
          direction: 'OUT',
          quantity: qty,
          reference_type: 'container_deliver',
          reference_id: container.id,
          notes: `Entrega contenedor ${container.container_number ?? ''} → ${destination.name}`,
          created_by: userId,
        },
      });
      await this.prisma.warehouse_stock.updateMany({
        where: { warehouse_id: container.transit_warehouse_id, product_id: row.product_id },
        data: { quantity: { decrement: qty }, updated_at: new Date() },
      });
      await this.prisma.warehouse_stock_movements.create({
        data: {
          warehouse_id: destinationWarehouseId,
          product_id: row.product_id,
          movement_type: 'TRANSIT_TRANSFER',
          direction: 'IN',
          quantity: qty,
          reference_type: 'container_deliver',
          reference_id: container.id,
          notes: `Entrega contenedor ${container.container_number ?? ''} desde tránsito`,
          created_by: userId,
        },
      });
      await this.prisma.warehouse_stock.upsert({
        where: {
          warehouse_id_product_id: {
            warehouse_id: destinationWarehouseId,
            product_id: row.product_id,
          },
        },
        create: { warehouse_id: destinationWarehouseId, product_id: row.product_id, quantity: qty },
        update: { quantity: { increment: qty }, updated_at: new Date() },
      });
      moved.push({ product_id: row.product_id, quantity: qty.toString() });
    }

    await this.prisma.international_containers.update({
      where: { id },
      data: { status: 'DELIVERED' },
    });

    return {
      container_id: container.id,
      container_number: container.container_number,
      destination_warehouse_id: destinationWarehouseId,
      destination_warehouse_name: destination.name,
      moved,
    };
  }

  async remove(id: string) {
    const container = await this.findOne(id);

    const docsCount = await this.prisma.international_operation_documents.count({
      where: { container_id: id },
    });
    const paysCount = await this.prisma.international_operation_payments.count({
      where: { container_id: id },
    });

    if (docsCount > 0 || paysCount > 0) {
      throw new BadRequestException(
        `No se puede eliminar el contenedor ${container.container_number}: tiene ${docsCount} documento(s) y ${paysCount} pago(s) asociado(s). Desasocialos primero.`,
      );
    }

    return this.prisma.international_containers.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
