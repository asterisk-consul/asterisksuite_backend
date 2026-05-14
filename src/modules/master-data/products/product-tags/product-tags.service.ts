import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ProductTagsService {
  constructor(private prisma: PrismaService) {}

  async assign(productId: string, tagId: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const tag = await this.prisma.tags.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag no encontrado');
    }

    const existing = await this.prisma.product_tags.findUnique({
      where: {
        product_id_tag_id: {
          product_id: productId,
          tag_id: tagId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('El producto ya tiene asignado ese tag');
    }

    return this.prisma.product_tags.create({
      data: {
        product_id: productId,
        tag_id: tagId,
      },
    });
  }

  async remove(productId: string, tagId: string) {
    const existing = await this.prisma.product_tags.findUnique({
      where: {
        product_id_tag_id: {
          product_id: productId,
          tag_id: tagId,
        },
      },
    });

    if (!existing) {
      throw new NotFoundException('Relación producto-tag no encontrada');
    }

    return this.prisma.product_tags.delete({
      where: {
        product_id_tag_id: {
          product_id: productId,
          tag_id: tagId,
        },
      },
    });
  }

  async getProductTags(productId: string) {
    const product = await this.prisma.products.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return this.prisma.product_tags.findMany({
      where: {
        product_id: productId,
      },
      include: {
        tags: true,
      },
      orderBy: {
        tags: {
          name: 'asc',
        },
      },
    });
  }
}
