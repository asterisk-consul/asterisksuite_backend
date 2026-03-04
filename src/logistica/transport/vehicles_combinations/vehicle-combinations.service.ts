import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVehicleCombinationDto } from './dto/create-vehicle-combination.dto';
import { UpdateVehicleCombinationDto } from './dto/update-vehicle-combination.dto';

@Injectable()
export class VehicleCombinationsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleCombinationDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1️⃣ Validar tractor
      const tractor = await tx.vehicles.findUnique({
        where: { id: dto.tractorId },
      });

      if (!tractor || tractor.company_id !== dto.companyId) {
        throw new BadRequestException('Tractor inválido');
      }

      // 2️⃣ Validar trailer si existe
      if (dto.trailerId) {
        const trailer = await tx.vehicles.findUnique({
          where: { id: dto.trailerId },
        });

        if (!trailer || trailer.company_id !== dto.companyId) {
          throw new BadRequestException('Trailer inválido');
        }
      }

      // 3️⃣ Verificar que no exista combinación activa del mismo tractor
      const existingActive = await tx.vehicle_combinations.findFirst({
        where: {
          tractor_id: dto.tractorId,
          valid_until: null,
        },
      });

      if (existingActive) {
        throw new BadRequestException(
          'El tractor ya tiene una combinación activa',
        );
      }

      return tx.vehicle_combinations.create({
        data: {
          company_id: dto.companyId,
          tractor_id: dto.tractorId,
          trailer_id: dto.trailerId,
          valid_from: new Date(dto.validFrom),
          valid_until: dto.validUntil ? new Date(dto.validUntil) : null,
          created_by: dto.createdBy,
        },
        include: {
          tractor: true,
          trailer: true,
        },
      });
    });
  }

  async findAll(companyId: string) {
    return this.prisma.vehicle_combinations.findMany({
      where: { company_id: companyId },
      include: {
        tractor: true,
        trailer: true,
      },
      orderBy: { valid_from: 'desc' },
    });
  }

  async findOne(id: string) {
    const combo = await this.prisma.vehicle_combinations.findUnique({
      where: { id },
      include: {
        tractor: true,
        trailer: true,
        trips: true,
      },
    });

    if (!combo) {
      throw new NotFoundException('Combinación no encontrada');
    }

    return combo;
  }

  async update(id: string, dto: UpdateVehicleCombinationDto) {
    const exists = await this.prisma.vehicle_combinations.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Combinación no encontrada');
    }

    return this.prisma.vehicle_combinations.update({
      where: { id },
      data: {
        valid_until: dto.validUntil ? new Date(dto.validUntil) : null,
      },
    });
  }

  async close(id: string) {
    return this.prisma.vehicle_combinations.update({
      where: { id },
      data: { valid_until: new Date() },
    });
  }
}
