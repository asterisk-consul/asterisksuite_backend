import { Injectable } from '@nestjs/common';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(private prisma: LogisticaPrismaService) {}

  create(dto: CreateVehicleDto) {
    return this.prisma.vehicles.create({
      data: {
        company_id: dto.companyId,
        type: dto.type,
        plate: dto.plate,
        brand: dto.brand,
        model: dto.model,
        year: dto.year,
        max_weight: dto.maxWeight,
        max_volume: dto.maxVolume,
        refrigeration: dto.refrigeration ?? false,
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.vehicles.findMany({
      where: { company_id: companyId, active: true },
    });
  }
}
