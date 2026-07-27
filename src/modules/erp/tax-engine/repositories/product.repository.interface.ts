import type { Product } from '../interfaces/tax-entities.interface'

export interface IProductRepository {
  findById(id: string): Promise<Product | null>
  findMany(filter?: { active?: boolean }): Promise<Product[]>
}
