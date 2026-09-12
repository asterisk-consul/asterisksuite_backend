import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { ITaxRepository } from '../tax.repository.interface'
import type { Tax } from '../../interfaces/tax-entities.interface'

@Injectable()
export class PrismaTaxRepository implements ITaxRepository {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext()
  }

  async findById(id: string): Promise<Tax | null> {
    const result = await this.prisma.taxes.findUnique({
      where: { id, deleted_at: null },
    })
    return result ? this.toDomain(result) : null
  }

  async findByCode(code: string): Promise<Tax | null> {
    const result = await this.prisma.taxes.findFirst({
      where: { code, deleted_at: null },
    })
    return result ? this.toDomain(result) : null
  }

  async findMany(filter?: { tax_type?: string; active?: boolean }): Promise<Tax[]> {
    const results = await this.prisma.taxes.findMany({
      where: {
        deleted_at: null,
        ...(filter?.tax_type && { tax_type: filter.tax_type }),
        ...(filter?.active !== undefined && { active: filter.active }),
      },
    })
    return results.map((r) => this.toDomain(r))
  }

  private toDomain(raw: any): Tax {
    return {
      id: raw.id,
      code: raw.code,
      name: raw.name,
      tax_type: raw.tax_type,
      rate: Number(raw.rate),
      is_percentage: raw.is_percentage,
      active: raw.active,
      calculation_level: raw.calculation_level,
    }
  }
}
