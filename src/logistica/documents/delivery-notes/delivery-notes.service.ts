import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { QueryDeliveryNoteDto } from './dto/query-delivery-note.dto';
import { DocumentSequencesService } from '../document-sequences/document-sequences.service';

@Injectable()
export class DeliveryNotesService {
  constructor(
    private readonly prisma: LogisticaPrismaService,
    private readonly sequences: DocumentSequencesService,
  ) {}

  async create(dto: CreateDeliveryNoteDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const number = await this.sequences.getNextNumber(
        tx,
        dto.companyId,
        'DELIVERY_NOTE',
        dto.pointOfSale,
      );

      const deliveryNote = await tx.delivery_notes.create({
        data: {
          company_id: dto.companyId,
          type: dto.type,
          number,
          status: 'DRAFT',
          party_id: dto.partyId,
          trip_id: dto.tripId,
          created_by: userId,
        },
      });

      // 🔗 Integración automática con picking
      if (dto.pickingOrderId) {
        await tx.picking_orders.update({
          where: { id: dto.pickingOrderId },
          data: {
            delivery_note_id: deliveryNote.id,
            status: 'ASSIGNED',
          },
        });
      }

      return deliveryNote;
    });
  }

  async findAll(query: QueryDeliveryNoteDto) {
    return this.prisma.delivery_notes.findMany({
      where: {
        deleted_at: null,
        company_id: query.company_id,
        status: query.status,
        type: query.type,
        number: query.number
          ? { contains: query.number, mode: 'insensitive' }
          : undefined,
      },
      include: {
        business_parties: true,
        trips: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const note = await this.prisma.delivery_notes.findFirst({
      where: { id, deleted_at: null },
      include: {
        business_parties: true,
        trips: true,
        picking_orders: true,
        trip_cargo: true,
      },
    });

    if (!note) throw new NotFoundException('Delivery note not found');
    return note;
  }

  async update(id: string, dto: UpdateDeliveryNoteDto) {
    await this.findOne(id);

    return this.prisma.delivery_notes.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.delivery_notes.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        status: 'CANCELLED',
      },
    });
  }

  async confirm(id: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const note = await tx.delivery_notes.findUnique({
        where: { id },
        include: {
          picking_orders: {
            include: {
              picking_items: true,
            },
          },
        },
      });

      if (!note) throw new BadRequestException('Remito no encontrado');
      if (note.status !== 'DRAFT')
        throw new BadRequestException(
          'Solo se puede confirmar en estado DRAFT',
        );

      // Si tiene picking asociado → generar movimientos
      if (note.picking_orders.length > 0) {
        const picking = note.picking_orders[0];

        for (const item of picking.picking_items) {
          await tx.warehouse_stock_movements.create({
            data: {
              warehouse_id: picking.warehouse_id,
              product_id: item.product_id,
              movement_type: 'DELIVERY_NOTE',
              direction: 'OUT',
              quantity: item.quantity_required,
              reference_type: 'DELIVERY_NOTE',
              reference_id: note.id,
              created_by: userId,
            },
          });

          await tx.warehouse_stock.update({
            where: {
              warehouse_id_product_id: {
                warehouse_id: picking.warehouse_id,
                product_id: item.product_id,
              },
            },
            data: {
              quantity: {
                decrement: item.quantity_required,
              },
            },
          });
        }
      }

      return tx.delivery_notes.update({
        where: { id },
        data: { status: 'CONFIRMED' },
      });
    });
  }
}
