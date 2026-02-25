import { Injectable } from '@nestjs/common';
import { CreateDriverDto } from './dto/create-driver.dto';
import { PrismaService } from '@/prisma/prisma.service';
@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

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
