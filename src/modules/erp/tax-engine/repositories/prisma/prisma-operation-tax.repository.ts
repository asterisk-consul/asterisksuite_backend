import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { IOperationTaxRepository } from '../operation-tax.repository.interface'
import type { OperationTax } from '../../interfaces/tax-entities.interface'

@Injectable()
export class PrismaOperationTaxRepository implements IOperationTaxRepository {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext()
  }

  async findById(id: string): Promise<OperationTax | null> {
    const result = await this.prisma.operation_taxes.findUnique({
      where: { id },
      include: { tax: true },
    })
    return result ? this.toDomain(result) : null
  }

  async findByContext(jurisdiction: string, documentType?: string): Promise<OperationTax[]> {
    console.log('[OperationTaxRepo] findByContext - jurisdiction:', jurisdiction, 'documentType:', documentType)
    const results = await this.prisma.operation_taxes.findMany({
      where: {
        jurisdiction,
        active: true,
        deleted_at: null,
        ...(documentType && { document_type: documentType }),
      },
      include: { tax: true },
    })
    console.log('[OperationTaxRepo] findByContext - found:', results.length)
    return results.map((r) => this.toDomain(r))
  }

  async findMany(filter?: { jurisdiction?: string; active?: boolean }): Promise<OperationTax[]> {
    const results = await this.prisma.operation_taxes.findMany({
      where: {
        deleted_at: null,
        ...(filter?.jurisdiction && { jurisdiction: filter.jurisdiction }),
        ...(filter?.active !== undefined && { active: filter.active }),
      },
      include: { tax: true },
    })
    return results.map((r) => this.toDomain(r))
  }

  private toDomain(raw: any): OperationTax {
    return {
      id: raw.id,
      tax_id: raw.tax_id,
      jurisdiction: raw.jurisdiction,
      document_type: raw.document_type,
      rate: Number(raw.rate),
      min_amount: raw.min_amount ? Number(raw.min_amount) : null,
      active: raw.active,
      tax: {
        id: raw.tax.id,
        code: raw.tax.code,
        name: raw.tax.name,
        tax_type: raw.tax.tax_type,
        rate: Number(raw.tax.rate),
        is_percentage: raw.tax.is_percentage,
        active: raw.tax.active,
        calculation_level: raw.tax.calculation_level,
      },
    }
  }
}
