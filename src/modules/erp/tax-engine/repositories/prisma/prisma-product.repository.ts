import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { IProductRepository } from '../product.repository.interface'
import type { Product } from '../../interfaces/tax-entities.interface'

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext()
  }

  async findById(id: string): Promise<Product | null> {
    const result = await this.prisma.products.findUnique({
      where: { id, deleted_at: null },
      include: { tax_category: true },
    })
    return result ? this.toDomain(result) : null
  }

  async findMany(filter?: { active?: boolean }): Promise<Product[]> {
    const results = await this.prisma.products.findMany({
      where: {
        deleted_at: null,
        ...(filter?.active !== undefined && { active: filter.active }),
      },
      include: { tax_category: true },
    })
    return results.map((r) => this.toDomain(r))
  }

  private toDomain(raw: any): Product {
    return {
      id: raw.id,
      name: raw.name,
      sku: raw.sku,
      tax_category_id: raw.tax_category_id,
      tax_category: raw.tax_category
        ? {
            id: raw.tax_category.id,
            code: raw.tax_category.code,
            name: raw.tax_category.name,
            description: raw.tax_category.description,
            active: raw.tax_category.active,
          }
        : null,
    }
  }
}
