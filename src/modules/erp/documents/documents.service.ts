// documents.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDocumentDto) {
    const { party_id, document_type_id, ...rest } = dto;

    return this.prisma.documents.create({
      data: {
        ...rest,
        document_types: {
          connect: { id: document_type_id },
        },
        ...(party_id && {
          business_parties: {
            connect: { id: party_id },
          },
        }),
      },
      include: {
        document_types: true,
        business_parties: true,
      },
    });
  }

  async findAll(documentTypeId: string) {
    return this.prisma.documents.findMany({
      where: {
        document_type_id: documentTypeId,
      },
      include: {
        document_types: true,
        business_parties: true,
      },
    });
  }

  async findOne(id: string) {
    const document = await this.prisma.documents.findUnique({
      where: { id },
      include: {
        document_types: true,
        business_parties: true,
        document_items: true,
        document_taxes: true,
      },
    });

    if (!document) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    return document;
  }

  async update(id: string, dto: UpdateDocumentDto) {
    const exists = await this.prisma.documents.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException(`Document with id ${id} not found`);
    }

    const { party_id, document_type_id, ...rest } = dto;

    return this.prisma.documents.update({
      where: { id },
      data: {
        ...rest,
        ...(document_type_id && {
          document_types: {
            connect: { id: document_type_id },
          },
        }),
        ...(party_id && {
          business_parties: {
            connect: { id: party_id },
          },
        }),
      },
      include: {
        document_types: true,
        business_parties: true,
      },
    });
  }
}
