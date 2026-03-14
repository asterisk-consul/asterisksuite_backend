import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { omitUndefined } from '@/common/utils/object.utils';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateVehicleDto) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.vehicles.findUnique({
        where: { plate: dto.plate },
      });

      if (existing) {
        throw new BadRequestException('La patente ya existe');
      }

      const vehicle = await tx.vehicles.create({
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

      if (dto.documents?.length) {
        for (const doc of dto.documents) {
          const docType = await tx.transport_document_types.findUnique({
            where: { id: doc.documentTypeId },
          });

          if (!docType || docType.entity !== 'VEHICLE' || !docType.active) {
            throw new BadRequestException(
              'Tipo de documento inválido para VEHICLE',
            );
          }

          await tx.documents_vehicle.create({
            data: {
              vehicle_id: vehicle.id,
              document_type_id: doc.documentTypeId,
              expiration_date: doc.expirationDate
                ? new Date(doc.expirationDate)
                : undefined,
            },
          });
        }
      }

      return tx.vehicles.findUnique({
        where: { id: vehicle.id },
        include: {
          vehicleDocuments: {
            include: {
              transport_document_types: true,
            },
          },
        },
      });
    });
  }

  async findAll(companyId: string) {
    return this.prisma.vehicles.findMany({
      where: {
        company_id: companyId,
      },
      include: {
        vehicleDocuments: {
          include: {
            transport_document_types: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.prisma.vehicles.findUnique({
      where: { id },
      include: {
        vehicleDocuments: {
          include: {
            transport_document_types: true,
          },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehículo no encontrado');
    }

    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto) {
    return this.prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicles.findUnique({
        where: { id },
        include: { vehicleDocuments: true },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehículo no encontrado');
      }

      // 1️⃣ Actualizar datos básicos
      await tx.vehicles.update({
        where: { id },
        data: omitUndefined({
          plate: dto.plate,
          type: dto.type,
          brand: dto.brand,
          model: dto.model,
          year: dto.year,
          max_weight: dto.maxWeight,
          max_volume: dto.maxVolume,
          refrigeration: dto.refrigeration,
          active: dto.active,
        }),
      });

      // 2️⃣ Procesar documentos
      if (dto.documents?.length) {
        for (const doc of dto.documents) {
          // 🔴 Eliminar
          if (doc.remove && doc.id) {
            await tx.documents_vehicle.delete({
              where: { id: doc.id },
            });
            continue;
          }

          // 🟢 Actualizar vencimiento
          if (doc.id) {
            await tx.documents_vehicle.update({
              where: { id: doc.id },
              data: {
                expiration_date: doc.expirationDate
                  ? new Date(doc.expirationDate)
                  : null,
              },
            });
            continue;
          }

          // 🔵 Crear nuevo documento
          if (!doc.id && doc.documentTypeId) {
            const docType = await tx.transport_document_types.findUnique({
              where: { id: doc.documentTypeId },
            });

            if (!docType || docType.entity !== 'VEHICLE' || !docType.active) {
              throw new BadRequestException(
                'Tipo de documento inválido para VEHICLE',
              );
            }

            await tx.documents_vehicle.create({
              data: {
                vehicle_id: id,
                document_type_id: doc.documentTypeId,
                expiration_date: doc.expirationDate
                  ? new Date(doc.expirationDate)
                  : undefined,
              },
            });
          }
        }
      }

      // 3️⃣ Retornar actualizado
      return tx.vehicles.findUnique({
        where: { id },
        include: {
          vehicleDocuments: {
            include: {
              transport_document_types: true,
            },
          },
        },
      });
    });
  }

  async desactivate(id: string) {
    return this.update(id, { active: false });
  }

  async active(id: string) {
    return this.update(id, { active: true });
  }
}
