import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { CreateFinancialInvestmentDto, CreateInvestmentValuationDto, RedeemInvestmentFundDto, SettleFixedTermDto } from './dto/financial-investment.dto';

const round2 = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
const atDate = (value: string | Date) => new Date(`${typeof value === 'string' ? value.slice(0, 10) : value.toISOString().slice(0, 10)}T00:00:00.000Z`);
const daysBetween = (from: Date, to: Date) => Math.max(0, Math.floor((to.getTime() - from.getTime()) / 86400000));

@Injectable()
export class FinancialInvestmentsService {
  constructor(private db: PrismaService, private bankMovements: BankMovementsService) {}

  private get prisma(): any { return this.db.getClientForCurrentContext(); }

  async findAll(status?: string, type?: string) {
    const rows = await this.prisma.financial_investments.findMany({
      where: { deleted_at: null, ...(status ? { status } : {}), ...(type ? { type } : {}) },
      include: { source_bank_account: true, destination_bank_account: true },
      orderBy: [{ status: 'asc' }, { maturity_date: 'asc' }, { created_at: 'desc' }],
    });
    return rows.map((row: any) => this.withComputedValue(row));
  }

  async summary() {
    const rows = await this.findAll();
    const active = rows.filter((row: any) => ['ACTIVE', 'MATURED_PENDING_SETTLEMENT', 'REDEMPTION_REQUESTED'].includes(row.status));
    const byCurrency: Record<string, any> = {};
    for (const row of active) {
      const bucket = byCurrency[row.currency_code] ??= { currency_code: row.currency_code, capital: 0, current_value: 0, accrued_return: 0, count: 0 };
      bucket.capital = round2(bucket.capital + Number(row.capital_amount));
      bucket.current_value = round2(bucket.current_value + Number(row.current_value));
      bucket.accrued_return = round2(bucket.accrued_return + Number(row.accrued_return));
      bucket.count += 1;
    }
    return { by_currency: Object.values(byCurrency), upcoming_maturities: active.filter((r: any) => r.maturity_date).slice(0, 8) };
  }

  async findOne(id: string) {
    const row = await this.prisma.financial_investments.findFirst({
      where: { id, deleted_at: null },
      include: {
        source_bank_account: true,
        destination_bank_account: true,
        valuations: { orderBy: { valuation_date: 'desc' } },
        transactions: { orderBy: [{ date: 'desc' }, { created_at: 'desc' }] },
      },
    });
    if (!row) throw new NotFoundException('Inversión no encontrada');
    return this.withComputedValue(row);
  }

