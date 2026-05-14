import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.product_variants.create({
      data: {
        ...data,
      },
    });
  }

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

    return this.prisma.product_variants.update({
      where: { id },
      data,
    });
  }

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
