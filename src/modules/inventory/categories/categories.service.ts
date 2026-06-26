import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateCategoryDto } from './dto/create-category.dto';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { ReorderCategoryDto } from './dto/reorder-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // =========================================================
  // CREATE
  // =========================================================

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

    const lastCategory = await this.prisma.categories.findFirst({
      where: {
        parent_id: data.parent_id ?? null,

        deleted_at: null,
      },

      orderBy: {
        sort_order: 'desc',
      },
    });

    const sortOrder = lastCategory ? lastCategory.sort_order + 1 : 0;

    return this.prisma.categories.create({
      data: {
        ...data,
        sort_order: sortOrder,
      },
    });
  }

  // =========================================================
  // FIND ALL
  // =========================================================

  async findAll() {
    return this.prisma.categories.findMany({
      where: {
        deleted_at: null,
      },

      include: {
        parent: true,
        children: {
          orderBy: [
            {
              sort_order: 'asc',
            },
            {
              name: 'asc',
            },
          ],
        },
      },

      orderBy: [
        {
          sort_order: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });
  }

  // =========================================================
  // TREE
  // =========================================================

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

          orderBy: [
            {
              sort_order: 'asc',
            },
            {
              name: 'asc',
            },
          ],

          include: {
            children: {
              where: {
                deleted_at: null,
              },

              orderBy: [
                {
                  sort_order: 'asc',
                },
                {
                  name: 'asc',
                },
              ],
            },
          },
        },
      },

      orderBy: [
        {
          sort_order: 'asc',
        },
        {
          name: 'asc',
        },
      ],
    });

    return categories.filter((x) => !x.parent_id);
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  async findOne(id: string) {
    const category = await this.prisma.categories.findFirst({
      where: {
        id,
        deleted_at: null,
      },

      include: {
        parent: true,

        children: {
          orderBy: [
            {
              sort_order: 'asc',
            },
            {
              name: 'asc',
            },
          ],
        },

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

  // =========================================================
  // UPDATE
  // =========================================================

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

  // =========================================================
  // REORDER
  // =========================================================

  async reorder(id: string, data: ReorderCategoryDto) {
    await this.findOne(id);

    if (data.parent_id) {
      if (data.parent_id === id) {
        throw new ConflictException('Category cannot be parent of itself');
      }

      await this.validateParent(data.parent_id);
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.categories.update({
        where: { id },

        data: {
          parent_id: data.parent_id ?? null,
        },
      });

      const siblings = await tx.categories.findMany({
        where: {
          parent_id: data.parent_id ?? null,

          deleted_at: null,
        },

        orderBy: [
          {
            sort_order: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      });

      const reordered = siblings.filter((x) => x.id !== id);

      reordered.splice(data.sort_order, 0, {
        ...(await tx.categories.findUniqueOrThrow({
          where: { id },
        })),
      });

      for (let index = 0; index < reordered.length; index++) {
        await tx.categories.update({
          where: {
            id: reordered[index].id,
          },

          data: {
            sort_order: index,
          },
        });
      }

      return tx.categories.findMany({
        where: {
          deleted_at: null,
        },

        include: {
          children: true,
        },

        orderBy: [
          {
            sort_order: 'asc',
          },
          {
            name: 'asc',
          },
        ],
      });
    });
  }

  // =========================================================
  // DELETE
  // =========================================================

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

  // =========================================================
  // HELPERS
  // =========================================================

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
