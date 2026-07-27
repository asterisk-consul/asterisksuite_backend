import { Controller, Get, Patch, Body, Query, Inject } from '@nestjs/common'
import type { ICompanyTaxSettingsRepository } from '../repositories/company-tax-settings.repository.interface'
import type { CompanyTaxSettings } from '../interfaces/tax-entities.interface'

@Controller('company-tax-settings')
export class CompanyTaxSettingsController {
  constructor(
    @Inject('ICompanyTaxSettingsRepository') private readonly settingsRepo: ICompanyTaxSettingsRepository,
  ) {}

  @Get()
  async findByCompany(@Query('company_id') companyId: string) {
    console.log('[CompanyTaxSettings] GET - company_id:', companyId)

    if (!companyId) {
      return { error: 'company_id is required' }
    }

    const defaults = {
      id: '',
      company_id: companyId,
      fiscal_mode: 'SIMPLE',
      prices_include_tax: true,
      show_tax_breakdown: false,
      country: 'AR',
    }

    try {
      let settings = await this.settingsRepo.findByCompanyId(companyId)

      if (!settings) {
        settings = await this.settingsRepo.create({
          company_id: companyId,
          fiscal_mode: 'SIMPLE',
          country: 'AR',
        })
      }

      return settings
    } catch (e) {
      console.error('[CompanyTaxSettings] Error:', e)
      return defaults
    }
  }

  @Patch()
  async update(@Body() body: { company_id: string } & Partial<CompanyTaxSettings>) {
    const { company_id, ...data } = body
    console.log('[CompanyTaxSettings] PATCH - company_id:', company_id, 'data:', data)

    if (!company_id) {
      return { error: 'company_id is required' }
    }

    try {
      return await this.settingsRepo.update(company_id, data)
    } catch (e) {
      console.error('[CompanyTaxSettings] Error updating:', e)
      return { error: 'Failed to update settings' }
    }
  }
}
