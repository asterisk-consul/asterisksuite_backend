// documents-types.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { FiscalValidationService } from '@/common/services/fiscal-validation.service';
import { CreateDocumentsTypeDto } from './dto/create-documents-type.dto';
import { UpdateDocumentsTypeDto } from './dto/update-documents-type.dto';

@Injectable()
export class DocumentsTypesService {
  constructor(
    private db: PrismaService,
    private readonly fiscalValidation: FiscalValidationService,
  ) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateDocumentsTypeDto) {
    const { document_sequence_id, document_sequence_ids, ...rest } = dto;

    const sequenceIds = [...new Set(document_sequence_ids ?? (document_sequence_id ? [document_sequence_id] : []))];

    return this.prisma.$transaction(async (tx) => {
      const docType = await tx.document_types.create({
        data: rest,
      });

      if (sequenceIds.length > 0) {
        await tx.document_type_sequences.createMany({
          data: sequenceIds.map((sequenceId) => ({
            document_type_id: docType.id,
            sequence_id: sequenceId,
          })),
        });
      }

      return tx.document_types.findUnique({
        where: { id: docType.id },
        include: {
          document_type_sequences: {
            include: { document_sequences: true },
          },
        },
      });
    });
  }

  async findAll(direction?: number, issuerCondition?: string) {
    const where: any = { deleted_at: null }

    if (direction !== undefined) {
      where.direction = direction
    }

    if (issuerCondition) {
      const validLetters = this.fiscalValidation.getValidLetterTypes(issuerCondition)
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
        document_type_sequences: {
          include: { document_sequences: true },
        },
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

  async findOne(id: string) {
    const documentType = await this.prisma.document_types.findUnique({
      where: { id },
      include: {
        document_type_sequences: {
          include: { document_sequences: true },
        },
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

    const { document_sequence_ids, ...rest } = dto as any;

    return this.prisma.$transaction(async (tx) => {
      await tx.document_types.update({
        where: { id },
        data: rest,
      });

      if (document_sequence_ids !== undefined) {
        await tx.document_type_sequences.deleteMany({
          where: { document_type_id: id },
        });

        const uniqueIds = [...new Set(document_sequence_ids)];
        if (uniqueIds.length > 0) {
          await tx.document_type_sequences.createMany({
            data: uniqueIds.map((sequenceId: string) => ({
              document_type_id: id,
              sequence_id: sequenceId,
            })),
          });
        }
      }

      return tx.document_types.findUnique({
        where: { id },
        include: {
          document_type_sequences: {
            include: { document_sequences: true },
          },
        },
      });
    });
  }
}
