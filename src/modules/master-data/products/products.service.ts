import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  dateFilter,
  numberFilter,
  parseServerTableFilters,
  stringFilter,
} from '@/common/utils/server-table-filters';

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
        throw new ConflictException(`Producto duplicado: ya existe un producto con SKU ${data.sku}`);
      }
    }

    return this.prisma.products.create({
      data,
    });
  }

  // ─────────────────────────────
  // FIND ALL
  // ─────────────────────────────

  async findAll(
    page?: number,
    pageSize?: number,
    search?: string,
    sort?: string,
    order?: 'asc' | 'desc',
    rawFilters?: string,
  ) {
    const term = search?.trim();
    const filters = parseServerTableFilters(rawFilters);
    const filterConditions = filters.flatMap((filter): any[] => {
      switch (filter.column) {
        case 'name':
        case 'sku': {
          const condition = stringFilter(filter.value, filter.operator);
          return condition ? [{ [filter.column]: condition }] : [];
        }
        case 'category_id':
        case 'tag_id': {
          const id = String(filter.value ?? '');
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
            return [];
          }
          return filter.column === 'category_id'
            ? [{ product_categories: { some: { category_id: id, deleted_at: null } } }]
            : [{ product_tags: { some: { tag_id: id, deleted_at: null } } }];
        }
        case 'product_type': {
          const allowed = ['RAW_MATERIAL', 'FINISHED_PRODUCT', 'SEMI_FINISHED', 'SERVICE', 'RATES'];
          return allowed.includes(String(filter.value)) ? [{ product_type: filter.value }] : [];
        }
        case 'cost_source': {
          const allowed = ['MANUAL', 'PURCHASE', 'ENGINEERING', 'BOM', 'RATE'];
          return allowed.includes(String(filter.value)) ? [{ cost_source: filter.value }] : [];
        }
        case 'current_cost': {
          const condition = numberFilter(filter.value, filter.operator);
          return condition !== undefined ? [{ current_cost: condition }] : [];
        }
        case 'active':
        case 'manages_stock':
        case 'needs_cost_recalculation':
          return [{ [filter.column]: filter.value === true || String(filter.value) === 'true' }];
        case 'created_at':
        case 'updated_at': {
          const condition = dateFilter(filter.value, filter.operator);
          return condition ? [{ [filter.column]: condition }] : [];
        }
        default:
          return [];
      }
    });
    const where: any = {
      deleted_at: null,
      ...(term ? {
        OR: [
          { sku: { contains: term, mode: 'insensitive' } },
          { name: { contains: term, mode: 'insensitive' } },
        ],
      } : {}),
      ...(filterConditions.length ? { AND: filterConditions } : {}),
    };
    const paginationEnabled = Number.isFinite(page) && Number.isFinite(pageSize);
    const safePage = Math.max(1, Math.trunc(page ?? 1));
    const safePageSize = Math.min(100, Math.max(1, Math.trunc(pageSize ?? 25)));
    const sortableFields = new Set(['sku', 'name', 'product_type', 'last_cost_calculated_at', 'created_at']);
    const sortField = sortableFields.has(sort ?? '') ? sort! : 'created_at';
    const listSelect = {
      id: true,
      name: true,
      sku: true,
      requires_refrigeration: true,
      price_enabled: true,
      active: true,
      product_type: true,
      usage_type: true,
      is_composed: true,
      has_engineering: true,
      manages_stock: true,
      cost_source: true,
      needs_cost_recalculation: true,
      last_cost_calculated_at: true,
      current_cost: true,
      cost_template_id: true,
      created_at: true,
      updated_at: true,
      product_categories: {
        where: { deleted_at: null },
        select: {
          category_id: true,
          categories: { select: { id: true, name: true, parent_id: true } },
        },
      },
      product_tags: {
        where: { deleted_at: null },
        select: {
          tag_id: true,
          tags: { select: { id: true, name: true } },
        },
      },
    };
    const query: any = {
      where,

      orderBy: {
        [sortField]: order === 'asc' ? 'asc' : 'desc',
      },

      ...(paginationEnabled ? { skip: (safePage - 1) * safePageSize, take: safePageSize } : {}),

      ...(paginationEnabled ? { select: listSelect } : { include: {
        transfer_rate: true,
        current_cost_currency: true,

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
        unit: true,

        // ─────────────
        // VARIANTES (solo IDs para saber si tiene)
        // ─────────────

        product_variants: {
          select: { id: true, name: true, sku: true, active: true },
          where: { deleted_at: null, active: true },
        },
      } }),
    };
    const [items, total] = await Promise.all([
      this.prisma.products.findMany(query),
      paginationEnabled ? this.prisma.products.count({ where }) : Promise.resolve(0),
    ]);
    if (!paginationEnabled) return items;
    return {
      items,
      pagination: { page: safePage, pageSize: safePageSize, total, pageCount: Math.ceil(total / safePageSize) },
    };
  }

  async search(query: string, usage?: string, requestedLimit = 30) {
    const term = query.trim();
    if (term.length === 1) return [];
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    const usageTypes = usage === 'sale'
      ? ['SALE', 'BOTH']
      : usage === 'purchase'
        ? ['PURCHASE', 'BOTH']
        : undefined;

    return this.prisma.products.findMany({
      where: {
        deleted_at: null,
        active: true,
        ...(usageTypes ? { usage_type: { in: usageTypes as any } } : {}),
        ...(term ? {
          OR: [
            { sku: { contains: term, mode: 'insensitive' } },
            { name: { contains: term, mode: 'insensitive' } },
          ],
        } : {}),
      },
      orderBy: { name: 'asc' },
      take: limit,
      include: {
        product_price: {
          where: { deleted_at: null },
          include: { currencies: true },
        },
        product_taxes: { include: { taxes: true } },
        product_variants: {
          select: { id: true, name: true, sku: true, active: true },
          where: { deleted_at: null, active: true },
        },
        unit: true,
      },
    });
  }

  async getCounts() {
    const where = { deleted_at: null };
    const [total, inactive] = await Promise.all([
      this.prisma.products.count({ where }),
      this.prisma.products.count({ where: { ...where, active: false } }),
    ]);

    return {
      total,
      active: total - inactive,
      inactive,
    };
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
        current_cost_currency: true,

        income_account: true,
        expense_account: true,
        inventory_account: true,

        // ─────────────
        // Costos
        // ─────────────
        product_costs: {
          where: { deleted_at: null },
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            version: true,
            cost_source: true,
            material_cost: true,
            labor_cost: true,
            overhead_cost: true,
            total_cost: true,
            notes: true,
            created_at: true,
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
        unit: true,

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
    const current = await this.findOne(id);

    if (
      data.cost_source
      && data.cost_source !== current.cost_source
      && current.parent_components?.length
    ) {
      throw new BadRequestException(
        'No se puede cambiar el método de cálculo mientras el producto tenga componentes. Eliminá la estructura o creá una nueva versión.',
      );
    }

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
        throw new ConflictException(`Producto duplicado: ya existe otro producto con SKU ${data.sku}`);
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
