import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCommercialAdjustmentConceptDto } from './dto/create-commercial-adjustment-concept.dto';
import { UpdateCommercialAdjustmentConceptDto } from './dto/update-commercial-adjustment-concept.dto';

const scopes = ['SALES', 'PURCHASES', 'BOTH'] as const;

@Injectable()
export class CommercialAdjustmentConceptsService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private normalizeScope(scope?: string) {
    if (!scope) return undefined;
    const normalized = scope.trim().toUpperCase();
    if (!scopes.includes(normalized as (typeof scopes)[number])) {
      throw new BadRequestException('El módulo debe ser SALES o PURCHASES.');
    }
    return normalized as 'SALES' | 'PURCHASES' | 'BOTH';
  }

  private async assertUniqueName(name: string, excludeId?: string) {
    const normalizedName = name.trim();
    if (!normalizedName) throw new BadRequestException('El nombre del concepto es obligatorio.');
    const existing = await this.prisma.commercial_adjustment_concepts.findMany({
      where: { deleted_at: null, id: excludeId ? { not: excludeId } : undefined },
      select: { id: true, name: true },
    });
    if (
      existing.some((concept) => concept.name.trim().toLocaleLowerCase('es') === normalizedName.toLocaleLowerCase('es'))
    ) {
      throw new ConflictException('Ya existe un concepto comercial con ese nombre en esta empresa.');
    }
  }

  async findAll(module?: string, includeInactive = false) {
    const scope = this.normalizeScope(module);
    return this.prisma.commercial_adjustment_concepts.findMany({
      where: {
        deleted_at: null,
        ...(includeInactive ? {} : { is_active: true }),
        ...(scope ? { applies_to: { in: [scope, 'BOTH'] } } : {}),
      },
      orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const concept = await this.prisma.commercial_adjustment_concepts.findFirst({
      where: { id, deleted_at: null },
    });
    if (!concept) throw new NotFoundException('Concepto comercial no encontrado.');
    return concept;
  }

  async create(dto: CreateCommercialAdjustmentConceptDto) {
    await this.assertUniqueName(dto.name);
    this.assertDefaultValue(dto.value_type, dto.default_value);
    return this.prisma.commercial_adjustment_concepts.create({
      data: {
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        applies_to: dto.applies_to,
        value_type: dto.value_type,
        basis: dto.basis,
        default_value: dto.default_value ?? null,
        sort_order: dto.sort_order ?? 0,
      },
    });
  }

  async update(id: string, dto: UpdateCommercialAdjustmentConceptDto) {
    const current = await this.findOne(id);
    const name = dto.name?.trim() ?? current.name;
    await this.assertUniqueName(name, id);
    const finalValueType = dto.value_type ?? current.value_type;
    const finalDefaultValue =
      dto.default_value !== undefined
        ? dto.default_value
        : current.default_value == null
          ? null
          : Number(current.default_value);
    this.assertDefaultValue(finalValueType, finalDefaultValue);
    return this.prisma.commercial_adjustment_concepts.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.name !== undefined ? { name } : {}),
        ...(dto.description !== undefined ? { description: dto.description?.trim() || null } : {}),
      },
    });
  }

  private assertDefaultValue(valueType: string, value?: number | null) {
    if (value == null) return;
    if (!Number.isFinite(value) || value <= 0)
      throw new BadRequestException('El valor predeterminado debe ser mayor que cero.');
    if (valueType === 'PERCENTAGE' && value > 100)
      throw new BadRequestException('El porcentaje predeterminado no puede superar el 100%.');
  }
}
