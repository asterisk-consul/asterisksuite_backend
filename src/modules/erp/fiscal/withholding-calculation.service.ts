import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { getCurrentCompanyId } from '@/common/context/request-context.helpers'
import { CalculateWithholdingsDto } from './dto/calculate-withholdings.dto'

export interface WithholdingProposal {
  tax_type: string
  jurisdiction_id: string | null
  jurisdiction_name: string | null
  withholding_concept_id: string | null
  tax_rule_id: string | null
  rule_name: string
  base_amount: number
  prorrate_percentage: number | null
  rate: number
  withheld_amount: number
  automatic_amount: number
  reason: string
}

export interface WithholdingSkip {
  tax_type: string
  reason: string
}

export interface WithholdingCalculationResult {
  proposals: WithholdingProposal[]
  skipped: WithholdingSkip[]
  total_withheld: number
  context: {
    company_id: string
    party_id: string
    operation_type: string
    base_amount: number
    date: string
    accumulated_month: number
    cuit_suffix_group: string | null
  }
}

const WITHHOLDING_TAX_TYPES = ['GANANCIAS', 'IIBB', 'SUSS'] as const

function cuitSuffixGroup(taxId: string | null | undefined): string | null {
  if (!taxId) return null
  const digits = taxId.replace(/\D/g, '')
  if (digits.length < 2) return null
  const prefix = parseInt(digits.slice(0, 2), 10)
  if ([30, 33, 34].includes(prefix)) return 'PJ'
  if ([20, 23, 24, 27].includes(prefix)) return 'PF'
  return null
}

