import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateContainerDto } from './dto/create-container.dto';
import { UpdateContainerDto } from './dto/update-container.dto';
import { DocumentsPurchasesService } from '@/modules/erp/documents-purchases/documents_purchases.service';
import { registerInternationalInvoiceInTransit } from '../international-stock';

@Injectable()
export class ContainersService {
  constructor(
    private db: PrismaService,
    private readonly purchases: DocumentsPurchasesService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private async syncTransitInvoices(tx: any, containerId: string, userId?: string) {
    const merchandiseInvoices = await tx.international_operation_documents.findMany({
      where: {
        container_id: containerId,
        expense_type: 'MERCHANDISE',
        document: {
          deleted_at: null,
          status: 2,
          document_types: { category: 'INVOICE', direction: -1 },
        },
      },
      select: { document_id: true },
    });
    let registered = 0;
    for (const relation of merchandiseInvoices) {
      if (await registerInternationalInvoiceInTransit(tx, relation.document_id, containerId, userId)) {
        registered += 1;
      }
    }
    return { invoices_found: merchandiseInvoices.length, invoices_registered: registered };
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

  async update(id: string, dto: UpdateContainerDto, userId?: string) {
    const container = await this.findOne(id);

    if (container.status === 'CLOSED' && dto.status && dto.status !== 'CLOSED') {
      throw new BadRequestException('Un contenedor cerrado no puede volver a abrirse');
    }
    if (dto.status === 'RECEIVING' || dto.status === 'DELIVERED') {
      throw new BadRequestException('Este estado se actualiza automáticamente desde el circuito de recepción');
    }
    if (dto.status === 'CLOSED') {
      if (container.status !== 'DELIVERED') {
        throw new BadRequestException('El contenedor debe estar entregado antes de cerrarlo');
      }
      const [remainingStock, draftReceipts] = await Promise.all([
        container.transit_warehouse_id
          ? this.prisma.warehouse_stock.count({
              where: { warehouse_id: container.transit_warehouse_id, deleted_at: null, quantity: { gt: 0 } },
            })
          : Promise.resolve(0),
        this.prisma.international_operation_documents.count({
          where: {
            container_id: id,
            expense_type: 'MERCHANDISE',
            document: { deleted_at: null, status: 0, document_types: { category: 'REMITO' } },
          },
        }),
      ]);
      if (remainingStock > 0 || draftReceipts > 0) {
        throw new BadRequestException('No se puede cerrar: queda stock en tránsito o hay remitos de recepción pendientes');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.international_containers.update({
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

      if (dto.status && ['SHIPPED', 'IN_TRANSIT', 'ARRIVED', 'CUSTOMS', 'RELEASED'].includes(dto.status)) {
        await this.syncTransitInvoices(tx, id, userId);
      }

      return updated;
    });
  }

  async syncTransitStock(id: string, userId?: string) {
    const container = await this.findOne(id);
    if (!['SHIPPED', 'IN_TRANSIT', 'ARRIVED', 'CUSTOMS', 'RELEASED', 'RECEIVING'].includes(container.status)) {
      throw new BadRequestException('El stock entra en tránsito cuando el contenedor está embarcado o en un estado posterior');
    }
    return this.prisma.$transaction(async (tx) => ({
      container_id: id,
      ...(await this.syncTransitInvoices(tx, id, userId)),
    }));
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
      where: { id: destinationWarehouseId, active: true, deleted_at: null, is_virtual: false },
    });
    if (!destination) throw new BadRequestException('El depósito real de destino no existe o está inactivo');

    const receiptType = await this.prisma.document_types.findFirst({
      where: { category: 'REMITO', direction: -1, active: true, deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
    if (!receiptType) throw new BadRequestException('No hay un tipo de remito de compra activo');

    const merchandiseLinks = await this.prisma.international_operation_documents.findMany({
      where: { container_id: id, expense_type: 'MERCHANDISE' },
      include: {
        document: {
          include: {
            document_types: { select: { category: true, direction: true } },
            document_items: { where: { deleted_at: null } },
          },
        },
      },
    });
    const invoices = merchandiseLinks
      .map(link => link.document)
      .filter((doc: any) => doc?.document_types?.category === 'INVOICE' && doc.status === 2);
    if (!invoices.length) {
      throw new BadRequestException('El contenedor no tiene facturas de mercadería confirmadas para recibir');
    }

    const existingReceipts = merchandiseLinks
      .map(link => link.document)
      .filter((doc: any) => doc?.document_types?.category === 'REMITO' && doc.status !== 3);
    const created: any[] = [];
    for (const invoice of invoices) {
      const prior = existingReceipts.filter((receipt: any) => receipt.parent_document_id === invoice.id);
      const plannedByProduct = new Map<string, number>();
      for (const receipt of prior) {
        for (const item of receipt.document_items ?? []) {
          if (item.product_id) plannedByProduct.set(item.product_id, (plannedByProduct.get(item.product_id) ?? 0) + Number(item.quantity));
        }
      }
      const items = (invoice.document_items ?? []).flatMap((item: any) => {
        if (!item.product_id) return [];
        const pending = Number(item.quantity) - (plannedByProduct.get(item.product_id) ?? 0);
        if (pending <= 0.0001) return [];
        return [{
          product_id: item.product_id,
          warehouse_id: destinationWarehouseId,
          quantity: pending,
          unit_price: Number(item.unit_price ?? item.price ?? 0),
          discount_percentage: Number(item.discount_percentage ?? 0),
        }];
      });
      if (!items.length) continue;

      const receipt = await this.purchases.create({
        document_type_id: receiptType.id,
        party_id: invoice.party_id ?? undefined,
        warehouse_id: destinationWarehouseId,
        date: new Date().toISOString(),
        currency_code: invoice.currency_code ?? 'ARS',
        exchange_rate: invoice.exchange_rate ? Number(invoice.exchange_rate) : undefined,
        rate_type: invoice.rate_type ?? undefined,
        parent_document_id: invoice.id,
        ref: `Recepción contenedor ${container.container_number}`,
        descrip: `Remito de recepción generado desde factura #${invoice.number}`,
        items,
      }, userId);
      await this.prisma.international_operation_documents.create({
        data: {
          operation_id: container.operation_id,
          container_id: container.id,
          document_id: receipt.id,
          expense_type: 'MERCHANDISE',
        },
      });
      created.push(receipt);
    }

    if (!created.length) {
      const drafts = existingReceipts.filter((receipt: any) => receipt.status === 0);
      if (drafts.length) {
        return { container_id: id, container_number: container.container_number, receipts: drafts, existing: true };
      }
      throw new BadRequestException('No quedan cantidades pendientes para generar un remito de recepción');
    }

    await this.prisma.international_containers.update({
      where: { id },
      data: { status: 'RECEIVING', actual_arrival_date: container.actual_arrival_date ?? new Date(), updated_at: new Date() },
    });
    return { container_id: id, container_number: container.container_number, receipts: created, existing: false };
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
