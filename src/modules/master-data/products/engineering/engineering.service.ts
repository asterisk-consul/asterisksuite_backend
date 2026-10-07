import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { ProductComponentsService } from '../product-components/product-components.service';
import { EngineeringTreeService } from './engineering-tree.service';
import { EngineeringCalculationService } from './engineering-calculation.service';

import { CreateEngineeringComponentDto } from './dto/create-engineering-component.dto';
import { ProductStructureVersionService } from './product-structure-version.service';

@Injectable()
export class EngineeringService {
  constructor(
    private readonly db: PrismaService,
    private readonly productComponentsService: ProductComponentsService, // ← inyectar
    private readonly engineeringTreeService: EngineeringTreeService,
    private readonly engineeringCalculationService: EngineeringCalculationService,
    private readonly productStructureVersionService: ProductStructureVersionService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // =========================
  // CREATE — delega en ProductComponentsService
  // que ya tiene validación de circular ref + relaciones
  // =========================

  async createComponent(dto: CreateEngineeringComponentDto) {
    return this.productComponentsService.create({
      parent_product_id: dto.parent_product_id,
      child_product_id: dto.child_product_id,
      child_variant_id: dto.child_variant_id,
      structure_variant_id: dto.structure_variant_id,
      quantity: dto.quantity,
      unit_id: dto.unit_id,
      length_mm: dto.length_mm,
      width_mm: dto.width_mm,
      height_mm: dto.height_mm,
      waste_percentage: dto.waste_percentage,
      order: dto.order,
      active: dto.active ?? true,
    });
  }

  // =========================
  // UPDATE — delega en ProductComponentsService
  // =========================

  async updateComponent(id: string, dto: Partial<CreateEngineeringComponentDto>) {
    return this.productComponentsService.update(id, dto);
  }

  // =========================
  // DELETE — delega en ProductComponentsService (soft delete)
  // =========================

  async deleteComponent(id: string) {
    return this.productComponentsService.remove(id);
  }

  // =========================
  // REORDER — solo actualiza order, sin validaciones extra
  // =========================

  async reorderComponents(items: { id: string; order: number }[]) {
    await Promise.all(
      items.map((item) =>
        this.prisma.product_components.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );

    const first = await this.prisma.product_components.findUnique({
      where: {
        id: items[0].id,
      },
    });

    if (first) {
      await this.productStructureVersionService.createVersion(first.parent_product_id);
    }

    return {
      reordered: items.length,
    };
  }
  // =========================
  // MOVE — cambia el padre del componente
  // newParentProductId null = mover a raíz del árbol
  // =========================

  async moveComponent(componentId: string, newParentProductId: string | null, productRootId: string) {
    // Verificar que el componente existe
    const component = await this.productComponentsService.findOne(componentId);

    // Si newParentProductId es null, el nuevo padre es la raíz del árbol
    const targetParentId = newParentProductId ?? productRootId;

    // No tiene sentido mover al mismo padre
    if (targetParentId === component.parent_product_id) {
      return component;
    }

    // Delega en ProductComponentsService que valida:
    // - que no sea componente de sí mismo
    // - referencias circulares
    // - que el producto padre exista
    return this.productComponentsService.update(componentId, {
      parent_product_id: targetParentId,
      order: 9999, // va al final, el usuario reordena después
    });
  }
  // =========================
  // TREE
  // =========================

  async getEngineeringTree(productId: string, variantId?: string, currencyId?: string) {
    return this.engineeringTreeService.buildTree(productId, variantId, 0, currencyId);
  }

  async getVariantStructureStatus(productId: string, variantId: string) {
    await this.assertVariant(productId, variantId);
    const componentCount = await this.prisma.product_components.count({
      where: { parent_product_id: productId, structure_variant_id: variantId, deleted_at: null },
    });
    return { customized: componentCount > 0, component_count: componentCount };
  }

  async customizeVariantStructure(productId: string, variantId: string) {
    await this.assertVariant(productId, variantId);
    const existing = await this.getVariantStructureStatus(productId, variantId);
    if (existing.customized) return existing;

    const base = await this.prisma.product_components.findMany({
      where: { parent_product_id: productId, structure_variant_id: null, deleted_at: null, active: true },
      orderBy: { order: 'asc' },
    });
    if (base.length) {
      await this.prisma.product_components.createMany({
        data: base.map(({ id, created_at, updated_at, deleted_at, created_by, updated_by, deleted_by, ...component }) => ({
          ...component,
          structure_variant_id: variantId,
        })),
      });
    }
    return { customized: true, component_count: base.length };
  }

  private async assertVariant(productId: string, variantId: string) {
    const variant = await this.prisma.product_variants.findFirst({
      where: { id: variantId, product_id: productId, deleted_at: null, active: true },
      select: { id: true },
    });
    if (!variant) throw new NotFoundException('La variante no pertenece al producto');
  }

  // =========================
  // CALCULATE
  // =========================

  async calculate(productId: string, variantId?: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Producto no encontrado');

    if (variantId) await this.assertVariant(productId, variantId);
    const tree = await this.engineeringTreeService.buildTree(productId, variantId);

    const mode = product.cost_source === 'BOM' ? 'BOM' : 'ENGINEERING';
    return this.engineeringCalculationService.calculateTree(tree, mode);
  }
}
