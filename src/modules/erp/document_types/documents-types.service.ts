// documents-types.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';

@Injectable()
export class DocumentsTypesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

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

  async findAll(direction?: number, issuerCondition?: string) {
    const where: any = { deleted_at: null }

    if (direction !== undefined) {
      where.direction = direction
    }

    if (issuerCondition) {
      const validLetters = this.getValidLetterTypes(issuerCondition)
      if (validLetters.length > 0) {
        where.OR = [
          { letter_type: { in: validLetters } },
          { letter_type: null },
        ]
      }
    }

    return this.prisma.document_types.findMany({
      where,
      include: {
        document_sequences: true,
        document_type_taxes: { include: { taxes: true } },
        system_modules: {
          select: {
            id: true,
            code: true,
            name: true,
          },
        },
      },
    });
  }

  private getValidLetterTypes(issuerCondition: string): string[] {
    const map: Record<string, string[]> = {
      'RESPONSABLE_INSCRIPTO': ['A', 'B'],
      'MONOTRIBUTO': ['C'],
      'EXENTO': ['C'],
    }
    return map[issuerCondition] ?? []
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
