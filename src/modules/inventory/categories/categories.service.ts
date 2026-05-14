import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    if (data.slug) {
      const exists = await this.prisma.categories.findFirst({
        where: {
          slug: data.slug,
          deleted_at: null,
        },
      });

      if (exists) {
        throw new ConflictException('Slug already exists');
      }
    }

    if (data.parent_id) {
      await this.validateParent(data.parent_id);
    }

    return this.prisma.categories.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.categories.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        parent: true,
        children: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findTree() {
    const categories = await this.prisma.categories.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        children: {
          where: {
            deleted_at: null,
          },
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories.filter((x) => !x.parent_id);
  }

  async findOne(id: string) {
    const category = await this.prisma.categories.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        parent: true,
        children: true,
        product_categories: {
          include: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, data: UpdateCategoryDto) {
    await this.findOne(id);

    if (data.parent_id) {
      if (data.parent_id === id) {
        throw new ConflictException('Category cannot be parent of itself');
      }

      await this.validateParent(data.parent_id);
    }

    if (data.slug) {
      const exists = await this.prisma.categories.findFirst({
        where: {
          slug: data.slug,
          id: {
            not: id,
          },
          deleted_at: null,
        },
      });

      if (exists) {
        throw new ConflictException('Slug already exists');
      }
    }

    return this.prisma.categories.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, deletedBy?: string) {
    await this.findOne(id);

    return this.prisma.categories.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: deletedBy,
        active: false,
      },
    });
  }

  // ─────────────────────────────

  private async validateParent(parentId: string) {
    const parent = await this.prisma.categories.findFirst({
      where: {
        id: parentId,
        deleted_at: null,
      },
    });

    if (!parent) {
      throw new NotFoundException('Parent category not found');
    }
  }
}
