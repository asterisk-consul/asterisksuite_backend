import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { ITaxCategoryRepository } from '../tax-category.repository.interface'
import type { TaxCategory, TaxCategoryTax } from '../../interfaces/tax-entities.interface'

@Injectable()
export class PrismaTaxCategoryRepository implements ITaxCategoryRepository {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext()
  }

  async findById(id: string): Promise<TaxCategory | null> {
    const result = await this.prisma.tax_categories.findUnique({
      where: { id, deleted_at: null },
    })
    return result ? this.toDomain(result) : null
  }

  async findByCode(code: string): Promise<TaxCategory | null> {
    const result = await this.prisma.tax_categories.findFirst({
      where: { code, deleted_at: null },
    })
    return result ? this.toDomain(result) : null
  }

  async findTaxesByCategory(categoryId: string): Promise<TaxCategoryTax[]> {
    const results = await this.prisma.tax_category_taxes.findMany({
      where: {
        tax_category_id: categoryId,
        active: true,
      },
      include: {
        tax: true,
        tax_category: true,
      },
    })
    return results.map((r) => ({
      id: r.id,
      tax_category_id: r.tax_category_id,
      tax_id: r.tax_id,
      is_included_in_price: r.is_included_in_price,
      active: r.active,
      tax: {
        id: r.tax.id,
        code: r.tax.code,
        name: r.tax.name,
        tax_type: r.tax.tax_type,
        rate: Number(r.tax.rate),
        is_percentage: r.tax.is_percentage,
        active: r.tax.active,
        calculation_level: r.tax.calculation_level,
      },
      tax_category: {
        id: r.tax_category.id,
        code: r.tax_category.code,
        name: r.tax_category.name,
        description: r.tax_category.description,
        active: r.tax_category.active,
      },
    }))
  }

  async findMany(filter?: { active?: boolean }): Promise<TaxCategory[]> {
    const results = await this.prisma.tax_categories.findMany({
      where: {
        deleted_at: null,
        ...(filter?.active !== undefined && { active: filter.active }),
      },
    })
    return results.map((r) => this.toDomain(r))
  }

  private toDomain(raw: any): TaxCategory {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      description: raw.description,
      active: raw.active,
    }
  }
}
