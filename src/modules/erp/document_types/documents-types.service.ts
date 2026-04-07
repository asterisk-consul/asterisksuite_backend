// documents-types.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';

@Injectable()
export class DocumentsTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentsTypeDto) {
    const { document_sequence_id, ...rest } = dto;

    return this.prisma.document_types.create({
      data: {
        ...rest,
        ...(document_sequence_id && {
          document_sequences: {
            connect: { id: document_sequence_id },
          },
        }),
      },
    });
  }

  async findAll(companyId: string) {
    return this.prisma.document_types.findMany({
      include: {
        document_sequences: true,
      },
    });
  }

  async findOne(id: string) {
    const documentType = await this.prisma.document_types.findUnique({
      where: { id },
      include: {
        document_sequences: true,
      },
    });

    if (!documentType) {
      throw new NotFoundException(`DocumentType with id ${id} not found`);
    }

    return documentType;
  }

  async update(id: string, dto: UpdateDocumentsTypeDto) {
    const exists = await this.prisma.document_types.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`DocumentType with id ${id} not found`);
    }

    return this.prisma.document_types.update({
      where: { id },
      data: dto,
    });
  }
}
