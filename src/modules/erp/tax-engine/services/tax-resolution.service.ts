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

    // Los impuestos automáticos de la operación (por ejemplo, percepciones IIBB)
    // se gobiernan por la configuración fiscal, la jurisdicción y el tercero.
    // No deben quedar excluidos por la lista de impuestos de producto del tipo
    // de documento, que normalmente contiene únicamente las alícuotas de IVA.
    const operationTaxes = await this.resolveOperationTaxes(ctx, settings)
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
    if (!settings.calculateIibb || !ctx.partnerId || !ctx.jurisdictionId) return []

    const date = new Date(ctx.date)
    const companyJurisdiction = await this.db.company_tax_jurisdictions.findFirst({
      where: {
        company_id: ctx.issuerCompanyId,
        jurisdiction_id: ctx.jurisdictionId,
        tax_type: 'IIBB',
        is_perception_agent: true,
        deleted_at: null,
        OR: [{ valid_from: null }, { valid_from: { lte: date } }],
        AND: [{ OR: [{ valid_to: null }, { valid_to: { gte: date } }] }],
      },
    })
    if (!companyJurisdiction) return []

    const registration = await this.db.business_party_iibb_registrations.findFirst({
      where: {
        business_party_id: ctx.partnerId,
        jurisdiction_id: ctx.jurisdictionId,
        is_active: true,
        registration_type: { notIn: ['EXENTO', 'NO_INSCRIPTO'] },
        OR: [{ valid_from: null }, { valid_from: { lte: date } }],
        AND: [{ OR: [{ valid_to: null }, { valid_to: { gte: date } }] }],
      },
    })
    if (!registration) return []

    const generalRule = await this.db.tax_rules.findFirst({
      where: {
        jurisdiction_id: ctx.jurisdictionId,
        tax_type: 'IIBB',
        application_type: 'PERCEPTION',
        is_active: true,
        deleted_at: null,
        AND: [
          { OR: [{ operation_type: null }, { operation_type: ctx.operationType }] },
          { valid_from: { lte: date } },
          { OR: [{ valid_to: null }, { valid_to: { gte: date } }] },
        ],
      },
      orderBy: { priority: 'desc' },
    })
    if (!generalRule) return []

    const configuredRate = registration.perception_rate
      ?? companyJurisdiction?.default_perception_rate
      ?? generalRule.rate
    if (configuredRate == null) return []

    const expectedCode = ctx.operationType === 'SALE' ? 'PERC_IIBB' : 'COM_PERC_IIBB'
    const configuredTax = await this.db.taxes.findFirst({
      where: { code: expectedCode, active: true, deleted_at: null },
    })
    if (configuredTax) {
      return [{
        tax_id: configuredTax.id,
        code: configuredTax.code,
        name: configuredTax.name,
        rate: Number(configuredRate),
        tax_type: configuredTax.tax_type,
        calculation_level: 'document',
        is_included_in_price: false,
        source: 'OPERATION' as const,
        reason: registration.perception_rate != null
          ? `Alícuota particular del tercero (${registration.source})`
          : companyJurisdiction?.default_perception_rate != null
            ? 'Alícuota general configurada por la empresa para la jurisdicción'
            : `Regla fiscal: ${generalRule?.name ?? 'alícuota general de la jurisdicción'}`,
      }]
    }

    const jurisdictionRecord = await this.db.tax_jurisdictions.findUnique({
      where: { id: ctx.jurisdictionId },
    })
    const jurisdiction = jurisdictionRecord?.code ?? jurisdictionRecord?.name ?? 'default'
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