  async create(dto: CreateFinancialInvestmentDto, userId: string) {
    this.validateCreation(dto);
    const prisma = this.prisma;
    const investmentId = await prisma.$transaction(async (tx: any) => {
      const account = await tx.bank_accounts.findFirst({ where: { id: dto.source_bank_account_id, deleted_at: null, active: true } });
      if (!account) throw new NotFoundException('Cuenta bancaria de origen no encontrada');
      if (account.currency_code !== dto.currency_code) throw new BadRequestException(`La cuenta de origen opera en ${account.currency_code}`);
      if (Number(account.balance) < dto.capital_amount) throw new BadRequestException('La cuenta bancaria no tiene saldo suficiente para constituir la inversión');

      const start = atDate(dto.start_date);
      const maturity = dto.maturity_date ? atDate(dto.maturity_date) : null;
      const units = dto.type === 'INVESTMENT_FUND'
        ? Number(dto.units ?? dto.capital_amount / Number(dto.initial_unit_value))
        : null;
      const expected = dto.type === 'FIXED_TERM'
        ? this.fixedTermValue(dto.capital_amount, Number(dto.annual_nominal_rate), start, maturity!, dto.day_count_basis ?? 365)
        : dto.capital_amount;

      const investment = await tx.financial_investments.create({ data: {
        type: dto.type, status: 'ACTIVE', name: dto.name, institution_name: dto.institution_name ?? account.bank_name,
        currency_code: dto.currency_code, source_bank_account_id: dto.source_bank_account_id,
        destination_bank_account_id: dto.destination_bank_account_id ?? dto.source_bank_account_id,
        capital_amount: dto.capital_amount, start_date: start, maturity_date: maturity,
        annual_nominal_rate: dto.annual_nominal_rate ?? null, day_count_basis: dto.day_count_basis ?? 365,
        liquidity_type: dto.type === 'FIXED_TERM' ? (dto.liquidity_type ?? 'NON_CANCELABLE') : null,
        early_cancel_available_from: dto.early_cancel_available_from ? atDate(dto.early_cancel_available_from) : null,
        early_cancel_annual_rate: dto.early_cancel_annual_rate ?? null,
        units, initial_unit_value: dto.initial_unit_value ?? null, current_unit_value: dto.initial_unit_value ?? null,
        current_unit_value_date: dto.type === 'INVESTMENT_FUND' ? start : null,
        expected_final_amount: expected, auto_renew: dto.auto_renew ?? false, reference: dto.reference ?? null,
        notes: dto.notes ?? null, created_by: userId,
      }});
      const operation = await this.bankMovements.openOperation({ bankAccountId: account.id, operationType: 'INVESTMENT', sourceType: 'financial_investment', sourceId: investment.id, date: start, currencyCode: dto.currency_code, description: `Constitución de ${dto.name}`, reference: dto.reference, userId }, tx);
      const movement = await this.bankMovements.addMovement({ bankAccountId: account.id, operationId: operation.id, type: 'WITHDRAWAL', nature: 'DEBIT', amount: -dto.capital_amount, currencyCode: dto.currency_code, description: `Constitución de inversión: ${dto.name}`, referenceType: 'financial_investment', referenceId: investment.id, date: start, userId }, tx);
      await this.bankMovements.closeOperation(operation.id, tx);
      await tx.financial_investment_transactions.create({ data: { investment_id: investment.id, type: 'SUBSCRIPTION', date: start, amount: dto.capital_amount, capital_amount: dto.capital_amount, bank_account_movement_id: movement.id, reference: dto.reference ?? null, created_by: userId } });
      if (dto.type === 'INVESTMENT_FUND') await tx.financial_investment_valuations.create({ data: { investment_id: investment.id, valuation_date: start, unit_value: dto.initial_unit_value, units, total_value: dto.capital_amount, unrealized_return: 0, notes: 'Valuación inicial', created_by: userId } });
      return investment.id;
    });
    return this.findOne(investmentId);
  }

  async addValuation(id: string, dto: CreateInvestmentValuationDto, userId: string) {
    const investment = await this.findOne(id);
    if (investment.type !== 'INVESTMENT_FUND') throw new BadRequestException('Las valuaciones por cuotaparte corresponden únicamente a fondos de inversión');
    if (investment.status !== 'ACTIVE') throw new BadRequestException('La inversión no está activa');
    const total = round2(Number(investment.units) * dto.unit_value);
    await this.prisma.$transaction([
      this.prisma.financial_investment_valuations.upsert({ where: { investment_id_valuation_date: { investment_id: id, valuation_date: atDate(dto.valuation_date) } }, update: { unit_value: dto.unit_value, units: investment.units, total_value: total, unrealized_return: round2(total - Number(investment.capital_amount)), notes: dto.notes ?? null }, create: { investment_id: id, valuation_date: atDate(dto.valuation_date), unit_value: dto.unit_value, units: investment.units, total_value: total, unrealized_return: round2(total - Number(investment.capital_amount)), notes: dto.notes ?? null, created_by: userId } }),
      this.prisma.financial_investments.update({ where: { id }, data: { current_unit_value: dto.unit_value, current_unit_value_date: atDate(dto.valuation_date), updated_by: userId } }),
    ]);
    return this.findOne(id);
  }

