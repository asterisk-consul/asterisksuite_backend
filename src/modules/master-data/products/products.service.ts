import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

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
        throw new ConflictException(`Ya existe un producto con SKU ${data.sku}`);
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
    const searchPath = await this.prisma.$queryRawUnsafe('SHOW search_path');

    console.log('SEARCH PATH:', searchPath);
    return this.prisma.products.findMany({
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

        // ─────────────
        // PRECIOS
        // ─────────────

        product_price: {
          where: {
            deleted_at: null,
          },
          include: {
            currencies: true,
          },
        },

        // ─────────────
        // Costos
        // ─────────────
        product_costs: {
          select: {
            total_cost: true,
            currencies: {
              select: {
                id: true,
                code: true,
                name: true,
                symbol: true,
              },
            },
          },
        },

        // ─────────────
        // CATEGORÍAS
        // ─────────────

        product_categories: {
          where: {
            deleted_at: null,
          },
          include: {
            categories: true,
          },
        },

        // ─────────────
        // TAGS
        // ─────────────

        product_tags: {
          include: {
            tags: true,
          },
        },

        // ─────────────
        // TAXES
        // ─────────────

        product_taxes: {
          include: {
            taxes: true,
          },
        },

        // ─────────────
        // CATEGORÍA FISCAL
        // ─────────────

        tax_category: true,
      },
    });
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

        // ─────────────
        // Costos
        // ─────────────
        product_costs: {
          select: {
            total_cost: true,
            currencies: {
              select: {
                id: true,
                code: true,
                name: true,
                symbol: true,
              },
            },
          },
        },

        // ─────────────
        // PRECIOS
        // ─────────────

        product_price: {
          where: {
            deleted_at: null,
          },
          include: {
            currencies: true,
          },
        },

        // ─────────────
        // VARIANTES
        // ─────────────

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

            // PRECIOS DE LA VARIANTE
            productVariantPrices: {
              where: {
                deleted_at: null,
                active: true,
              },
              include: {
                currency: true,
              },
            },

            // COSTOS DE LA VARIANTE
            productVariantCosts: {
              where: {
                deleted_at: null,
                active: true,
              },
              include: {
                currency: true,
              },
              orderBy: {
                effective_date: 'desc',
              },
            },
          },
        },

        // ─────────────
        // CATEGORÍAS
        // ─────────────

        product_categories: {
          where: {
            deleted_at: null,
          },
          include: {
            categories: true,
          },
        },

        // ─────────────
        // TAGS
        // ─────────────

        product_tags: {
          include: {
            tags: true,
          },
        },

        // ─────────────
        // ATRIBUTOS
        // ─────────────

        product_attribute_values: {
          include: {
            attributes: true,
          },
        },

        // ─────────────
        // IMPUESTOS
        // ─────────────

        product_taxes: {
          include: {
            taxes: true,
          },
        },

        // ─────────────
        // CATEGORÍA FISCAL
        // ─────────────

        tax_category: true,

        // ─────────────
        // HIJOS — registros donde este producto es el PADRE
        // parent_components = "yo soy el padre, el hijo es child_product"
        // ─────────────
        parent_components: {
          where: {
            deleted_at: null,
          },
          include: {
            child_product: {
              // ← el producto hijo
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
            child_variant: true,
            units: true,
          },
        },

        // ─────────────
        // PADRES — registros donde este producto es el HIJO
        // child_components = "yo soy el hijo, el padre es parent_product"
        // ─────────────
        child_components: {
          where: {
            deleted_at: null,
            parent_product: {
              deleted_at: null,
            },
          },
          include: {
            parent_product: {
              // ← el producto padre
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
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
        throw new ConflictException(`Ya existe otro producto con SKU ${data.sku}`);
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

    return this.findRootsRecursive(productId, visited);
  }

  private async findRootsRecursive(productId: string, visited: Set<string>): Promise<any[]> {
    // evita loops
    if (visited.has(productId)) {
      return [];
    }

    visited.add(productId);

    const parents = await this.prisma.product_components.findMany({
      where: {
        child_product_id: productId,

        deleted_at: null,

        parent_product: {
          deleted_at: null,
        },
      },

      include: {
        parent_product: true,
      },
    });

    // no tiene padres → es root
    if (!parents.length) {
      const self = await this.prisma.products.findFirst({
        where: {
          id: productId,
          deleted_at: null,
        },
      });

      return self ? [self] : [];
    }

    let roots: any[] = [];

    for (const parent of parents) {
      const parentRoots = await this.findRootsRecursive(parent.parent_product_id, visited);

      roots.push(...parentRoots);
    }

    // unique roots
    return roots.filter((root, index, arr) => arr.findIndex((x) => x.id === root.id) === index);
  }
}
