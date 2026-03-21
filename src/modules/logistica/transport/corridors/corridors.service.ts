import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCorridorDto } from './dto/create-corridor.dto';
import { UpdateCorridorDto } from './dto/update-corridor.dto';
import { omitUndefined } from '@/common/utils/object.utils';
import { calculateRoute } from '@/common/utils/routing.utils';
import { Decimal } from '@/generated/prisma/internal/prismaNamespace';

@Injectable()
export class CorridorsService {
  constructor(private prisma: PrismaService) {}

  private async getRoutePoints(
    originId: string,
    destinationId: string,
    stops: { location_id: string; stop_order: number }[],
  ): Promise<{ id: string; latitude: number; longitude: number }[]> {
    const locationIds = [
      originId,
      ...stops
        .sort((a, b) => a.stop_order - b.stop_order)
        .map((s) => s.location_id),
      destinationId,
    ];

    const locations = await this.prisma.locations.findMany({
      where: { id: { in: locationIds } },
      select: { id: true, latitude: true, longitude: true },
    });

    return locationIds
      .map((id) => locations.find((l) => l.id === id))
      .filter(
        (l): l is { id: string; latitude: Decimal; longitude: Decimal } =>
          !!l?.latitude && !!l?.longitude,
      )
      .map((l) => ({
        id: l.id,
        latitude: l.latitude.toNumber(),
        longitude: l.longitude.toNumber(),
      }));
  }

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

    const points = await this.getRoutePoints(
      dto.origin_location_id,
      dto.destination_location_id,
      dto.stops ?? [],
    );

    const routeStats = await calculateRoute(points);

    return this.prisma.corridors.create({
      data: {
        company_id: dto.company_id,
        name: dto.name,
        is_template: dto.is_template ?? true,
        origin_location_id: dto.origin_location_id,
        destination_location_id: dto.destination_location_id,
        total_distance_km: routeStats?.distanceKm ?? null,
        estimated_minutes: routeStats?.estimatedMinutes ?? null,
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

  async update(id: string, dto: UpdateCorridorDto) {
    const { stops, origin_location_id, destination_location_id, ...rest } = dto;

    const current = await this.prisma.corridors.findUnique({
      where: { id },
      select: {
        origin_location_id: true,
        destination_location_id: true,
        corridorStops: {
          select: { location_id: true, stop_order: true },
        },
      },
    });

    const finalOrigin = origin_location_id ?? current?.origin_location_id;
    const finalDestination =
      destination_location_id ?? current?.destination_location_id;
    const finalStops = stops ?? current?.corridorStops ?? [];

    let routeStats: { distanceKm: number; estimatedMinutes: number } | null =
      null;

    if (finalOrigin && finalDestination) {
      const points = await this.getRoutePoints(
        finalOrigin,
        finalDestination,
        finalStops,
      );
      routeStats = await calculateRoute(points);
    }

    return this.prisma.corridors.update({
      where: { id },
      data: {
        ...omitUndefined(rest),
        ...(origin_location_id && {
          origin_location: { connect: { id: origin_location_id } },
        }),
        ...(destination_location_id && {
          destination_location: { connect: { id: destination_location_id } },
        }),
        ...(stops && {
          corridorStops: {
            deleteMany: {},
            create: stops.map((s) => ({
              location_id: s.location_id,
              stop_order: s.stop_order,
              ...(s.stop_type !== undefined && { stop_type: s.stop_type }),
            })),
          },
        }),
        total_distance_km: routeStats
          ? new Decimal(routeStats.distanceKm)
          : undefined,
        estimated_minutes: routeStats?.estimatedMinutes ?? undefined,
      },
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

  remove(id: string) {
    return this.prisma.corridors.delete({
      where: { id },
    });
  }
}
