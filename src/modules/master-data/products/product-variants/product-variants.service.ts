import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private readonly db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ─────────────────────────────────────────────
  // NORMALIZE TECHNICAL FIELDS
  // ─────────────────────────────────────────────

  private normalizeTechnicalFields<T extends CreateProductVariantDto | UpdateProductVariantDto>(data: T): T {
    const thicknessM = Number(data.thickness_mm || 0) / 1000;

    let density = Number(data.density_kg_m3 || 0);

    let kgPerM2 = Number(data.weight_per_m2_kg || 0);

    /**
     * kg/m² → density
     *
     * density = kg_m2 / thickness(m)
     */
    if (!density && kgPerM2 > 0 && thicknessM > 0) {
      density = kgPerM2 / thicknessM;
    }

    /**
     * density → kg/m²
     *
     * kg_m2 = density * thickness(m)
     */
    if (!kgPerM2 && density > 0 && thicknessM > 0) {
      kgPerM2 = density * thicknessM;
    }

    return {
      ...data,
      density_kg_m3: density || undefined,
      weight_per_m2_kg: kgPerM2 || undefined,
    };
  }

  // ─────────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────────

  async create(data: CreateProductVariantDto) {
    const product = await this.prisma.products.findUnique({
      where: {
        id: data.product_id,
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (data.sku) {
      const existingSku = await this.prisma.product_variants.findFirst({
        where: {
          sku: data.sku,
        },
      });

      if (existingSku) {
        throw new ConflictException('Ya existe una variante con ese SKU');
      }
    }

    const normalized = this.normalizeTechnicalFields(data);

    return this.prisma.product_variants.create({
      data: normalized,
    });
  }

  // ─────────────────────────────────────────────
  // FIND ALL
  // ─────────────────────────────────────────────

  async findAll() {
    return this.prisma.product_variants.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        products: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // ─────────────────────────────────────────────
  // FIND ONE
  // ─────────────────────────────────────────────

  async findOne(id: string) {
    const variant = await this.prisma.product_variants.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        products: true,
        product_attribute_values: {
          include: {
            attributes: true,
          },
        },
      },
    });

    if (!variant) {
      throw new NotFoundException('Variante no encontrada');
    }

    return variant;
  }

  // ─────────────────────────────────────────────
  // FIND BY PRODUCT
  // ─────────────────────────────────────────────

  async findByProduct(productId: string) {
    return this.prisma.product_variants.findMany({
      where: {
        product_id: productId,
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // ─────────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────────

  async update(id: string, data: UpdateProductVariantDto) {
    await this.findOne(id);

    if (data.sku) {
      const existingSku = await this.prisma.product_variants.findFirst({
        where: {
          sku: data.sku,
          NOT: {
            id,
          },
        },
      });

      if (existingSku) {
        throw new ConflictException('Ya existe otra variante con ese SKU');
      }
    }

    const normalized = this.normalizeTechnicalFields(data);

    return this.prisma.product_variants.update({
      where: { id },
      data: normalized,
    });
  }

  // ─────────────────────────────────────────────
  // REMOVE
  // ─────────────────────────────────────────────

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product_variants.update({
      where: { id },
      data: {
        active: false,
        deleted_at: new Date(),
      },
    });
  }
}
