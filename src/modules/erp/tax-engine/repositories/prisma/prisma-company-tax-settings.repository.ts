import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { ICompanyTaxSettingsRepository } from '../company-tax-settings.repository.interface'
import type { CompanyTaxSettings } from '../../interfaces/tax-entities.interface'

@Injectable()
export class PrismaCompanyTaxSettingsRepository implements ICompanyTaxSettingsRepository {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getDefaultClient()
  }

  async findByCompanyId(companyId: string): Promise<CompanyTaxSettings | null> {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(companyId)) {
      return null
    }

    try {
      const result = await this.prisma.company_tax_settings.findUnique({
        where: { company_id: companyId },
      })
      return result ? this.toDomain(result) : null
    } catch {
      return null
    }
  }

  async create(data: { company_id: string; fiscal_mode?: string; country?: string }): Promise<CompanyTaxSettings> {
    console.log('[Repo] create - company_id:', data.company_id)
    try {
      const result = await this.prisma.company_tax_settings.create({
        data: {
          company_id: data.company_id,
          fiscal_mode: (data.fiscal_mode as any) ?? 'SIMPLE',
          country: data.country ?? 'AR',
          prices_include_tax: true,
          show_tax_breakdown: false,
        },
      })
      console.log('[Repo] create - success:', result.id)
      return this.toDomain(result)
    } catch (e: any) {
      console.error('[Repo] create - error:', e.code, e.message)
      throw e
    }
  }

  async update(companyId: string, data: Partial<CompanyTaxSettings>): Promise<CompanyTaxSettings> {
    console.log('[Repo] update - companyId:', companyId, 'data:', data)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(companyId)) {
      console.error('[Repo] update - invalid UUID:', companyId)
      throw new Error('Invalid company ID')
    }

    try {
      // Primero intentar encontrar
      const existing = await this.prisma.company_tax_settings.findUnique({
        where: { company_id: companyId },
      })
      console.log('[Repo] update - existing record:', existing ? existing.id : 'NOT FOUND')

      let result
      if (existing) {
        // Actualizar
        console.log('[Repo] update - updating existing record...')
        result = await this.prisma.company_tax_settings.update({
          where: { company_id: companyId },
          data: {
            ...(data.fiscal_mode && { fiscal_mode: data.fiscal_mode as any }),
            ...(data.prices_include_tax !== undefined && { prices_include_tax: data.prices_include_tax }),
            ...(data.show_tax_breakdown !== undefined && { show_tax_breakdown: data.show_tax_breakdown }),
            ...(data.country && { country: data.country }),
          },
        })
      } else {
        // Crear
        console.log('[Repo] update - creating new record...')
        result = await this.prisma.company_tax_settings.create({
          data: {
            company_id: companyId,
            fiscal_mode: (data.fiscal_mode as any) ?? 'SIMPLE',
            prices_include_tax: data.prices_include_tax ?? true,
            show_tax_breakdown: data.show_tax_breakdown ?? false,
            country: data.country ?? 'AR',
          },
        })
      }
      console.log('[Repo] update - success:', result.id)
      return this.toDomain(result)
    } catch (e: any) {
      console.error('[Repo] update - error:', e.code, e.message)
      throw e
    }
  }

  private toDomain(raw: any): CompanyTaxSettings {
    return {
      id: raw.id,
      company_id: raw.company_id,
      fiscal_mode: raw.fiscal_mode,
      prices_include_tax: raw.prices_include_tax,
      show_tax_breakdown: raw.show_tax_breakdown,
      country: raw.country,
    }
  }
}
