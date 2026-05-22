import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─────────────────────────────
  // CREATE
  // ─────────────────────────────

  async create(data: CreateProductDto) {
    if (data.sku) {
      const existing = await this.prisma.products.findFirst({
        where: {
          sku: data.sku,
          deleted_at: null,
        },
      });

      if (existing) {
        throw new ConflictException(
          `Ya existe un producto con SKU ${data.sku}`,
        );
      }
    }

    return this.prisma.products.create({
      data,
    });
  }

  // ─────────────────────────────
  // FIND ALL
  // ─────────────────────────────

  async findAll() {
    const products = await this.prisma.products.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
      include: {
        transfer_rate: true,

        income_account: true,
        expense_account: true,
        inventory_account: true,

        product_price: {
          where: {
            deleted_at: null,
          },
          include: {
            currencies: true,
          },
        },

        product_variants: {
          where: {
            deleted_at: null,
          },
          include: {
            product_attribute_values: {
              include: {
                attributes: true,
              },
            },
          },
        },

        product_categories: {
          where: {
            deleted_at: null,
          },
          include: {
            categories: true,
          },
        },

        product_tags: {
          include: {
            tags: true,
          },
        },

        product_attribute_values: {
          include: {
            attributes: true,
          },
        },

        product_taxes: {
          include: {
            taxes: true,
          },
        },

        parent_components: {
          where: {
            deleted_at: null,
          },
          include: {
            child_product: true,
            child_variant: true,
            units: true,
          },
        },

        child_components: {
          where: {
            deleted_at: null,
          },
          include: {
            parent_product: true,
          },
        },
      },
    });

    return Promise.all(
      products.map(async (product) => ({
        ...product,
        root_products: await this.getRootProducts(product.id),
      })),
    );
  }

  // ─────────────────────────────
  // FIND ONE
  // ─────────────────────────────

  async findOne(id: string) {
    const product = await this.prisma.products.findFirst({
      where: {
        id,
        deleted_at: null,
      },

      include: {
        transfer_rate: true,

        income_account: true,
        expense_account: true,
        inventory_account: true,

        product_price: {
          where: {
            deleted_at: null,
          },
          include: {
            currencies: true,
          },
        },

        product_variants: {
          where: {
            deleted_at: null,
          },
          include: {
            product_attribute_values: {
              include: {
                attributes: true,
              },
            },
          },
        },

        product_categories: {
          where: {
            deleted_at: null,
          },
          include: {
            categories: true,
          },
        },

        product_tags: {
          include: {
            tags: true,
          },
        },

        product_attribute_values: {
          include: {
            attributes: true,
          },
        },

        product_taxes: {
          include: {
            taxes: true,
          },
        },

        parent_components: {
          where: {
            deleted_at: null,
          },
          include: {
            child_product: true,
            child_variant: true,
            units: true,
          },
        },

        child_components: {
          where: {
            deleted_at: null,
          },
          include: {
            parent_product: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    return {
      ...product,
      root_products: await this.getRootProducts(id),
    };
  }

  // ─────────────────────────────
  // UPDATE
  // ─────────────────────────────

  async update(id: string, data: UpdateProductDto) {
    await this.findOne(id);

    if (data.sku) {
      const existing = await this.prisma.products.findFirst({
        where: {
          sku: data.sku,
          id: {
            not: id,
          },
          deleted_at: null,
        },
      });

      if (existing) {
        throw new ConflictException(
          `Ya existe otro producto con SKU ${data.sku}`,
        );
      }
    }

    return this.prisma.products.update({
      where: {
        id,
      },
      data,
    });
  }

  // ─────────────────────────────
  // REMOVE
  // ─────────────────────────────

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.products.update({
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
  // ROOT PRODUCTS
  // ─────────────────────────────

  async getRootProducts(productId: string) {
    const visited = new Set<string>();

    const roots = await this.findRootsRecursive(productId, visited);

    return roots;
  }

  private async findRootsRecursive(
    productId: string,
    visited: Set<string>,
  ): Promise<any[]> {
    if (visited.has(productId)) {
      return [];
    }

    visited.add(productId);

    const parents = await this.prisma.product_components.findMany({
      where: {
        child_product_id: productId,
        deleted_at: null,
      },
      include: {
        parent_product: true,
      },
    });

    // no tiene padre → es root
    if (!parents.length) {
      const self = await this.prisma.products.findUnique({
        where: {
          id: productId,
        },
      });

      return self ? [self] : [];
    }

    let roots: any[] = [];

    for (const parent of parents) {
      const parentRoots = await this.findRootsRecursive(
        parent.parent_product_id,
        visited,
      );

      roots.push(...parentRoots);
    }

    // unique
    return roots.filter(
      (root, index, arr) => arr.findIndex((x) => x.id === root.id) === index,
    );
  }
}
