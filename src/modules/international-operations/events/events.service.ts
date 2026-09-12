import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(containerId: string, dto: CreateEventDto) {
    const container = await this.prisma.international_containers.findFirst({
      where: { id: containerId, deleted_at: null },
    });
    if (!container) throw new NotFoundException('Contenedor no encontrado');

    return this.prisma.container_events.create({
      data: {
        container_id: containerId,
        event_type: dto.event_type,
        event_date: new Date(dto.event_date),
        location_text: dto.location_text,
        description: dto.description,
        created_by: dto.created_by,
      },
    });
  }

  async findAll(containerId: string) {
    const container = await this.prisma.international_containers.findFirst({
      where: { id: containerId, deleted_at: null },
    });
    if (!container) throw new NotFoundException('Contenedor no encontrado');

    return this.prisma.container_events.findMany({
      where: { container_id: containerId },
      orderBy: { event_date: 'asc' },
    });
  }

  async remove(id: string) {
    const event = await this.prisma.container_events.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Evento no encontrado');

    return this.prisma.container_events.delete({ where: { id } });
  }
}
