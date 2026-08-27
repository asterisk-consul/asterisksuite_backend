import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateDocumentSequenceDto } from './dto/create-document-sequence.dto';
import { UpdateDocumentSequenceDto } from './dto/update-document-sequence.dto';

@Injectable()
export class DocumentSequencesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateDocumentSequenceDto) {
    const existing = await this.prisma.document_sequences.findFirst({
      where: {
        point_of_sale: dto.point_of_sale,
        prefix: dto.prefix || null,
      },
    });

    if (existing) {
      if (existing.deleted_at) {
        throw new BadRequestException(
          `Ya existe una secuencia eliminada para el punto de venta ${dto.point_of_sale} con prefijo "${dto.prefix || ''}". Recuperá la secuencia existente o usá otro punto de venta/prefijo.`,
        );
      }
      throw new BadRequestException(
        `Ya existe una secuencia para el punto de venta ${dto.point_of_sale} con prefijo "${dto.prefix || ''}"`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const sequence = await tx.document_sequences.create({
        data: {
          name: dto.name,
          point_of_sale: dto.point_of_sale,
          prefix: dto.prefix,
          range_start: dto.range_start,
          range_end: dto.range_end,
          current_number: dto.range_start != null ? dto.range_start - 1 : 0,
          automatic: dto.automatic ?? true,
          active: true,
        },
      });

      if (dto.document_type_ids?.length) {
        await tx.document_type_sequences.createMany({
          data: dto.document_type_ids.map((dtId) => ({
            document_type_id: dtId,
            sequence_id: sequence.id,
            is_default: false,
          })),
        });
      }

      return this.findOne(sequence.id);
    });
  }

  async findAll() {
    return this.prisma.document_sequences.findMany({
      where: { deleted_at: null },
      include: {
        document_type_sequences: {
          include: {
            document_types: {
              select: { id: true, code: true, description: true },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const seq = await this.prisma.document_sequences.findFirst({
      where: { id, deleted_at: null },
      include: {
        document_type_sequences: {
          include: {
            document_types: true,
          },
        },
      },
    });
    if (!seq) throw new NotFoundException('Secuencia no encontrada');
    return seq;
  }

  async update(id: string, dto: UpdateDocumentSequenceDto) {
    await this.findOne(id);

    if (dto.point_of_sale || dto.prefix) {
      const existing = await this.prisma.document_sequences.findFirst({
        where: {
          point_of_sale: dto.point_of_sale || undefined,
          prefix: dto.prefix || null,
          NOT: { id },
        },
      });
      if (existing) {
        throw new BadRequestException('Ya existe una secuencia con ese punto de venta y prefijo');
      }
    }

    return this.prisma.$transaction(async (tx) => {
      const { document_type_ids, ...sequenceData } = dto;

      const sequence = await tx.document_sequences.update({
        where: { id },
        data: sequenceData,
      });

      if (document_type_ids !== undefined) {
        await tx.document_type_sequences.deleteMany({
          where: { sequence_id: id },
        });

        if (document_type_ids.length > 0) {
          await tx.document_type_sequences.createMany({
            data: document_type_ids.map((dtId) => ({
              document_type_id: dtId,
              sequence_id: id,
              is_default: false,
            })),
          });
        }
      }

      return this.findOne(id);
    });
  }

  async remove(id: string) {
    const seq = await this.findOne(id);
    const linkCount = await this.prisma.document_type_sequences.count({
      where: { sequence_id: id },
    });
    if (linkCount > 0) {
      throw new BadRequestException('No se puede eliminar una secuencia asociada a tipos de documento');
    }
    return this.prisma.document_sequences.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async getNextNumber(sequenceId: string): Promise<number> {
    const seq = await this.prisma.document_sequences.findUnique({
      where: { id: sequenceId },
    });
    if (!seq) throw new NotFoundException('Secuencia no encontrada');

    if (seq.range_end && seq.current_number >= seq.range_end) {
      throw new BadRequestException('Secuencia agotada');
    }

    const updated = await this.prisma.document_sequences.update({
      where: { id: sequenceId },
      data: { current_number: { increment: 1 } },
    });

    return updated.current_number;
  }
}