  async settleFixedTerm(id: string, dto: SettleFixedTermDto, userId: string) {
    const current = await this.findOne(id);
    if (current.type !== 'FIXED_TERM') throw new BadRequestException('Esta acción corresponde únicamente a plazos fijos');
    if (!['ACTIVE', 'MATURED_PENDING_SETTLEMENT'].includes(current.status)) throw new BadRequestException('El plazo fijo ya fue liquidado o cancelado');
    const date = atDate(dto.date);
    const isEarlyCancellation = Boolean(current.maturity_date && date < atDate(current.maturity_date));
    if (isEarlyCancellation) {
      if (current.liquidity_type !== 'PRE_CANCELABLE') {
        throw new BadRequestException(`El plazo fijo no puede liquidarse antes de su vencimiento (${atDate(current.maturity_date).toLocaleDateString('es-AR', { timeZone: 'UTC' })})`);
      }
      if (!current.early_cancel_available_from || date < atDate(current.early_cancel_available_from)) {
        const availableLabel = current.early_cancel_available_from
          ? atDate(current.early_cancel_available_from).toLocaleDateString('es-AR', { timeZone: 'UTC' })
          : 'la fecha indicada por el banco';
        throw new BadRequestException(`La precancelación estará disponible desde ${availableLabel}`);
      }
      if (dto.mode !== 'CREDIT_ALL') throw new BadRequestException('Una precancelación debe acreditarse; la renovación se realiza al vencimiento');
    }
    const suggestedAmount = isEarlyCancellation
      ? this.fixedTermValue(Number(current.capital_amount), Number(current.early_cancel_annual_rate ?? 0), new Date(current.start_date), date, current.day_count_basis ?? 365)
      : Number(current.expected_final_amount);
    const actual = round2(dto.actual_amount ?? suggestedAmount);
    const capital = Number(current.capital_amount);
    const realized = round2(actual - capital);
    const prisma = this.prisma;
    await prisma.$transaction(async (tx: any) => {
      let creditAmount = dto.mode === 'CREDIT_ALL' ? actual : dto.mode === 'RENEW_CAPITAL' ? Math.max(0, realized) : 0;
      let movementId: string | null = null;
      const bankAccountId = dto.bank_account_id ?? current.destination_bank_account_id ?? current.source_bank_account_id;
      if (creditAmount > 0) {
        const account = await tx.bank_accounts.findFirst({ where: { id: bankAccountId, deleted_at: null, active: true } });
        if (!account || account.currency_code !== current.currency_code) throw new BadRequestException('Seleccioná una cuenta bancaria activa de la misma moneda');
        const operation = await this.bankMovements.openOperation({ bankAccountId, operationType: 'INVESTMENT', sourceType: 'financial_investment', sourceId: id, date, currencyCode: current.currency_code, description: `Liquidación de ${current.name}`, reference: dto.reference, userId }, tx);
        const movement = await this.bankMovements.addMovement({ bankAccountId, operationId: operation.id, type: 'DEPOSIT', nature: 'CREDIT', amount: creditAmount, currencyCode: current.currency_code, description: `Acreditación de inversión: ${current.name}`, referenceType: 'financial_investment', referenceId: id, date, userId }, tx);
        movementId = movement.id;
        for (const charge of dto.charges ?? []) {
          const concept = await tx.bank_concepts.findFirst({ where: { id: charge.concept_id, deleted_at: null, is_active: true, available_settlements: true } });
          if (!concept) throw new BadRequestException('Uno de los conceptos bancarios no está disponible para liquidaciones');
          const nature = concept.nature === 'CREDIT' ? 'CREDIT' : 'DEBIT';
          const sign = nature === 'CREDIT' ? 1 : -1;
          const movementType = concept.concept_type === 'RETENTION' ? 'RETENTION' : concept.concept_type === 'TAX' ? 'TAX' : concept.concept_type === 'INTEREST' ? 'INTEREST' : concept.concept_type === 'ADJUSTMENT' ? 'ADJUSTMENT' : 'FEE';
          await this.bankMovements.addMovement({ bankAccountId, operationId: operation.id, conceptId: concept.id, type: movementType, nature, amount: sign * Number(charge.amount), totalAmount: Number(charge.amount), currencyCode: current.currency_code, description: `${concept.name} · ${current.name}`, referenceType: 'financial_investment', referenceId: id, date, userId }, tx);
        }
        await this.bankMovements.closeOperation(operation.id, tx);
      }
      await tx.financial_investment_transactions.create({ data: { investment_id: id, type: 'MATURITY', date, amount: actual, capital_amount: capital, return_amount: realized, bank_account_movement_id: movementId, reference: dto.reference ?? null, notes: dto.notes ?? null, created_by: userId } });
      await tx.financial_investments.update({ where: { id }, data: { status: dto.mode === 'CREDIT_ALL' ? 'REDEEMED' : 'RENEWED', realized_return: realized, updated_by: userId } });
      if (dto.mode !== 'CREDIT_ALL') {
        if (!dto.new_maturity_date) throw new BadRequestException('Indicá el vencimiento del nuevo plazo fijo');
        const renewedCapital = dto.mode === 'RENEW_ALL' ? actual : capital;
        const newRate = dto.new_annual_nominal_rate ?? Number(current.annual_nominal_rate);
        const newMaturity = atDate(dto.new_maturity_date);
        const renewed = await tx.financial_investments.create({ data: { type: 'FIXED_TERM', status: 'ACTIVE', name: current.name, institution_name: current.institution_name, currency_code: current.currency_code, source_bank_account_id: current.source_bank_account_id, destination_bank_account_id: bankAccountId, capital_amount: renewedCapital, start_date: date, maturity_date: newMaturity, annual_nominal_rate: newRate, day_count_basis: current.day_count_basis, liquidity_type: 'NON_CANCELABLE', expected_final_amount: this.fixedTermValue(renewedCapital, newRate, date, newMaturity, current.day_count_basis), auto_renew: current.auto_renew, reference: dto.reference ?? null, notes: `Renovación de ${current.name}. Revisá las condiciones de precancelación del nuevo certificado.`, created_by: userId } });
        await tx.financial_investment_transactions.create({ data: { investment_id: renewed.id, type: 'RENEWAL', date, amount: renewedCapital, capital_amount: renewedCapital, reference: dto.reference ?? null, created_by: userId } });
      }
    });
    return this.findOne(id);
  }

