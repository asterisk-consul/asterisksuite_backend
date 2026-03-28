// document-types.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';

@Injectable()
export class DocumentsTypesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentsTypeDto) {
    return this.prisma.document_types.create({
      data: dto,
    });
  }

  async findAll(companyId: string) {
    return this.prisma.document_types.findMany({
      where: {
        document_sequences: {
          company_id: companyId,
        },
      },
      include: {
        document_sequences: true,
      },
    });
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
