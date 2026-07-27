import type { TaxCategory, TaxCategoryTax } from '../interfaces/tax-entities.interface'

export interface ITaxCategoryRepository {
  findById(id: string): Promise<TaxCategory | null>
  findByCode(code: string): Promise<TaxCategory | null>
  findTaxesByCategory(categoryId: string): Promise<TaxCategoryTax[]>
  findMany(filter?: { active?: boolean }): Promise<TaxCategory[]>
}