  async redeemFund(id: string, dto: RedeemInvestmentFundDto, userId: string) {
    const current = await this.findOne(id);
    if (current.type !== 'INVESTMENT_FUND' || current.status !== 'ACTIVE') throw new BadRequestException('El fondo no está disponible para rescate');
    if (dto.units > Number(current.units)) throw new BadRequestException('No podés rescatar más cuotapartes que las disponibles');
    const remaining = Number(current.units) - dto.units;
    const proportionalCapital = round2(Number(current.capital_amount) * dto.units / Number(current.units));
    const realized = round2(dto.credited_amount - proportionalCapital);
    const date = atDate(dto.date);
    const prisma = this.prisma;
    await prisma.$transaction(async (tx: any) => {
      const operation = await this.bankMovements.openOperation({ bankAccountId: dto.bank_account_id, operationType: 'INVESTMENT', sourceType: 'financial_investment', sourceId: id, date, currencyCode: current.currency_code, description: `Rescate de ${current.name}`, reference: dto.reference, userId }, tx);
      const movement = await this.bankMovements.addMovement({ bankAccountId: dto.bank_account_id, operationId: operation.id, type: 'DEPOSIT', nature: 'CREDIT', amount: dto.credited_amount, currencyCode: current.currency_code, description: `Rescate de fondo: ${current.name}`, referenceType: 'financial_investment', referenceId: id, date, userId }, tx);
      for (const charge of dto.charges ?? []) {
        const concept = await tx.bank_concepts.findFirst({ where: { id: charge.concept_id, deleted_at: null, is_active: true, available_settlements: true } });
        if (!concept) throw new BadRequestException('Uno de los conceptos bancarios no está disponible para liquidaciones');
        const nature = concept.nature === 'CREDIT' ? 'CREDIT' : 'DEBIT';
        const sign = nature === 'CREDIT' ? 1 : -1;
        const movementType = concept.concept_type === 'RETENTION' ? 'RETENTION' : concept.concept_type === 'TAX' ? 'TAX' : concept.concept_type === 'INTEREST' ? 'INTEREST' : concept.concept_type === 'ADJUSTMENT' ? 'ADJUSTMENT' : 'FEE';
        await this.bankMovements.addMovement({ bankAccountId: dto.bank_account_id, operationId: operation.id, conceptId: concept.id, type: movementType, nature, amount: sign * Number(charge.amount), totalAmount: Number(charge.amount), currencyCode: current.currency_code, description: `${concept.name} · ${current.name}`, referenceType: 'financial_investment', referenceId: id, date, userId }, tx);
      }
      await this.bankMovements.closeOperation(operation.id, tx);
      await tx.financial_investment_transactions.create({ data: { investment_id: id, type: 'REDEMPTION', date, amount: dto.credited_amount, capital_amount: proportionalCapital, return_amount: realized, bank_account_movement_id: movement.id, reference: dto.reference ?? null, notes: dto.notes ?? null, created_by: userId } });
      await tx.financial_investments.update({ where: { id }, data: { units: remaining, capital_amount: round2(Number(current.capital_amount) - proportionalCapital), realized_return: { increment: realized }, status: remaining <= 0.00000001 ? 'REDEEMED' : 'ACTIVE', updated_by: userId } });
    });
    return this.findOne(id);
  }

