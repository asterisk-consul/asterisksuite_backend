// cost-templates.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

export interface CreateCostComponentDto {
  name: string;
  type: 'MATERIAL' | 'LABOR' | 'OVERHEAD' | 'OTHER';
  value_type: 'FROM_BOM' | 'PERCENTAGE_OF_MATERIAL' | 'PERCENTAGE_OF_TOTAL' | 'FIXED_PER_UNIT';
  value?: number;
  order?: number;
}

export interface CreateCostTemplateDto {
  name: string;
  description?: string;
  is_default?: boolean;
  components: {
    cost_component_id: string;
    value_override?: number;
    order: number;
  }[];
}

export interface UpdateTemplateComponentDto {
  value_override?: number | null;
  order?: number;
}

@Injectable()
export class CostTemplatesService {
  constructor(private readonly db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─── Componentes ──────────────────────────────────────────────────────────

  async findAllComponents() {
    return this.prisma.cost_components.findMany({
      where: { deleted_at: null, active: true },
      orderBy: { order: 'asc' },
    });
  }

  async createComponent(dto: CreateCostComponentDto) {
    return this.prisma.cost_components.create({
      data: {
        name: dto.name,
        type: dto.type,
        value_type: dto.value_type,
        value: dto.value ?? null,
        order: dto.order ?? 0,
      },
    });
  }

  async updateComponent(id: string, dto: Partial<CreateCostComponentDto>) {
    await this.findComponentOrFail(id);

    return this.prisma.cost_components.update({
      where: { id },
      data: {
        ...dto,
        updated_at: new Date(),
      },
    });
  }

  async deleteComponent(id: string) {
    await this.findComponentOrFail(id);

    return this.prisma.cost_components.update({
      where: { id },
      data: { deleted_at: new Date(), active: false },
    });
  }

  // ─── Templates ────────────────────────────────────────────────────────────

  async findAll() {
    return this.prisma.cost_templates.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
      include: {
        components: {
          orderBy: { order: 'asc' },
          include: { component: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.cost_templates.findFirst({
      where: { id, deleted_at: null },
      include: {
        components: {
          orderBy: { order: 'asc' },
          include: { component: true },
        },
      },
    });

    if (!template) throw new NotFoundException('Template no encontrado');
    return template;
  }

  async create(dto: CreateCostTemplateDto) {
    if (dto.is_default) {
      await this.clearDefault();
    }

    return this.prisma.cost_templates.create({
      data: {
        name: dto.name,
        description: dto.description ?? null,
        is_default: dto.is_default ?? false,
        components: {
          create: dto.components.map((c) => ({
            cost_component_id: c.cost_component_id,
            value_override: c.value_override ?? null,
            order: c.order,
          })),
        },
      },
      include: {
        components: {
          include: { component: true },
        },
      },
    });
  }

  async update(id: string, dto: Partial<Omit<CreateCostTemplateDto, 'components'>>) {
    await this.findOne(id);

    if (dto.is_default) {
      await this.clearDefault();
    }

    return this.prisma.cost_templates.update({
      where: { id },
      data: { ...dto, updated_at: new Date() },
      include: {
        components: {
          include: { component: true },
        },
      },
    });
  }

  async delete(id: string) {
    const template = await this.findOne(id);

    if (template.is_default) {
      throw new ConflictException('No se puede eliminar el template predeterminado');
    }

    const productsCount = await this.prisma.products.count({
      where: { cost_template_id: id },
    });

    if (productsCount > 0) {
      throw new ConflictException(
        `Este template está en uso por ${productsCount} producto(s). Reasignelos antes de eliminar.`,
      );
    }

    return this.prisma.cost_templates.update({
      where: { id },
      data: { deleted_at: new Date(), active: false },
    });
  }

  // ─── Componentes dentro de un template ───────────────────────────────────

  async addComponent(templateId: string, dto: { cost_component_id: string; value_override?: number; order: number }) {
    await this.findOne(templateId);
    await this.findComponentOrFail(dto.cost_component_id);

    return this.prisma.cost_template_components.create({
      data: {
        template_id: templateId,
        cost_component_id: dto.cost_component_id,
        value_override: dto.value_override ?? null,
        order: dto.order,
      },
      include: { component: true },
    });
  }

  async updateTemplateComponent(templateId: string, componentId: string, dto: UpdateTemplateComponentDto) {
    // componentId es el id de la fila en cost_template_components
    const tc = await this.prisma.cost_template_components.findFirst({
      where: { id: componentId, template_id: templateId },
    });

    if (!tc) throw new NotFoundException('Componente no encontrado en este template');

    return this.prisma.cost_template_components.update({
      where: { id: tc.id },
      data: dto,
      include: { component: true },
    });
  }

  async removeComponent(templateId: string, componentId: string) {
    // componentId es el id de la fila en cost_template_components
    const tc = await this.prisma.cost_template_components.findFirst({
      where: { id: componentId, template_id: templateId },
    });

    if (!tc) throw new NotFoundException('Componente no encontrado en este template');

    return this.prisma.cost_template_components.delete({
      where: { id: tc.id },
    });
  }

  // ─── Asignar template a producto ─────────────────────────────────────────

  async assignToProduct(productId: string, templateId: string) {
    await this.findOne(templateId);

    return this.prisma.products.update({
      where: { id: productId },
      data: { cost_template_id: templateId },
      select: { id: true, name: true, sku: true, cost_template_id: true },
    });
  }

  async removeFromProduct(productId: string) {
    return this.prisma.products.update({
      where: { id: productId },
      data: { cost_template_id: null },
      select: { id: true, name: true, sku: true, cost_template_id: true },
    });
  }

  // ─── Helpers privados ─────────────────────────────────────────────────────

  private async findComponentOrFail(id: string) {
    const component = await this.prisma.cost_components.findFirst({
      where: { id, deleted_at: null },
    });
    if (!component) throw new NotFoundException('Componente de costo no encontrado');
    return component;
  }

  private async clearDefault() {
    await this.prisma.cost_templates.updateMany({
      where: { is_default: true },
      data: { is_default: false },
    });
  }
}
