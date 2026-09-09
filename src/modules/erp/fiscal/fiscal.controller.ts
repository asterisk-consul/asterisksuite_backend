import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import type { AuthUser } from '@/auth/types/auth-user.interface'
import { PrismaService } from '@/prisma/prisma.service'
import { getCurrentCompanyId } from '@/common/context/request-context.helpers'
import { WithholdingCalculationService } from './withholding-calculation.service'
import {
  CreateTaxRuleDto,
  PutCompanyTaxJurisdictionsDto,
  PutIibbRegistrationsDto,
  PutWithholdingProfilesDto,
  UpdateTaxRuleDto,
} from './dto/fiscal.dto'
import { CalculateWithholdingsDto } from './dto/calculate-withholdings.dto'

@Controller('erp/fiscal')
@UseGuards(JwtAuthGuard)
export class FiscalController {
  constructor(
    private db: PrismaService,
    private calculation: WithholdingCalculationService,
  ) {}

  private get prisma() {
    return this.db.getClientForCurrentContext()
  }

  // ═══════════════════════════════════════════
  // MOTOR — Preview de retenciones
  // ═══════════════════════════════════════════

  @Post('withholdings/preview')
  async previewWithholdings(@Body() dto: CalculateWithholdingsDto) {
    return this.calculation.calculate(dto)
  }

