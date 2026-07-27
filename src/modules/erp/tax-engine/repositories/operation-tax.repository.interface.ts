import type { OperationTax } from '../interfaces/tax-entities.interface'

export interface IOperationTaxRepository {
  findById(id: string): Promise<OperationTax | null>
  findByContext(jurisdiction: string, documentType?: string): Promise<OperationTax[]>
  findMany(filter?: { jurisdiction?: string; active?: boolean }): Promise<OperationTax[]>
}
