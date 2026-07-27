import { Inject, Injectable } from '@nestjs/common'
import type { ITaxCategoryRepository } from '../repositories/tax-category.repository.interface'
import type { ICompanyTaxSettingsRepository } from '../repositories/company-tax-settings.repository.interface'
import type { IOperationTaxRepository } from '../repositories/operation-tax.repository.interface'
import type { IProductRepository } from '../repositories/product.repository.interface'
import type { TaxContext } from '../interfaces/tax-context.interface'
import type { TaxResolutionResult, ResolvedTax, ResolvedTaxSettings } from '../interfaces/tax-result.interface'

const PRESETS: Record<string, ResolvedTaxSettings> = {
  SIMPLE: {
    fiscal_mode: 'SIMPLE',
    calculateVat: false,
    calculateIibb: false,
    pricesIncludeTax: true,
    showTaxBreakdown: false,
    country: 'AR',
  },
  COMPLETE: {
    fiscal_mode: 'COMPLETE',
    calculateVat: true,
    calculateIibb: true,
    pricesIncludeTax: false,
    showTaxBreakdown: true,
    country: 'AR',
  },
}

@Injectable()
export class TaxResolutionService {
  constructor(
    @Inject('ITaxCategoryRepository') private categoryRepo: ITaxCategoryRepository,
    @Inject('ICompanyTaxSettingsRepository') private settingsRepo: ICompanyTaxSettingsRepository,
    @Inject('IOperationTaxRepository') private operationTaxRepo: IOperationTaxRepository,
    @Inject('IProductRepository') private productRepo: IProductRepository,
  ) {}

  async resolve(ctx: TaxContext): Promise<TaxResolutionResult> {
    console.log('[TaxResolution] resolve() called')
    console.log('[TaxResolution] ctx:', JSON.stringify(ctx, null, 2))

    const rawSettings = await this.settingsRepo.findByCompanyId(ctx.issuerCompanyId)
    console.log('[TaxResolution] rawSettings:', rawSettings)

    const settings = this.resolveSettings(rawSettings)
    console.log('[TaxResolution] resolvedSettings:', settings)

    const productTaxes = new Map<string, ResolvedTax[]>()
    for (const item of ctx.items) {
      if (item.productId) {
        const taxes = await this.resolveProductTaxes(item.productId, settings, ctx.documentLetterType)
        console.log('[TaxResolution] productTaxes for', item.productId, ':', taxes)
        productTaxes.set(item.productId, taxes)
      }
    }

    const operationTaxes = await this.resolveOperationTaxes(ctx, settings)
    console.log('[TaxResolution] operationTaxes:', operationTaxes)

    console.log('[TaxResolution] resolve() done')
    return { settings, productTaxes, operationTaxes }
  }

  private resolveSettings(raw: any): ResolvedTaxSettings {
    if (!raw) {
      console.log('[TaxResolution] No settings found, using SIMPLE defaults')
      return PRESETS['SIMPLE']
    }

    const base = PRESETS[raw.fiscal_mode] ?? PRESETS['SIMPLE']
    console.log('[TaxResolution] Using mode:', raw.fiscal_mode)

    return {
      ...base,
      country: raw.country ?? base.country,
    }
  }

  private async resolveProductTaxes(productId: string, settings: ResolvedTaxSettings, documentLetterType?: string): Promise<ResolvedTax[]> {
    console.log('[TaxResolution] resolveProductTaxes - productId:', productId, 'documentLetterType:', documentLetterType)
    const product = await this.productRepo.findById(productId)
    console.log('[TaxResolution] product:', product ? { id: product.id, name: product.name, tax_category_id: product.tax_category_id } : 'NOT FOUND')

    if (!product?.tax_category_id) {
      console.log('[TaxResolution] No tax_category_id for product, returning empty')
      return []
    }

    const categoryTaxes = await this.categoryRepo.findTaxesByCategory(product.tax_category_id)
    console.log('[TaxResolution] categoryTaxes:', categoryTaxes)

    const filtered = categoryTaxes
      .filter((ct) => {
        if (!settings.calculateVat && ct.tax.tax_type === 'IVA') {
          console.log('[TaxResolution] Filtering out IVA (calculateVat is false)')
          return false
        }
        return ct.active && ct.tax.active
      })
      .map((ct) => ({
        tax_id: ct.tax.id,
        code: ct.tax.code,
        name: ct.tax.name,
        rate: ct.tax.rate,
        tax_type: ct.tax.tax_type,
        calculation_level: ct.tax.calculation_level,
        is_included_in_price: ct.tax.tax_type === 'IVA'
          ? (documentLetterType === 'B' || documentLetterType === 'C')
          : ct.is_included_in_price,
        source: 'PRODUCT' as const,
        reason: `Categoría fiscal: ${ct.tax_category.name}`,
      }))

    console.log('[TaxResolution] resolved productTaxes:', filtered)
    return filtered
  }

  private async resolveOperationTaxes(ctx: TaxContext, settings: ResolvedTaxSettings): Promise<ResolvedTax[]> {
    console.log('[TaxResolution] resolveOperationTaxes - calculateIibb:', settings.calculateIibb)

    if (!settings.calculateIibb) {
      console.log('[TaxResolution] calculateIibb is false, returning empty')
      return []
    }

    const jurisdiction = ctx.warehouseId ?? 'default'
    console.log('[TaxResolution] jurisdiction:', jurisdiction, 'documentLetterType:', ctx.documentLetterType)

    const operationTaxes = await this.operationTaxRepo.findByContext(jurisdiction, ctx.documentLetterType)
    console.log('[TaxResolution] raw operationTaxes:', operationTaxes)

    const filtered = operationTaxes
      .filter((ot) => ot.active && ot.tax.active)
      .map((ot) => ({
        tax_id: ot.tax.id,
        code: ot.tax.code,
        name: ot.tax.name,
        rate: ot.rate,
        tax_type: ot.tax.tax_type,
        calculation_level: ot.tax.calculation_level,
        is_included_in_price: false,
        source: 'OPERATION' as const,
        reason: `Impuesto operación: ${ot.jurisdiction}`,
      }))

    console.log('[TaxResolution] resolved operationTaxes:', filtered)
    return filtered
  }
}
