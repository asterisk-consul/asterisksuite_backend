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

    const nextNumber = dto.next_number
      ?? (dto.range_start != null && dto.range_start > 0 ? dto.range_start : 1);
    if (dto.range_start != null && dto.range_start > 0 && nextNumber < dto.range_start) {
      throw new BadRequestException('El próximo número no puede ser menor que el inicio del rango');
    }
    if (dto.range_end != null && nextNumber > dto.range_end) {
      throw new BadRequestException('El próximo número no puede superar el fin del rango');
    }

    return this.prisma.$transaction(async (tx) => {
      const sequence = await tx.document_sequences.create({
        data: {
          name: dto.name,
          point_of_sale: dto.point_of_sale,
          prefix,
          range_start: dto.range_start,
          range_end: dto.range_end,
          current_number: nextNumber - 1,
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

  async previewNextNumber(documentTypeId: string, sequenceId?: string) {
    if (!documentTypeId) throw new BadRequestException('Seleccioná un tipo de documento');

    const documentType = await this.prisma.document_types.findFirst({
      where: { id: documentTypeId, deleted_at: null, active: true },
      select: { id: true, code: true },
    });
    if (!documentType) throw new NotFoundException('Tipo de documento no encontrado');

    if (sequenceId) {
      const sequence = await this.prisma.document_sequences.findFirst({
        where: {
          id: sequenceId,
          active: true,
          deleted_at: null,
          document_type_sequences: { some: { document_type_id: documentTypeId } },
        },
        select: { current_number: true, range_end: true, point_of_sale: true, prefix: true },
      });
      if (!sequence) throw new BadRequestException('El punto de venta no corresponde al tipo de documento');

      const nextNumber = sequence.current_number + 1;
      if (sequence.range_end != null && nextNumber > sequence.range_end) {
        throw new BadRequestException('La secuencia seleccionada está agotada');
      }
      const pointOfSale = String(sequence.point_of_sale).padStart(4, '0');
      return {
        next_number: nextNumber,
        point_of_sale: pointOfSale,
        prefix: sequence.prefix,
        formatted: `${sequence.prefix ? `${sequence.prefix} ` : ''}${pointOfSale}-${String(nextNumber).padStart(8, '0')}`,
        source: 'SEQUENCE',
      };
    }

    const last = await this.prisma.documents.findFirst({
      where: { document_type_id: documentTypeId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });
    const nextNumber = (last?.number ?? 0) + 1;
    return {
      next_number: nextNumber,
      point_of_sale: null,
      prefix: documentType.code,
      formatted: `${documentType.code} ${String(nextNumber).padStart(8, '0')}`,
      source: 'DOCUMENT_TYPE',
    };
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
      const { document_type_ids, next_number, ...sequenceData } = dto;

      if (next_number !== undefined) {
        const highestIssued = await tx.documents.aggregate({
          where: { document_sequence_id: id },
          _max: { number: true },
        });
        const minimumNext = (highestIssued._max.number ?? 0) + 1;
        if (next_number < minimumNext) {
          throw new BadRequestException(
            `El próximo número debe ser ${minimumNext} o mayor porque la secuencia ya tiene comprobantes emitidos`,
          );
        }

        const rangeEnd = dto.range_end ?? current.range_end;
        const rangeStart = dto.range_start ?? current.range_start;
        if (rangeStart != null && rangeStart > 0 && next_number < rangeStart) {
          throw new BadRequestException('El próximo número no puede ser menor que el inicio del rango');
        }
        if (rangeEnd != null && next_number > rangeEnd) {
          throw new BadRequestException('El próximo número no puede superar el fin del rango');
        }
      }

      const sequence = await tx.document_sequences.update({
        where: { id },
        data: {
          ...sequenceData,
          ...(next_number !== undefined ? { current_number: next_number - 1 } : {}),
          ...(dto.prefix !== undefined ? { prefix } : {}),
        },
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
