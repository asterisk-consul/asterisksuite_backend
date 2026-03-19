import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@/generated/prisma/client';
import { CreateVehicleCombinationDto } from './dto/create-vehicle-combination.dto';
import { UpdateVehicleCombinationDto } from './dto/update-vehicle-combination.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class VehicleCombinationsService {
  constructor(private prisma: PrismaService) {}

  // --------------------------------------------------
  // VALIDAR CONFLICTOS ACTIVOS (tractor, trailer, driver)
  // --------------------------------------------------
  private async validateActiveConflicts(
    dto: CreateVehicleCombinationDto | UpdateVehicleCombinationDto,
    idToIgnore?: string,
  ) {
    const conditions: Prisma.vehicle_combinationsWhereInput[] = [
      { tractor_id: dto.tractor_id },
    ];

    if (dto.trailer_id) {
      conditions.push({ trailer_id: dto.trailer_id });
    }

    if (dto.driver_id) {
      conditions.push({ driver_id: dto.driver_id });
    }

    const conflict = await this.prisma.vehicle_combinations.findFirst({
      where: {
        company_id: dto.company_id,
        valid_until: null, // ← SOLO combinaciones activas
        deleted_at: null,
        OR: conditions,
        id: idToIgnore ? { not: idToIgnore } : undefined,
      },
    });

    if (conflict) {
      throw new BadRequestException(
        'El tractor, trailer o driver ya están en otra combinación activa',
      );
    }
  }

  // --------------------------------------------------
  // VALIDAR UNIT_NUMBER
  // --------------------------------------------------
  private async validateUnitNumber(
    dto: CreateVehicleCombinationDto | UpdateVehicleCombinationDto,
    idToIgnore?: string,
  ) {
    if (!dto.unit_number) return;

    const existing = await this.prisma.vehicle_combinations.findFirst({
      where: {
        company_id: dto.company_id,
        unit_number: dto.unit_number,
        valid_until: null, // ← SOLO combinaciones activas
        deleted_at: null,
        id: idToIgnore ? { not: idToIgnore } : undefined,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `El número de unidad ${dto.unit_number} ya existe en otra combinación activa`,
      );
    }
  }

  // --------------------------------------------------
  // CREATE
  // --------------------------------------------------
  async create(dto: CreateVehicleCombinationDto, user_id?: string) {
    await this.validateActiveConflicts(dto);
    await this.validateUnitNumber(dto);

    return this.prisma.vehicle_combinations.create({
      data: {
        company_id: dto.company_id,
        tractor_id: dto.tractor_id,
        trailer_id: dto.trailer_id,
        driver_id: dto.driver_id,
        unit_number: dto.unit_number,
        valid_from: new Date(dto.valid_from),
        valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
        created_by: user_id,
      },
      include: {
        tractor: true,
        trailer: true,
        drivers: true,
      },
    });
  }

  // --------------------------------------------------
  // LISTAR TODAS
  // --------------------------------------------------
  async findAll(company_id: string) {
    return this.prisma.vehicle_combinations.findMany({
      where: { company_id },
      include: {
        tractor: true,
        trailer: true,
        drivers: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // --------------------------------------------------
  // LISTAR ACTIVAS
  // --------------------------------------------------
  async findActive(company_id: string) {
    return this.prisma.vehicle_combinations.findMany({
      where: {
        company_id,
        valid_until: null,
      },
      include: {
        tractor: true,
        trailer: true,
        drivers: true,
      },
    });
  }

  // --------------------------------------------------
  // LISTAR DISPONIBLES POR FECHA
  // --------------------------------------------------
  async findAvailable(company_id: string, date: string) {
    const targetDate = new Date(date);

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const busyTrips = await this.prisma.trips.findMany({
      where: {
        company_id,
        status: { notIn: ['CANCELLED'] },
        vehicle_combination_id: { not: null },
        AND: [
          { departure_time: { lte: endOfDay } },
          {
            OR: [{ arrival_time: { gte: startOfDay } }, { arrival_time: null }],
          },
        ],
      },
      select: { vehicle_combination_id: true },
    });

    const busyIds = busyTrips
      .map((t) => t.vehicle_combination_id)
      .filter(Boolean) as string[];

    console.log({ busyIds });

    const result = await this.prisma.vehicle_combinations.findMany({
      where: {
        company_id,
        deleted_at: null,
        // sin filtro de fechas por ahora
        ...(busyIds.length > 0 && { id: { notIn: busyIds } }),
      },
      include: { tractor: true, trailer: true, drivers: true },
      orderBy: { created_at: 'desc' },
    });

    console.log({ returning: result.length, ids: result.map((v) => v.id) });

    console.log({ returning: result.length });

    return result;
  }
  // --------------------------------------------------
  // BUSCAR UNA
  // --------------------------------------------------
  async findOne(id: string) {
    const combination = await this.prisma.vehicle_combinations.findUnique({
      where: { id },
      include: {
        tractor: true,
        trailer: true,
        drivers: true,
        trips: true,
      },
    });

    if (!combination) {
      throw new NotFoundException('Vehicle combination not found');
    }

    return combination;
  }

  // --------------------------------------------------
  // FINALIZAR COMBINACION
  // --------------------------------------------------
  async finish(id: string) {
    const combination = await this.findOne(id);

    if (combination.valid_until) {
      throw new BadRequestException('La combinación ya está finalizada');
    }

    return this.prisma.vehicle_combinations.update({
      where: { id },
      data: { valid_until: new Date() },
      include: { tractor: true, trailer: true, drivers: true },
    });
  }

  async activate(id: string) {
    const combination = await this.findOne(id);

    if (!combination.valid_until) {
      throw new BadRequestException('La combinación ya está activa');
    }

    return this.prisma.vehicle_combinations.update({
      where: { id },
      data: { valid_until: null },
      include: { tractor: true, trailer: true, drivers: true },
    });
  }

  // --------------------------------------------------
  // UPDATE
  // --------------------------------------------------
  async update(id: string, dto: UpdateVehicleCombinationDto) {
    await this.findOne(id);
    await this.validateActiveConflicts(dto, id);
    await this.validateUnitNumber(dto, id);

    return this.prisma.vehicle_combinations.update({
      where: { id },
      data: omitUndefined({
        unit_number: dto.unit_number,
        valid_from: dto.valid_from ? new Date(dto.valid_from) : undefined,
        valid_until: dto.valid_until ? new Date(dto.valid_until) : null,
        tractor_id: dto.tractor_id,
        trailer_id: dto.trailer_id,
        driver_id: dto.driver_id,
      }),
      include: {
        tractor: true,
        trailer: true,
        drivers: true,
      },
    });
  }

  // --------------------------------------------------
  // HISTORIAL POR VEHICULO
  // --------------------------------------------------
  async findByVehicle(vehicle_id: string) {
    return this.prisma.vehicle_combinations.findMany({
      where: {
        OR: [{ tractor_id: vehicle_id }, { trailer_id: vehicle_id }],
      },
      include: {
        tractor: true,
        trailer: true,
        drivers: true,
      },
      orderBy: { valid_from: 'desc' },
    });
  }

  // --------------------------------------------------
  // SOFT DELETE
  // --------------------------------------------------
  async remove(id: string, user_id?: string) {
    await this.findOne(id);

    return this.prisma.vehicle_combinations.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: user_id,
      },
    });
  }
}
