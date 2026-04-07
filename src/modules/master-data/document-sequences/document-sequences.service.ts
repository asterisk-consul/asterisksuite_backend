import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDocumentSequenceDto } from './dto/create-document-sequences.dto';
import { UpdateDocumentSequenceDto } from './dto/update-document-sequences.dto';
@Injectable()
export class DocumentSequencesService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Validaciones internas ──────────────────────────────────────────────────

  private validateRangeFields(
    dto: CreateDocumentSequenceDto | UpdateDocumentSequenceDto,
  ): void {
    if (dto.automatic === false) {
      if (dto.range_start === undefined || dto.range_end === undefined) {
        throw new BadRequestException(
          'range_start y range_end son obligatorios cuando automatic=false.',
        );
      }
      if (dto.range_start >= dto.range_end) {
        throw new BadRequestException(
          'range_start debe ser menor que range_end.',
        );
      }
    }
  }

  // ── CRUD ───────────────────────────────────────────────────────────────────

  async create(dto: CreateDocumentSequenceDto) {
    this.validateRangeFields(dto);

    const exists = await this.prisma.document_sequences.findFirst({
      where: {
        point_of_sale: dto.point_of_sale,
      },
    });

    if (exists) {
      throw new ConflictException(
        `Ya existe una secuencia para el punto de venta "${dto.point_of_sale}" en esta empresa.`,
      );
    }

    // Si el usuario define el rango, current_number arranca en range_start
    const initialCurrentNumber = !dto.automatic ? dto.range_start : 0;

    return this.prisma.document_sequences.create({
      data: {
        name: dto.name,
        point_of_sale: dto.point_of_sale,
        automatic: dto.automatic,
        range_start: dto.automatic ? null : dto.range_start,
        range_end: dto.automatic ? null : dto.range_end,
        prefix: dto.prefix ?? null,
        active: dto.active ?? true,
        current_number: initialCurrentNumber,
      },
    });
  }

  async findAll(company_id: string) {
    return this.prisma.document_sequences.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const sequence = await this.prisma.document_sequences.findUnique({
      where: { id },
      include: { document_types: true },
    });

    if (!sequence) {
      throw new NotFoundException(`Secuencia con id "${id}" no encontrada.`);
    }

    return sequence;
  }

  async update(id: string, dto: UpdateDocumentSequenceDto) {
    await this.findOne(id);
    this.validateRangeFields(dto);

    return this.prisma.document_sequences.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.document_sequences.delete({ where: { id } });
  }

  // ── Lógica de numeración ───────────────────────────────────────────────────

  async getNextNumber(
    tx: any,
    documentType: string,
    pointOfSale: string,
  ): Promise<{ raw: number; formatted: string }> {
    const sequence = await tx.document_sequences.findFirst({
      where: {
        point_of_sale: pointOfSale,
        active: true,
      },
    });

    if (!sequence) {
      throw new BadRequestException(
        `No existe secuencia para ${documentType} en POS ${pointOfSale}`,
      );
    }

    const next = sequence.current_number + 1;

    if (!sequence.automatic) {
      if (next > sequence.range_end!) {
        throw new BadRequestException(
          `La secuencia "${sequence.name}" alcanzó su límite máximo (${sequence.range_end}).`,
        );
      }
    }

    await tx.document_sequences.update({
      where: { id: sequence.id },
      data: { current_number: next },
    });

    return {
      raw: next,
      formatted: this.formatNumber(next, sequence.prefix),
    };
  }

  async getCurrentNumber(id: string): Promise<{
    current: number;
    next: number;
    formatted_next: string;
  }> {
    const sequence = await this.findOne(id);
    const next = sequence.current_number + 1;

    return {
      current: sequence.current_number,
      next,
      formatted_next: this.formatNumber(next, sequence.prefix),
    };
  }

  async reset(id: string) {
    const sequence = await this.findOne(id);

    // Automático vuelve a 0, con rango vuelve a range_start
    const resetValue = !sequence.automatic ? sequence.range_start! : 0;

    return this.prisma.document_sequences.update({
      where: { id },
      data: { current_number: resetValue },
    });
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private formatNumber(n: number, prefix: string | null): string {
    const padded = String(n).padStart(8, '0');
    return prefix ? `${prefix}-${padded}` : padded;
  }
}
