import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common'
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

@Controller('fiscal')
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
  async putPartyWithholdingProfiles(@Param('partyId') partyId: string, @Body() dto: PutWithholdingProfilesDto, userId?: string) {
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
  async putPartyIibbRegistrations(@Param('partyId') partyId: string, @Body() dto: PutIibbRegistrationsDto, userId?: string) {
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
  async putCompanyTaxJurisdictions(@Body() dto: PutCompanyTaxJurisdictionsDto, userId?: string) {
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
  async createTaxRule(@Body() dto: CreateTaxRuleDto, userId?: string) {
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
        minimum_amount: dto.minimum_amount ?? null,
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
  async updateTaxRule(@Param('id') id: string, @Body() dto: UpdateTaxRuleDto, userId?: string) {
    const existing = await this.prisma.tax_rules.findFirst({ where: { id, deleted_at: null } })
    if (!existing) throw new NotFoundException('Regla fiscal no encontrada')

    return this.prisma.tax_rules.update({
      where: { id },
      data: {
        name: dto.name,
        application_type: dto.application_type as any,
        jurisdiction_id: dto.jurisdiction_id ?? null,
        withholding_concept_id: dto.withholding_concept_id ?? null,
        operation_type: dto.operation_type ?? null,
        cuit_suffix_group: dto.cuit_suffix_group ?? null,
        base_type: dto.base_type as any,
        calculation_method: dto.calculation_method,
        rate: dto.rate ?? null,
        minimum_amount: dto.minimum_amount ?? null,
        valid_from: dto.valid_from ? new Date(dto.valid_from) : undefined,
        valid_to: dto.valid_to ? new Date(dto.valid_to) : null,
        is_active: dto.is_active,
        updated_by: userId,
        updated_at: new Date(),
      },
      include: { brackets: true },
    })
  }

  @Delete('tax-rules/:id')
  async deleteTaxRule(@Param('id') id: string, userId?: string) {
    const existing = await this.prisma.tax_rules.findFirst({ where: { id, deleted_at: null } })
    if (!existing) throw new NotFoundException('Regla fiscal no encontrada')
    return this.prisma.tax_rules.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId },
    })
  }
}
