import { Injectable } from '@nestjs/common'
import { Inject } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import type { TaxResolutionResult, ResolvedTax, ResolvedTaxSettings } from '../interfaces/tax-result.interface'
import type { TaxContext } from '../interfaces/tax-context.interface'
import type { ITaxCategoryRepository } from '../repositories/tax-category.repository.interface'
import type { ICompanyTaxSettingsRepository } from '../repositories/company-tax-settings.repository.interface'
import type { IOperationTaxRepository } from '../repositories/operation-tax.repository.interface'
import type { IProductRepository } from '../repositories/product.repository.interface'

const PRESETS: Record<string, ResolvedTaxSettings> = {
  SIMPLE: { fiscal_mode: 'SIMPLE', calculateVat: true, calculateIibb: false, pricesIncludeTax: false, showTaxBreakdown: false, country: 'AR' },
  COMPLETE: { fiscal_mode: 'COMPLETE', calculateVat: true, calculateIibb: true, pricesIncludeTax: false, showTaxBreakdown: true, country: 'AR' },
}

@Injectable()
export class TaxResolutionService {
  constructor(
    @Inject('ITaxCategoryRepository') private categoryRepo: ITaxCategoryRepository,
    @Inject('ICompanyTaxSettingsRepository') private settingsRepo: ICompanyTaxSettingsRepository,
    @Inject('IOperationTaxRepository') private operationTaxRepo: IOperationTaxRepository,
    @Inject('IProductRepository') private productRepo: IProductRepository,
    private prisma: PrismaService,
  ) {}

  private get db() {
    return this.prisma.getClientForCurrentContext()
  }

  async resolve(ctx: TaxContext): Promise<TaxResolutionResult> {
    const rawSettings = await this.settingsRepo.findByCompanyId(ctx.issuerCompanyId)
    const settings = this.resolveSettings(rawSettings)

    // Flag del tipo de documento: comprobantes sin cálculo de impuestos
    const docType = await this.db.document_types.findUnique({
      where: { id: ctx.documentTypeId },
      select: { calculates_taxes: true },
    })
    if (docType && docType.calculates_taxes === false) {
      return { settings, productTaxes: new Map(), operationTaxes: [] }
    }

    const productTaxes = new Map<string, ResolvedTax[]>()
    for (const item of ctx.items) {
      if (item.productId) {
        const taxes = await this.resolveProductTaxes(item.productId, settings, ctx.documentLetterType)
        productTaxes.set(item.productId, taxes)
      }
    }

    // Whitelist: si el document_type tiene impuestos asociados, limitar la resolución a ese conjunto
    const docTypeTaxes = await this.db.document_type_taxes.findMany({
      where: { document_type_id: ctx.documentTypeId },
      select: { tax_id: true },
    })
    const allowedTaxIds = docTypeTaxes.length > 0 ? new Set(docTypeTaxes.map((t) => t.tax_id)) : null

    const filterTaxes = (taxes: ResolvedTax[]): ResolvedTax[] =>
      allowedTaxIds ? taxes.filter((t) => allowedTaxIds.has(t.tax_id)) : taxes

    const filteredProductTaxes = new Map<string, ResolvedTax[]>()
    for (const [productId, taxes] of productTaxes) {
      filteredProductTaxes.set(productId, filterTaxes(taxes))
    }

    const operationTaxes = filterTaxes(await this.resolveOperationTaxes(ctx, settings))
    return { settings, productTaxes: filteredProductTaxes, operationTaxes }
  }

  private resolveSettings(raw: any): ResolvedTaxSettings {
    if (!raw) return PRESETS['SIMPLE']

    const base = PRESETS[raw.fiscal_mode] ?? PRESETS['SIMPLE']

    return {
      ...base,
      country: raw.country ?? base.country,
      pricesIncludeTax: raw.prices_include_tax ?? base.pricesIncludeTax,
      showTaxBreakdown: raw.show_tax_breakdown ?? base.showTaxBreakdown,
    }
  }

  private async resolveProductTaxes(productId: string, settings: ResolvedTaxSettings, documentLetterType?: string): Promise<ResolvedTax[]> {
    const product = await this.productRepo.findById(productId)

    if (!product?.tax_category_id) return []

    const categoryTaxes = await this.categoryRepo.findTaxesByCategory(product.tax_category_id)

    const filtered = categoryTaxes
      .filter((ct) => {
        if (!settings.calculateVat && ct.tax.tax_type === 'IVA') return false
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
          ? settings.pricesIncludeTax
          : ct.is_included_in_price,
        source: 'PRODUCT' as const,
        reason: `Categoría fiscal: ${ct.tax_category.name}`,
      }))

    return filtered
  }

  private async resolveOperationTaxes(ctx: TaxContext, settings: ResolvedTaxSettings): Promise<ResolvedTax[]> {
    if (!settings.calculateIibb) return []

    const jurisdiction = ctx.warehouseId ?? 'default'
    const operationTaxes = await this.operationTaxRepo.findByContext(jurisdiction, ctx.documentLetterType)

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

    return filtered
  }
}
