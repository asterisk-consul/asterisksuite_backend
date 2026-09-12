// document-types.service.ts
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
    return this.prisma.document_types.create({
      data: dto,
    });
  }

  async findAll(companyId: string, direction?: number, issuerCondition?: string) {
    const where: any = { deleted_at: null, active: true }

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
