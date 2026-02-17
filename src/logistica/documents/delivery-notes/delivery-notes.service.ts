import { Injectable, NotFoundException } from '@nestjs/common';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { CreateDeliveryNoteDto } from './dto/create-delivery-note.dto';
import { UpdateDeliveryNoteDto } from './dto/update-delivery-note.dto';
import { QueryDeliveryNoteDto } from './dto/query-delivery-note.dto';

@Injectable()
export class DeliveryNotesService {
  constructor(private readonly prisma: LogisticaPrismaService) {}

  async create(dto: CreateDeliveryNoteDto, userId?: string) {
    return this.prisma.delivery_notes.create({
      data: {
        ...dto,
        created_by: userId,
      },
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
}
