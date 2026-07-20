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
    // Verificar que no exista otra secuencia con el mismo punto de venta y prefijo
    const existing = await this.prisma.document_sequences.findFirst({
      where: {
        point_of_sale: dto.point_of_sale,
        prefix: dto.prefix || null,
        deleted_at: null,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe una secuencia para el punto de venta ${dto.point_of_sale} con prefijo "${dto.prefix || ''}"`,
      );
    }

    return this.prisma.document_sequences.create({
      data: {
        name: dto.name,
        point_of_sale: dto.point_of_sale,
        prefix: dto.prefix,
        range_start: dto.range_start,
        range_end: dto.range_end,
        current_number: dto.range_start || 0,
        automatic: dto.automatic ?? true,
        active: true,
      },
    });
  }

  async findAll() {
    return this.prisma.document_sequences.findMany({
      where: { deleted_at: null },
      include: {
        document_types: {
          select: { id: true, code: true, description: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const seq = await this.prisma.document_sequences.findFirst({
      where: { id, deleted_at: null },
      include: {
        document_types: true,
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
          deleted_at: null,
          NOT: { id },
        },
      });
      if (existing) {
        throw new BadRequestException('Ya existe una secuencia con ese punto de venta y prefijo');
      }
    }

    return this.prisma.document_sequences.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const seq = await this.findOne(id);
    if (seq.document_types.length > 0) {
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
