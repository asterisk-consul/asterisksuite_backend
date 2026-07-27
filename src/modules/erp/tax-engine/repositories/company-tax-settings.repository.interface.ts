import type { CompanyTaxSettings } from '../interfaces/tax-entities.interface'

export interface ICompanyTaxSettingsRepository {
  findByCompanyId(companyId: string): Promise<CompanyTaxSettings | null>
  create(data: { company_id: string; fiscal_mode?: string; country?: string }): Promise<CompanyTaxSettings>
  update(companyId: string, data: Partial<CompanyTaxSettings>): Promise<CompanyTaxSettings>
}
