import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async findAll(company_id: string) {
    return this.prisma.drivers.findMany({
      where: { company_id },
      include: {
        driverDocuments: {
          include: {
            transport_document_types: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const driver = await this.prisma.drivers.findUnique({
      where: { id },
      include: {
        driverDocuments: {
          include: {
            transport_document_types: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async create(dto: CreateDriverDto) {
    const { documents, ...driverData } = dto;

    return this.prisma.drivers.create({
      data: {
        ...driverData,
        driverDocuments: documents
          ? {
              create: documents.map((doc) => ({
                document_type_id: doc.document_type_id,
                expiration_date: doc.expiration_date
                  ? new Date(doc.expiration_date)
                  : null,
              })),
            }
          : undefined,
      },
      include: {
        driverDocuments: {
          include: {
            transport_document_types: true,
          },
        },
      },
    });
  }

  async update(id: string, dto: UpdateDriverDto) {
    const { documents, ...driverData } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.drivers.update({
        where: { id },
        data: driverData,
      });

      if (documents) {
        for (const doc of documents) {
          await tx.documents_driver.upsert({
            where: {
              driver_id_document_type_id: {
                driver_id: id,
                document_type_id: doc.document_type_id,
              },
            },
            update: {
              expiration_date: doc.expiration_date
                ? new Date(doc.expiration_date)
                : null,
            },
            create: {
              driver_id: id,
              document_type_id: doc.document_type_id,
              expiration_date: doc.expiration_date
                ? new Date(doc.expiration_date)
                : null,
            },
          });
        }
      }

      return tx.drivers.findUnique({
        where: { id },
        include: {
          driverDocuments: {
            include: {
              transport_document_types: true,
            },
          },
        },
      });
    });
  }

  async remove(id: string) {
    await this.prisma.drivers.delete({
      where: { id },
    });

    return { deleted: true };
  }
}
