// product-components.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateProductComponentDto } from './dto/create-product-component.dto';
import { UpdateProductComponentDto } from './dto/update-product-component.dto';
import { ProductStructureVersionService } from '../engineering/product-structure-version.service';

@Injectable()
export class ProductComponentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productStructureVersionService: ProductStructureVersionService,
  ) {}

  async create(data: CreateProductComponentDto) {
    if (data.parent_product_id === data.child_product_id) {
      throw new BadRequestException('Un producto no puede ser componente de sí mismo');
    }

    // Validar circular ref en create también
    await this.validateNoCircularReference(data.parent_product_id, data.child_product_id);
    await this.validateRelations(data);

    const component = await this.prisma.product_components.create({
      data,
      include: {
        parent_product: true,
        child_product: true,
        child_variant: true,
        units: true,
      },
    });

    await this.productStructureVersionService.createVersion(component.parent_product_id);

    return component;
  }

  async update(id: string, data: UpdateProductComponentDto) {
    const existing = await this.findOne(id);

    const parentId = data.parent_product_id ?? existing.parent_product_id;
    const childId = data.child_product_id ?? existing.child_product_id;

    if (parentId === childId) {
      throw new BadRequestException('Un producto no puede ser componente de sí mismo');
    }

    // ← fix: validar circular ref si cambió el padre
    if (data.parent_product_id && data.parent_product_id !== existing.parent_product_id) {
      await this.validateNoCircularReference(parentId, childId);
    }

    await this.validateRelations({ ...existing, ...data });

    const component = await this.prisma.product_components.update({
      where: { id },
      data,
      include: {
        parent_product: true,
        child_product: true,
        child_variant: true,
        units: true,
      },
    });

    await this.productStructureVersionService.createVersion(component.parent_product_id);

    return component;
  }

  // ─── resto de métodos sin cambios ────────────────────────────

  async findAll() {
    return this.prisma.product_components.findMany({
      where: { deleted_at: null },
      include: { parent_product: true, child_product: true, child_variant: true, units: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const component = await this.prisma.product_components.findFirst({
      where: { id, deleted_at: null },
      include: { parent_product: true, child_product: true, child_variant: true, units: true },
    });
    if (!component) throw new NotFoundException('Componente no encontrado');
    return component;
  }

  async remove(id: string) {
    const component = await this.findOne(id);

    const deleted = await this.prisma.product_components.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        active: false,
      },
    });

    await this.productStructureVersionService.createVersion(component.parent_product_id);

    return deleted;
  }

  // ─── validación circular (extraída del EngineeringValidationService) ──────

  async validateNoCircularReference(parentProductId: string, childProductId: string) {
    const exists = await this.existsPath(childProductId, parentProductId);
    if (exists) {
      throw new BadRequestException('No se puede mover el componente: generaría una referencia circular');
    }
  }

  private async existsPath(currentId: string, targetId: string): Promise<boolean> {
    const children = await this.prisma.product_components.findMany({
      where: { parent_product_id: currentId, deleted_at: null },
    });

    for (const child of children) {
      if (child.child_product_id === targetId) return true;
      if (await this.existsPath(child.child_product_id, targetId)) return true;
    }

    return false;
  }

  private async validateRelations(data: {
    parent_product_id: string;
    child_product_id: string;
    child_variant_id?: string | null;
    unit_id?: string | null;
  }) {
    const parent = await this.prisma.products.findUnique({ where: { id: data.parent_product_id } });
    if (!parent) throw new NotFoundException('Producto padre no encontrado');

    const child = await this.prisma.products.findUnique({ where: { id: data.child_product_id } });
    if (!child) throw new NotFoundException('Producto hijo no encontrado');

    if (data.child_variant_id) {
      const variant = await this.prisma.product_variants.findUnique({ where: { id: data.child_variant_id } });
      if (!variant) throw new NotFoundException('Variante no encontrada');
    }

    if (data.unit_id) {
      const unit = await this.prisma.units.findUnique({ where: { id: data.unit_id } });
      if (!unit) throw new NotFoundException('Unidad no encontrada');
    }
  }
}
