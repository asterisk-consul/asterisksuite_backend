import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductComponentDto } from './dto/create-product-component.dto';
import { UpdateProductComponentDto } from './dto/update-product-component.dto';

@Injectable()
export class ProductComponentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductComponentDto) {
    if (data.parent_product_id === data.child_product_id) {
      throw new BadRequestException(
        'Un producto no puede ser componente de sí mismo',
      );
    }

    await this.validateRelations(data);

    return this.prisma.product_components.create({
      data,
      include: {
        parent_product: true,
        child_product: true,
        child_variant: true,
        units: true,
      },
    });
  }

  async findAll() {
    return this.prisma.product_components.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        parent_product: true,
        child_product: true,
        child_variant: true,
        units: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const component = await this.prisma.product_components.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        parent_product: true,
        child_product: true,
        child_variant: true,
        units: true,
      },
    });

    if (!component) {
      throw new NotFoundException('Componente no encontrado');
    }

    return component;
  }

  async update(id: string, data: UpdateProductComponentDto) {
    const existing = await this.findOne(id);

    const parentId = data.parent_product_id ?? existing.parent_product_id;

    const childId = data.child_product_id ?? existing.child_product_id;

    if (parentId === childId) {
      throw new BadRequestException(
        'Un producto no puede ser componente de sí mismo',
      );
    }

    await this.validateRelations({
      ...existing,
      ...data,
    });

    return this.prisma.product_components.update({
      where: {
        id,
      },
      data,
      include: {
        parent_product: true,
        child_product: true,
        child_variant: true,
        units: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product_components.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
        active: false,
      },
    });
  }

  // ─────────────────────────────

  private async validateRelations(data: {
    parent_product_id: string;
    child_product_id: string;
    child_variant_id?: string | null;
    unit_id?: string | null;
  }) {
    const parent = await this.prisma.products.findUnique({
      where: {
        id: data.parent_product_id,
      },
    });

    if (!parent) {
      throw new NotFoundException('Producto padre no encontrado');
    }

    const child = await this.prisma.products.findUnique({
      where: {
        id: data.child_product_id,
      },
    });

    if (!child) {
      throw new NotFoundException('Producto hijo no encontrado');
    }

    if (data.child_variant_id) {
      const variant = await this.prisma.product_variants.findUnique({
        where: {
          id: data.child_variant_id,
        },
      });

      if (!variant) {
        throw new NotFoundException('Variante no encontrada');
      }
    }

    if (data.unit_id) {
      const unit = await this.prisma.units.findUnique({
        where: {
          id: data.unit_id,
        },
      });

      if (!unit) {
        throw new NotFoundException('Unidad no encontrada');
      }
    }
  }
}