  @Get('withholdings')
  async getWithholdings(
    @Query('party_id') partyId?: string,
    @Query('direction') direction?: string,
    @Query('tax_type') taxType?: string,
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
  ) {
    const where: Record<string, any> = { deleted_at: null }
    if (partyId) where.business_party_id = partyId
    if (direction) where.direction = direction
    if (taxType) where.tax_type = taxType
    if (dateFrom || dateTo) {
      where.date = {
        ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
        ...(dateTo ? { lte: new Date(dateTo) } : {}),
      }
    }

    const withholdings = await this.prisma.withholdings.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        business_party: { select: { id: true, name: true, tax_id: true } },
        jurisdiction: { select: { id: true, code: true, name: true } },
        concept: { select: { id: true, code: true, name: true } },
        payment: { select: { id: true, number: true, type: true, date: true } },
        allocations: {
          include: { document: { select: { id: true, number: true } } },
        },
      },
      take: 500,
    })

    const total = withholdings.reduce((s, w) => s + w.withheld_amount.toNumber(), 0)
    return { items: withholdings, total_withheld: total, count: withholdings.length }
  }

  @Get('iibb-register')
  async getIibbRegister(
    @Query('date_from') dateFrom?: string,
    @Query('date_to') dateTo?: string,
    @Query('jurisdiction_id') jurisdictionId?: string,
  ) {
    const rows = await this.prisma.document_taxes.findMany({
      where: {
        deleted_at: null,
        taxes: { code: { contains: 'IIBB' } },
        documents: {
          deleted_at: null,
          ...(jurisdictionId ? { fiscal_jurisdiction_id: jurisdictionId } : {}),
          ...(dateFrom || dateTo ? {
            date: {
              ...(dateFrom ? { gte: new Date(dateFrom) } : {}),
              ...(dateTo ? { lte: new Date(dateTo) } : {}),
            },
          } : {}),
        },
      },
      include: {
        taxes: { select: { code: true, name: true } },
        documents: {
          select: {
            id: true,
            number: true,
            date: true,
            currency_code: true,
            fiscal_jurisdiction_id: true,
            business_parties: { select: { id: true, name: true, tax_id: true } },
            document_types: { select: { code: true, description: true, direction: true } },
          },
        },
      },
      orderBy: { documents: { date: 'desc' } },
      take: 1000,
    })
    const jurisdictionIds = [...new Set(rows.map(row => row.documents.fiscal_jurisdiction_id).filter(Boolean))] as string[]
    const jurisdictions = await this.prisma.tax_jurisdictions.findMany({
      where: { id: { in: jurisdictionIds } },
      select: { id: true, code: true, name: true },
    })
    const jurisdictionMap = new Map(jurisdictions.map(j => [j.id, j]))
    const totalsByCurrency = rows.reduce((totals: Record<string, number>, row: any) => {
      const currency = row.documents.currency_code ?? 'ARS'
      totals[currency] = (totals[currency] ?? 0) + Number(row.tax_amount)
      return totals
    }, {} as Record<string, number>)
    return {
      items: rows.map(row => ({
        ...row,
        jurisdiction: row.documents.fiscal_jurisdiction_id
          ? jurisdictionMap.get(row.documents.fiscal_jurisdiction_id) ?? null
          : null,
      })),
      totals_by_currency: totalsByCurrency,
      count: rows.length,
    }
  }

  // ═══════════════════════════════════════════
  // JURISDICCIONES
  // ═══════════════════════════════════════════

  @Get('jurisdictions')
  async getJurisdictions() {
    return this.prisma.tax_jurisdictions.findMany({
      where: { deleted_at: null, is_active: true },
      orderBy: { sort_order: 'asc' },
    })
  }

  // ═══════════════════════════════════════════
  // CONCEPTOS
  // ═══════════════════════════════════════════

  @Get('withholding-concepts')
  async getWithholdingConcepts() {
    return this.prisma.withholding_concepts.findMany({
      where: { deleted_at: null, is_active: true },
      orderBy: { name: 'asc' },
    })
  }

  // ═══════════════════════════════════════════
  // PERFIL FISCAL DEL TERCERO
  // ═══════════════════════════════════════════

  @Get('parties/:partyId/withholding-profiles')
  async getPartyWithholdingProfiles(@Param('partyId') partyId: string) {
    return this.prisma.business_party_withholding_profiles.findMany({
      where: { business_party_id: partyId, deleted_at: null },
      orderBy: { tax_type: 'asc' },
    })
  }

  @Put('parties/:partyId/withholding-profiles')
  async putPartyWithholdingProfiles(@Param('partyId') partyId: string, @Body() dto: PutWithholdingProfilesDto, @CurrentUser() user: AuthUser) {
    const userId = user.id
    const party = await this.prisma.business_parties.findFirst({
      where: { id: partyId, deleted_at: null },
    })
    if (!party) throw new NotFoundException('Tercero no encontrado')

    // Replace-all: sincroniza perfiles con lo enviado
    await this.prisma.$transaction(async (tx) => {
      await tx.business_party_withholding_profiles.updateMany({
        where: { business_party_id: partyId, deleted_at: null },
        data: { deleted_at: new Date(), deleted_by: userId },
      })
      for (const p of dto.profiles) {
        const existing = await tx.business_party_withholding_profiles.findUnique({
          where: { business_party_id_tax_type: { business_party_id: partyId, tax_type: p.tax_type } },
        })
        if (existing) {
          await tx.business_party_withholding_profiles.update({
            where: { id: existing.id },
            data: {
              is_subject: p.is_subject,
              status: (p.status as any) ?? 'NORMAL',
              is_pyme: p.is_pyme ?? false,
              observations: p.observations,
              deleted_at: null,
              deleted_by: null,
            },
          })
        } else {
          await tx.business_party_withholding_profiles.create({
            data: {
              business_party_id: partyId,
              tax_type: p.tax_type,
              is_subject: p.is_subject,
              status: (p.status as any) ?? 'NORMAL',
              is_pyme: p.is_pyme ?? false,
              observations: p.observations,
              created_by: userId,
            },
          })
        }
      }
    })

    return this.getPartyWithholdingProfiles(partyId)
  }

  @Get('parties/:partyId/iibb-registrations')
  async getPartyIibbRegistrations(@Param('partyId') partyId: string) {
    return this.prisma.business_party_iibb_registrations.findMany({
      where: { business_party_id: partyId, deleted_at: null },
      include: { jurisdiction: { select: { id: true, code: true, name: true } } },
      orderBy: { created_at: 'asc' },
    })
  }

  @Put('parties/:partyId/iibb-registrations')
  async putPartyIibbRegistrations(@Param('partyId') partyId: string, @Body() dto: PutIibbRegistrationsDto, @CurrentUser() user: AuthUser) {
    const userId = user.id
    const party = await this.prisma.business_parties.findFirst({
      where: { id: partyId, deleted_at: null },
    })
    if (!party) throw new NotFoundException('Tercero no encontrado')

    await this.prisma.$transaction(async (tx) => {
      await tx.business_party_iibb_registrations.updateMany({
        where: { business_party_id: partyId, deleted_at: null },
        data: { deleted_at: new Date(), deleted_by: userId },
      })
      for (const r of dto.registrations) {
        await tx.business_party_iibb_registrations.create({
          data: {
            business_party_id: partyId,
            registration_type: (r.registration_type as any) ?? 'NO_INSCRIPTO',
            jurisdiction_id: r.jurisdiction_id ?? null,
            registration_number: r.registration_number ?? null,
            prorrate_percentage: r.prorrate_percentage ?? null,
            perception_rate: r.perception_rate ?? null,
            retention_rate: r.retention_rate ?? null,
            valid_from: r.valid_from ? new Date(r.valid_from) : null,
            valid_to: r.valid_to ? new Date(r.valid_to) : null,
            source: r.source ?? 'MANUAL',
            is_active: r.is_active ?? true,
            created_by: userId,
          },
        })
      }
    })

    return this.getPartyIibbRegistrations(partyId)
  }

  // ═══════════════════════════════════════════
  // EMPRESA COMO AGENTE
  // ═══════════════════════════════════════════

  @Get('company-jurisdictions')
  async getCompanyTaxJurisdictions() {
    const companyId = getCurrentCompanyId()
    if (!companyId) throw new BadRequestException('No se pudo resolver la empresa del contexto')
    return this.prisma.company_tax_jurisdictions.findMany({
      where: { company_id: companyId, deleted_at: null },
      include: { jurisdiction: { select: { id: true, code: true, name: true } } },
      orderBy: { tax_type: 'asc' },
    })
  }

  @Put('company-jurisdictions')
  async putCompanyTaxJurisdictions(@Body() dto: PutCompanyTaxJurisdictionsDto, @CurrentUser() user: AuthUser) {
    const userId = user.id
    const companyId = getCurrentCompanyId()
    if (!companyId) throw new BadRequestException('No se pudo resolver la empresa del contexto')

    await this.prisma.$transaction(async (tx) => {
      await tx.company_tax_jurisdictions.updateMany({
        where: { company_id: companyId, deleted_at: null },
        data: { deleted_at: new Date(), deleted_by: userId },
      })
      for (const j of dto.jurisdictions) {
        const existing = await tx.company_tax_jurisdictions.findUnique({
          where: { company_id_jurisdiction_id_tax_type: { company_id: companyId, jurisdiction_id: j.jurisdiction_id, tax_type: j.tax_type } },
        })
        if (existing) {
          await tx.company_tax_jurisdictions.update({
            where: { id: existing.id },
            data: {
              is_withholding_agent: j.is_withholding_agent,
              is_perception_agent: j.is_perception_agent,
              registration_number: j.registration_number ?? null,
              default_perception_rate: j.default_perception_rate ?? null,
              default_retention_rate: j.default_retention_rate ?? null,
              valid_from: j.valid_from ? new Date(j.valid_from) : null,
              valid_to: j.valid_to ? new Date(j.valid_to) : null,
              deleted_at: null,
              deleted_by: null,
            },
          })
        } else {
          await tx.company_tax_jurisdictions.create({
            data: {
              company_id: companyId,
              jurisdiction_id: j.jurisdiction_id,
              tax_type: j.tax_type,
              is_withholding_agent: j.is_withholding_agent,
              is_perception_agent: j.is_perception_agent,
              registration_number: j.registration_number ?? null,
              default_perception_rate: j.default_perception_rate ?? null,
              default_retention_rate: j.default_retention_rate ?? null,
              valid_from: j.valid_from ? new Date(j.valid_from) : null,
              valid_to: j.valid_to ? new Date(j.valid_to) : null,
              created_by: userId,
            },
          })
        }
      }
    })

    return this.getCompanyTaxJurisdictions()
  }

  // ═══════════════════════════════════════════
  // REGLAS FISCALES
  // ═══════════════════════════════════════════

  private async ensureTaxRulePeriodDoesNotOverlap(rule: {
    tax_type?: string
    application_type?: string | null
    jurisdiction_id?: string | null
    operation_type?: string | null
    valid_from?: string | Date | null
    valid_to?: string | Date | null
    is_active?: boolean
  }, excludeId?: string) {
    if (rule.is_active === false) return

    const validFrom = rule.valid_from ? new Date(rule.valid_from) : new Date()
    const validTo = rule.valid_to ? new Date(rule.valid_to) : null
    if (validTo && validTo < validFrom) {
      throw new BadRequestException('La fecha hasta no puede ser anterior a la fecha desde')
    }

    const overlappingRule = await this.prisma.tax_rules.findFirst({
      where: {
        ...(excludeId ? { id: { not: excludeId } } : {}),
        deleted_at: null,
        is_active: true,
        tax_type: rule.tax_type,
        application_type: rule.application_type as any,
        jurisdiction_id: rule.jurisdiction_id ?? null,
        operation_type: rule.operation_type ?? null,
        ...(validTo ? { valid_from: { lte: validTo } } : {}),
        OR: [
          { valid_to: null },
          { valid_to: { gte: validFrom } },
        ],
      },
      select: { name: true, valid_from: true, valid_to: true },
    })

    if (overlappingRule) {
      throw new BadRequestException(
        `La vigencia se superpone con "${overlappingRule.name}". Cerrá la regla anterior un día antes de iniciar la nueva.`,
      )
    }
  }

  @Get('tax-rules')
  async getTaxRules(@Query('tax_type') taxType?: string) {
    return this.prisma.tax_rules.findMany({
      where: {
        deleted_at: null,
        ...(taxType ? { tax_type: taxType } : {}),
      },
      include: {
        jurisdiction: { select: { id: true, code: true, name: true } },
        concept: { select: { id: true, code: true, name: true } },
        brackets: true,
      },
      orderBy: [{ tax_type: 'asc' }, { priority: 'desc' }],
    })
  }

  @Post('tax-rules')
  async createTaxRule(@Body() dto: CreateTaxRuleDto, @CurrentUser() user: AuthUser) {
    const userId = user.id
    await this.ensureTaxRulePeriodDoesNotOverlap({
      ...dto,
      application_type: dto.application_type ?? 'WITHHOLDING',
      valid_from: dto.valid_from ?? new Date(),
      is_active: true,
    })
    const rule = await this.prisma.tax_rules.create({
      data: {
        name: dto.name,
        tax_type: dto.tax_type,
        application_type: (dto.application_type as any) ?? 'WITHHOLDING',
        jurisdiction_id: dto.jurisdiction_id ?? null,
        withholding_concept_id: dto.withholding_concept_id ?? null,
        operation_type: dto.operation_type ?? null,
        cuit_suffix_group: dto.cuit_suffix_group ?? null,
        base_type: (dto.base_type as any) ?? 'PAYMENT_AMOUNT',
        calculation_method: dto.calculation_method ?? 'RATE_TIMES_BASE',
        rate: dto.rate ?? null,
        fixed_amount: dto.fixed_amount ?? null,
        minimum_amount: dto.minimum_amount ?? null,
        maximum_amount: dto.maximum_amount ?? null,
        priority: dto.priority ?? 0,
        valid_from: dto.valid_from ? new Date(dto.valid_from) : new Date(),
        valid_to: dto.valid_to ? new Date(dto.valid_to) : null,
        created_by: userId,
        ...(dto.brackets?.length
          ? {
              brackets: {
                create: dto.brackets.map((b) => ({
                  accumulated_from: b.accumulated_from,
                  accumulated_to: b.accumulated_to ?? null,
                  rate: b.rate,
                })),
              },
            }
          : {}),
      },
      include: { brackets: true },
    })
    return rule
  }

  @Put('tax-rules/:id')
  async updateTaxRule(@Param('id') id: string, @Body() dto: UpdateTaxRuleDto, @CurrentUser() user: AuthUser) {
    const userId = user.id
    const existing = await this.prisma.tax_rules.findFirst({ where: { id, deleted_at: null } })
    if (!existing) throw new NotFoundException('Regla fiscal no encontrada')

    await this.ensureTaxRulePeriodDoesNotOverlap({
      ...existing,
      ...dto,
      application_type: dto.application_type ?? existing.application_type,
      valid_from: dto.valid_from ?? existing.valid_from,
      valid_to: dto.valid_to === undefined ? existing.valid_to : dto.valid_to,
      is_active: dto.is_active ?? existing.is_active,
    }, id)

    return this.prisma.$transaction(async (tx) => {
      await tx.tax_rule_brackets.deleteMany({ where: { tax_rule_id: id } })
      return tx.tax_rules.update({
        where: { id },
        data: {
          name: dto.name,
          tax_type: dto.tax_type,
          application_type: dto.application_type as any,
          jurisdiction_id: dto.jurisdiction_id ?? null,
          withholding_concept_id: dto.withholding_concept_id ?? null,
          operation_type: dto.operation_type ?? null,
          cuit_suffix_group: dto.cuit_suffix_group ?? null,
          base_type: dto.base_type as any,
          calculation_method: dto.calculation_method,
          rate: dto.rate ?? null,
          fixed_amount: dto.fixed_amount ?? null,
          minimum_amount: dto.minimum_amount ?? null,
          maximum_amount: dto.maximum_amount ?? null,
          priority: dto.priority ?? 0,
          valid_from: dto.valid_from ? new Date(dto.valid_from) : undefined,
          valid_to: dto.valid_to ? new Date(dto.valid_to) : null,
          is_active: dto.is_active,
          updated_by: userId,
          updated_at: new Date(),
          ...(dto.brackets?.length ? {
            brackets: {
              create: dto.brackets.map(b => ({
                accumulated_from: b.accumulated_from,
                accumulated_to: b.accumulated_to ?? null,
                rate: b.rate,
              })),
            },
          } : {}),
        },
        include: { brackets: true },
      })
    })
  }

  @Delete('tax-rules/:id')
  async deleteTaxRule(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const userId = user.id
    const existing = await this.prisma.tax_rules.findFirst({ where: { id, deleted_at: null } })
    if (!existing) throw new NotFoundException('Regla fiscal no encontrada')
    return this.prisma.tax_rules.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    })
  }
}
