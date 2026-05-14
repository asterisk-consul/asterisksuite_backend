import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { AssignProductCategoryDto } from './dto/assign-product-category.dto';
import { BulkAssignProductCategoriesDto } from './dto/bulk-assign-product-categories.dto';

@Injectable()
export class ProductCategoriesService {
  constructor(private prisma: PrismaService) {}

  async assign(data: AssignProductCategoryDto) {
    await this.validateProduct(data.product_id);
    await this.validateCategory(data.category_id);

    const exists = await this.prisma.product_categories.findUnique({
      where: {
        product_id_category_id: {
          product_id: data.product_id,
          category_id: data.category_id,
        },
      },
    });

    if (exists && !exists.deleted_at) {
      throw new ConflictException('Category already assigned to product');
    }

    if (exists && exists.deleted_at) {
      return this.prisma.product_categories.update({
        where: {
          product_id_category_id: {
            product_id: data.product_id,
            category_id: data.category_id,
          },
        },
        data: {
          deleted_at: null,
          deleted_by: null,
          active: true,
        },
      });
    }

    return this.prisma.product_categories.create({
      data,
    });
  }

  async bulkAssign(data: BulkAssignProductCategoriesDto) {
    await this.validateProduct(data.product_id);

    for (const categoryId of data.category_ids) {
      await this.validateCategory(categoryId);
    }

    const operations = data.category_ids.map((categoryId) =>
      this.prisma.product_categories.upsert({
        where: {
          product_id_category_id: {
            product_id: data.product_id,
            category_id: categoryId,
          },
        },
        update: {
          deleted_at: null,
          deleted_by: null,
        },
        create: {
          product_id: data.product_id,
          category_id: categoryId,
        },
      }),
    );

    return Promise.all(operations);
  }

  async getProductCategories(productId: string) {
    return this.prisma.product_categories.findMany({
      where: {
        product_id: productId,
        deleted_at: null,
      },
      include: {
        categories: true,
      },
      orderBy: {
        created_at: 'asc',
      },
    });
  }

  async remove(productId: string, categoryId: string) {
    const relation = await this.prisma.product_categories.findUnique({
      where: {
        product_id_category_id: {
          product_id: productId,
          category_id: categoryId,
        },
      },
    });

    if (!relation || relation.deleted_at) {
      throw new NotFoundException('Product category relation not found');
    }

    return this.prisma.product_categories.update({
      where: {
        product_id_category_id: {
          product_id: productId,
          category_id: categoryId,
        },
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  // ─────────────────────────────

  private async validateProduct(productId: string) {
    const product = await this.prisma.products.findFirst({
      where: {
        id: productId,
        deleted_at: null,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }

  private async validateCategory(categoryId: string) {
    const category = await this.prisma.categories.findFirst({
      where: {
        id: categoryId,
        deleted_at: null,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
  }
}