  private validateCreation(dto: CreateFinancialInvestmentDto) {
    if (dto.type === 'FIXED_TERM' && (!dto.maturity_date || dto.annual_nominal_rate == null)) throw new BadRequestException('El plazo fijo requiere vencimiento y TNA');
    if (dto.type === 'INVESTMENT_FUND' && !dto.initial_unit_value) throw new BadRequestException('El fondo requiere el valor inicial de la cuotaparte');
    if (dto.maturity_date && atDate(dto.maturity_date) <= atDate(dto.start_date)) throw new BadRequestException('El vencimiento debe ser posterior a la constitución');
    if (dto.type === 'FIXED_TERM' && dto.liquidity_type === 'PRE_CANCELABLE') {
      if (!dto.early_cancel_available_from || dto.early_cancel_annual_rate == null) throw new BadRequestException('El plazo fijo precancelable requiere la fecha habilitada y la TNA de precancelación');
      const earlyDate = atDate(dto.early_cancel_available_from);
      if (earlyDate <= atDate(dto.start_date) || (dto.maturity_date && earlyDate >= atDate(dto.maturity_date))) throw new BadRequestException('La fecha de precancelación debe estar entre la constitución y el vencimiento');
    }
  }

  private fixedTermValue(capital: number, rate: number, start: Date, end: Date, basis = 365) {
    return round2(capital * (1 + (rate / 100) * daysBetween(start, end) / basis));
  }

  private withComputedValue(row: any) {
    const result = { ...row };
    const capital = Number(row.capital_amount);
    if (row.type === 'FIXED_TERM') {
      const today = atDate(new Date());
      const end = row.maturity_date && today > new Date(row.maturity_date) ? new Date(row.maturity_date) : today;
      const current = this.fixedTermValue(capital, Number(row.annual_nominal_rate ?? 0), new Date(row.start_date), end, row.day_count_basis ?? 365);
      result.current_value = current;
      result.accrued_return = round2(current - capital);
      result.projected_return = round2(Number(row.expected_final_amount ?? capital) - capital);
      result.days_elapsed = daysBetween(new Date(row.start_date), end);
      result.days_remaining = row.maturity_date ? Math.max(0, daysBetween(today, new Date(row.maturity_date))) : null;
      result.can_early_cancel = row.liquidity_type === 'PRE_CANCELABLE' && row.early_cancel_available_from && today >= new Date(row.early_cancel_available_from) && (!row.maturity_date || today < new Date(row.maturity_date));
      result.early_cancel_value = result.can_early_cancel
        ? this.fixedTermValue(capital, Number(row.early_cancel_annual_rate ?? 0), new Date(row.start_date), today, row.day_count_basis ?? 365)
        : null;
      if (row.status === 'ACTIVE' && row.maturity_date && today > new Date(row.maturity_date)) result.display_status = 'MATURED_PENDING_SETTLEMENT';
    } else if (row.type === 'INVESTMENT_FUND') {
      const current = round2(Number(row.units ?? 0) * Number(row.current_unit_value ?? 0));
      result.current_value = current;
      result.accrued_return = round2(current - capital);
      result.projected_return = null;
    } else {
      result.current_value = capital;
      result.accrued_return = 0;
      result.projected_return = null;
    }
    return result;
  }
}
