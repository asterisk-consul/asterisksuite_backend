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

  private normalizedPrefix(prefix?: string | null) {
    return prefix?.trim() || null;
  }

  private async assertAvailableScope(
    pointOfSale: string,
    prefix: string | null,
    documentTypeIds: string[],
    excludeId?: string,
  ) {
    const sameSeries = await this.prisma.document_sequences.findMany({
      where: {
        point_of_sale: pointOfSale,
        prefix,
        id: excludeId ? { not: excludeId } : undefined,
      },
      include: { document_type_sequences: true },
    });

    const active = sameSeries.filter(sequence => !sequence.deleted_at);
    const deleted = sameSeries.find(sequence => sequence.deleted_at);
    const requested = new Set(documentTypeIds);
    const conflicting = active.find(sequence => {
      const linkedTypes = sequence.document_type_sequences.map(link => link.document_type_id);
      // Una serie histórica sin tipos vinculados se considera de alcance general.
      return linkedTypes.length === 0 || requested.size === 0 || linkedTypes.some(id => requested.has(id));
    });

    if (conflicting) {
      throw new BadRequestException(
        `Ya existe una secuencia para el punto de venta ${pointOfSale} y alguno de los tipos de documento seleccionados`,
      );
    }
    if (deleted && active.length === 0) {
      throw new BadRequestException(
        `Existe una secuencia eliminada para el punto de venta ${pointOfSale}. Recuperala o usá otra serie.`,
      );
    }
  }

  async create(dto: CreateDocumentSequenceDto) {
    const documentTypeIds = [...new Set(dto.document_type_ids ?? [])];
    if (documentTypeIds.length !== 1) {
      throw new BadRequestException('Seleccioná un único tipo de documento para la serie');
    }
    const prefix = this.normalizedPrefix(dto.prefix);
    await this.assertAvailableScope(dto.point_of_sale, prefix, documentTypeIds);

    return this.prisma.$transaction(async (tx) => {
      const sequence = await tx.document_sequences.create({
        data: {
          name: dto.name,
          point_of_sale: dto.point_of_sale,
          prefix,
          range_start: dto.range_start,
          range_end: dto.range_end,
          current_number: dto.range_start != null ? dto.range_start - 1 : 0,
          automatic: dto.automatic ?? true,
          active: true,
        },
      });

      if (documentTypeIds.length) {
        await tx.document_type_sequences.createMany({
          data: documentTypeIds.map((dtId) => ({
            document_type_id: dtId,
            sequence_id: sequence.id,
            is_default: false,
          })),
        });
      }

      return tx.document_sequences.findFirst({
        where: { id: sequence.id, deleted_at: null },
        include: {
          document_type_sequences: {
            include: {
              document_types: true,
            },
          },
        },
      });
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
    const current = await this.findOne(id);
    const pointOfSale = dto.point_of_sale ?? current.point_of_sale;
    const prefix = dto.prefix !== undefined ? this.normalizedPrefix(dto.prefix) : current.prefix;
    const documentTypeIds = Array.from(new Set<string>((dto.document_type_ids
      ?? current.document_type_sequences.map(link => link.document_type_id)) as string[]));
    if (documentTypeIds.length !== 1) {
      throw new BadRequestException('Cada serie debe pertenecer a un único tipo de documento');
    }
    await this.assertAvailableScope(pointOfSale, prefix, documentTypeIds, id);

    return this.prisma.$transaction(async (tx) => {
      const { document_type_ids, ...sequenceData } = dto;

      const sequence = await tx.document_sequences.update({
        where: { id },
        data: { ...sequenceData, ...(dto.prefix !== undefined ? { prefix } : {}) },
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
