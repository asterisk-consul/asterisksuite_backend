import type { Tax } from '../interfaces/tax-entities.interface'

export interface ITaxRepository {
  findById(id: string): Promise<Tax | null>
  findByCode(code: string): Promise<Tax | null>
  findMany(filter?: { tax_type?: string; active?: boolean }): Promise<Tax[]>
}
