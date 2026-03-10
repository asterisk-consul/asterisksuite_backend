import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';

@Injectable()
export class DocumentTypesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateDocumentTypeDto) {
    return this.prisma.transport_document_types.create({
      data: {
        name: dto.name,
        entity: dto.entity,
      },
    });
  }

  async findAll(entity?: 'VEHICLE' | 'DRIVER') {
    return this.prisma.transport_document_types.findMany({
      where: {
        active: true,
        ...(entity && { entity }),
      },
      orderBy: { name: 'asc' },
    });
  }

  async deactivate(id: string) {
    const exists = await this.prisma.transport_document_types.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException('Tipo de documento no existe');
    }

    return this.prisma.transport_document_types.update({
      where: { id },
      data: { active: false },
    });
  }

  async active(id: string) {
    const exists = await this.prisma.transport_document_types.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException('Tipo de documento no existe');
    }

    return this.prisma.transport_document_types.update({
      where: { id },
      data: { active: true },
    });
  }
}