@Injectable()
export class WithholdingCalculationService {
  private readonly logger = new Logger(WithholdingCalculationService.name)

  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext()
  }

  async calculate(dto: CalculateWithholdingsDto): Promise<WithholdingCalculationResult> {
    const companyId = getCurrentCompanyId()
    if (!companyId) {
      throw new BadRequestException('No se pudo resolver la empresa del contexto')
    }

    const date = dto.date ? new Date(dto.date) : new Date()
    const baseAmount = Number(dto.base_amount)
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      throw new BadRequestException('base_amount debe ser mayor a 0')
    }
    const operationType = dto.operation_type ?? 'PURCHASE'
    const taxTypes = dto.tax_types?.length ? dto.tax_types : [...WITHHOLDING_TAX_TYPES]

    let partyTaxId = dto.party_tax_id
    if (!partyTaxId) {
      const party = await this.prisma.business_parties.findFirst({
        where: { id: dto.party_id, deleted_at: null },
        select: { tax_id: true },
      })
      partyTaxId = party?.tax_id ?? undefined
    }
    const group = cuitSuffixGroup(partyTaxId)
    const accumulatedMonth = await this.getAccumulatedMonth(dto.party_id, date)

    const proposals: WithholdingProposal[] = []
    const skipped: WithholdingSkip[] = []

    const companyAgents = await this.prisma.company_tax_jurisdictions.findMany({
      where: {
        company_id: companyId,
        is_withholding_agent: true,
        deleted_at: null,
      },
    })

    const profiles = await this.prisma.business_party_withholding_profiles.findMany({
      where: {
        business_party_id: dto.party_id,
        deleted_at: null,
      },
    })
    const profileByType = new Map<string, (typeof profiles)[number]>(
      profiles.map((p) => [p.tax_type, p]),
    )

    const rules = await this.prisma.tax_rules.findMany({
      where: {
        is_active: true,
        deleted_at: null,
        application_type: 'WITHHOLDING',
        tax_type: { in: taxTypes },
        OR: [
          { valid_to: null },
          { valid_to: { gte: date } },
        ],
        valid_from: { lte: date },
      },
      include: { jurisdiction: true, concept: true },
      orderBy: [{ tax_type: 'asc' }, { priority: 'desc' }],
    })

    const iibbRegistrations = await this.prisma.business_party_iibb_registrations.findMany({
      where: {
        business_party_id: dto.party_id,
        is_active: true,
        deleted_at: null,
      },
      include: { jurisdiction: true },
    })

    for (const taxType of taxTypes) {
      // 1. ¿Nuestra empresa es agente para este impuesto?
      const isAgent = companyAgents.some((a) => a.tax_type === taxType)
      if (!isAgent) {
        skipped.push({
          tax_type: taxType,
          reason: 'La empresa no está configurada como agente de retención para este impuesto',
        })
        continue
      }

      // 2. ¿El tercero es sujeto pasible?
      const profile = profileByType.get(taxType)
      if (profile) {
        if (!profile.is_subject) {
          skipped.push({ tax_type: taxType, reason: 'El tercero no es sujeto pasible' })
          continue
        }
        if (profile.status === 'EXENTO' || profile.status === 'NO_SUJETO') {
          skipped.push({ tax_type: taxType, reason: `El tercero está en estado ${profile.status}` })
          continue
        }
        if (profile.status === 'CERTIFICADO_NO_RETENCION') {
          skipped.push({ tax_type: taxType, reason: 'El tercero posee certificado de no retención' })
          continue
        }
      }

      // 3. Reglas candidatas por tipo de impuesto
      let candidateRules = rules.filter((r) => r.tax_type === taxType)
      if (dto.withholding_concept_id) {
        const conceptMatch = candidateRules.filter(
          (r) => r.withholding_concept_id === dto.withholding_concept_id,
        )
        if (conceptMatch.length > 0) candidateRules = conceptMatch
      }
      if (candidateRules.length === 0) {
        skipped.push({ tax_type: taxType, reason: 'No existe regla vigente para este impuesto' })
        continue
      }

      if (taxType === 'GANANCIAS') {
        const proposal = this.calculateGanancias(
          candidateRules, group, baseAmount, accumulatedMonth,
        )
        if (proposal) proposals.push(proposal)
        else skipped.push({ tax_type: taxType, reason: 'Monto debajo del mínimo no sujeto' })
        continue
      }

      if (taxType === 'SUSS') {
        const proposal = this.calculateSuss(candidateRules, profile, baseAmount, dto.withholding_concept_id)
        if (proposal) proposals.push(proposal)
        else skipped.push({ tax_type: taxType, reason: 'No aplica SUSS para este pago' })
        continue
      }

      if (taxType === 'IIBB') {
        const iibbProposals = this.calculateIibb(
          candidateRules, iibbRegistrations, baseAmount,
        )
        if (iibbProposals.length > 0) proposals.push(...iibbProposals)
        else {
          skipped.push({
            tax_type: taxType,
            reason: 'El tercero no tiene inscripción IIBB registrada (directo o multilateral)',
          })
        }
        continue
      }
    }

    const total = proposals.reduce((sum, p) => sum + p.withheld_amount, 0)

    return {
      proposals,
      skipped,
      total_withheld: Math.round(total * 100) / 100,
      context: {
        company_id: companyId,
        party_id: dto.party_id,
        operation_type: operationType,
        base_amount: baseAmount,
        date: date.toISOString(),
        accumulated_month: accumulatedMonth,
        cuit_suffix_group: group,
      },
    }
  }

  // ─── GANANCIAS: escala por pagos acumulados del mes ────────

  private calculateGanancias(
    rules: Array<{
      id: string
      name: string
      cuit_suffix_group: string | null
      calculation_method: string
      rate: unknown
      minimum_amount: unknown
      brackets: Array<{ accumulated_from: unknown; accumulated_to: unknown; rate: unknown }>
    }>,
    group: string | null,
    baseAmount: number,
    accumulatedMonth: number,
  ): WithholdingProposal | null {
    // Elegir regla por grupo de CUIT (PJ/PF); si no hay match, regla sin grupo
    const rule =
      rules.find((r) => r.cuit_suffix_group && r.cuit_suffix_group === group) ??
      rules.find((r) => !r.cuit_suffix_group)
    if (!rule) return null

    const totalAccumulated = accumulatedMonth + baseAmount
    const minimum = Number(rule.minimum_amount ?? 0)

    if (minimum > 0 && totalAccumulated <= minimum) return null

    let rate: number
    if (rule.calculation_method === 'SCALE' && rule.brackets.length > 0) {
      const bracket = rule.brackets.find((b) => {
        const from = Number(b.accumulated_from)
        const to = b.accumulated_to === null ? Number.POSITIVE_INFINITY : Number(b.accumulated_to)
        return totalAccumulated > from && totalAccumulated <= to
      })
      if (!bracket) return null
      rate = Number(bracket.rate)
    } else {
      rate = Number(rule.rate ?? 0)
    }

    const amount = Math.round(baseAmount * (rate / 100) * 100) / 100
    if (amount <= 0) return null

    return {
      tax_type: 'GANANCIAS',
      jurisdiction_id: null,
      jurisdiction_name: null,
      withholding_concept_id: null,
      tax_rule_id: rule.id,
      rule_name: rule.name,
      base_amount: baseAmount,
      prorrate_percentage: null,
      rate,
      withheld_amount: amount,
      automatic_amount: amount,
      reason: `Régimen general: acumulado mensual ${totalAccumulated.toFixed(2)} supera el mínimo ${minimum.toFixed(2)}`,
    }
  }

  // ─── SUSS: 2% general, 1% PyME ─────────────────────────────

  private calculateSuss(
    rules: Array<{
      id: string
      name: string
      withholding_concept_id: string | null
      calculation_method: string
      rate: unknown
      minimum_amount: unknown
    }>,
    profile: { is_pyme: boolean } | undefined,
    baseAmount: number,
    conceptId?: string,
  ): WithholdingProposal | null {
    const rule =
      (conceptId ? rules.find((r) => r.withholding_concept_id === conceptId) : undefined) ??
      rules[0]
    if (!rule) return null

    const minimum = Number(rule.minimum_amount ?? 0)
    if (minimum > 0 && baseAmount <= minimum) return null

    const rate = profile?.is_pyme ? 1 : Number(rule.rate ?? 2)
    const amount = Math.round(baseAmount * (rate / 100) * 100) / 100
    if (amount <= 0) return null

    return {
      tax_type: 'SUSS',
      jurisdiction_id: null,
      jurisdiction_name: null,
      withholding_concept_id: rule.withholding_concept_id,
      tax_rule_id: rule.id,
      rule_name: rule.name,
      base_amount: baseAmount,
      prorrate_percentage: null,
      rate,
      withheld_amount: amount,
      automatic_amount: amount,
      reason: profile?.is_pyme
        ? 'Beneficiario PyME inscripto: alícuota reducida 1%'
        : 'Régimen general SUSS 2%',
    }
  }

  // ─── IIBB: directo (100%) o multilateral (prorrateo) ───────

  private calculateIibb(
    rules: Array<{
      id: string
      name: string
      jurisdiction_id: string | null
      calculation_method: string
      rate: unknown
      minimum_amount: unknown
      jurisdiction: { id: string; name: string } | null
    }>,
    registrations: Array<{
      registration_type: string
      jurisdiction_id: string | null
      prorrate_percentage: unknown
      jurisdiction: { id: string; name: string } | null
    }>,
    baseAmount: number,
  ): WithholdingProposal[] {
    const proposals: WithholdingProposal[] = []

    for (const reg of registrations) {
      if (!reg.jurisdiction_id || !reg.jurisdiction) continue

      let prorratePct = 100
      if (reg.registration_type === 'CONVENIO_MULTILATERAL') {
        const pct = Number(reg.prorrate_percentage ?? 0)
        if (pct <= 0) continue
        prorratePct = pct
      } else if (reg.registration_type === 'EXENTO') {
        continue
      }

      // Regla inscripto para directo/CM, no inscripto para NO_INSCRIPTO
      const ruleNameSuffix =
        reg.registration_type === 'NO_INSCRIPTO' ? '(No inscripto)' : '(Inscripto directo)'
      const rule =
        rules.find((r) => r.jurisdiction_id === reg.jurisdiction_id && r.name.endsWith(ruleNameSuffix)) ??
        rules.find((r) => r.jurisdiction_id === reg.jurisdiction_id)
      if (!rule) continue

      const jurisdictionBase = (baseAmount * prorratePct) / 100
      const minimum = Number(rule.minimum_amount ?? 0)
      if (minimum > 0 && jurisdictionBase <= minimum) continue

      const rate = Number(rule.rate ?? 0)
      const amount = Math.round(jurisdictionBase * (rate / 100) * 100) / 100
      if (amount <= 0) continue

      proposals.push({
        tax_type: 'IIBB',
        jurisdiction_id: reg.jurisdiction_id,
        jurisdiction_name: reg.jurisdiction.name,
        withholding_concept_id: null,
        tax_rule_id: rule.id,
        rule_name: rule.name,
        base_amount: Math.round(jurisdictionBase * 100) / 100,
        prorrate_percentage: prorratePct,
        rate,
        withheld_amount: amount,
        automatic_amount: amount,
        reason:
          reg.registration_type === 'CONVENIO_MULTILATERAL'
            ? `Convenio Multilateral: prorrateo ${prorratePct}% para ${reg.jurisdiction.name}`
            : `Inscripción directa en ${reg.jurisdiction.name}`,
      })
    }

    return proposals
  }

  // ─── Acumulado de pagos del mes al tercero ─────────────────

  private async getAccumulatedMonth(partyId: string, date: Date): Promise<number> {
    const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
    const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59)

    const result = await this.prisma.payments.aggregate({
      _sum: { amount: true },
      where: {
        party_id: partyId,
        type: 'PAYMENT',
        status: { in: ['CONFIRMED', 'PAID'] },
        deleted_at: null,
        date: { gte: monthStart, lte: monthEnd },
      },
    })

    return Number(result._sum.amount ?? 0)
  }
}
