import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { LogisticaPrismaService } from 'src/prisma/prisma-logistica.service';
@Injectable()
export class DriversService {
  constructor(private prisma: LogisticaPrismaService) {}

  create(dto: CreateDriverDto) {
    return this.prisma.drivers.create({
      data: {
        company_id: dto.companyId,
        first_name: dto.firstName,
        last_name: dto.lastName,
        document: dto.document,
        phone: dto.phone,
        license_number: dto.licenseNumber,
        license_expiration: dto.licenseExpiration
          ? new Date(dto.licenseExpiration)
          : undefined,
      },
    });
  }

  findAll(companyId: string) {
    return this.prisma.drivers.findMany({
      where: { company_id: companyId, active: true },
    });
  }
}
