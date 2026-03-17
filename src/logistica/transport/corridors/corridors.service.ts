import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCorridorDto } from './dto/create-corridor.dto';
import { UpdateCorridorDto } from './dto/update-corridor.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class CorridorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCorridorDto) {
    if (dto.name) {
      const exists = await this.prisma.corridors.findFirst({
        where: {
          company_id: dto.company_id,
          name: dto.name,
        },
      });

      if (exists) {
        throw new BadRequestException('Este nombre de corredor ya existe');
      }
    }

    return this.prisma.corridors.create({
      data: {
        company_id: dto.company_id,
        name: dto.name,
        is_template: dto.is_template ?? true,
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        corridorStops: {
          create: dto.stops,
        },
      },
      include: {
        corridorStops: true,
      },
    });
  }

  findAll() {
    return this.prisma.corridors.findMany({
      include: {
        origin_location: true,
        destination_location: true,
        corridorStops: {
          orderBy: { stop_order: 'asc' },
          include: { location: true },
        },
      },
    });
  }

  findTemplates() {
    return this.prisma.corridors.findMany({
      where: {
        is_template: true,
      },
    });
  }

  async getCorridorRoute(id: string) {
    const corridor = await this.prisma.corridors.findUnique({
      where: { id },
      include: {
        origin_location: true,
        destination_location: true,
        corridorStops: {
          orderBy: { stop_order: 'asc' },
          include: {
            location: true,
          },
        },
      },
    });

    if (!corridor) return null;

    const route = [
      {
        type: 'origin',
        ...corridor.origin_location,
      },

      ...corridor.corridorStops.map((stop) => ({
        type: 'stop',
        ...stop.location,
      })),

      {
        type: 'destination',
        ...corridor.destination_location,
      },
    ];

    return {
      id: corridor.id,
      name: corridor.name,
      total_distance_km: corridor.total_distance_km,
      estimated_minutes: corridor.estimated_minutes,
      route,
    };
  }

  findOne(id: string) {
    return this.prisma.corridors.findUnique({
      where: { id },
      include: {
        origin_location: true,
        destination_location: true,
        corridorStops: {
          orderBy: { stop_order: 'asc' },
          include: { location: true },
        },
      },
    });
  }

  update(id: string, dto: UpdateCorridorDto) {
    const { stops, ...rest } = dto;

    return this.prisma.corridors.update({
      where: { id },
      data: {
        ...omitUndefined(rest),

        ...(stops && {
          stops: {
            deleteMany: {},
            create: stops.map((s) =>
              omitUndefined({
                location_id: s.location_id,
                stop_order: s.stop_order,
                stop_type: s.stop_type ?? undefined, // 👈 clave
              }),
            ),
          },
        }),
      },
    });
  }

  remove(id: string) {
    return this.prisma.corridors.delete({
      where: { id },
    });
  }
}
