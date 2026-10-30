import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { parseLocalDateTime } from '@/common/utils/dates';
import { CurrencyConversionService } from '../currencies/currency-conversion.service';
import { CurrentAccountsService } from '../current-accounts/current-accounts.service';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import { SalesCommercialFlowService } from '../documents-sales/sales-commercial-flow.service';
import { DocumentsSalesService } from '../documents-sales/documents_sales.services';
import { recalculateBankAccountLedger } from '../bank-accounts/bank-account-ledger';
import { recalculateCurrentAccountLedger } from '../current-accounts/current-account-ledger';
import { BankMovementsService } from '../bank-movements/bank-movements.service';
import { CreditCardsService } from '../credit-cards/credit-cards.service';

@Injectable()
export class PaymentsService {
  constructor(
    private db: PrismaService,
    private conversionService: CurrencyConversionService,
    private currentAccountsService: CurrentAccountsService,
    private commercialFlow: SalesCommercialFlowService,
    private documentsSales: DocumentsSalesService,
    private bankMovements: BankMovementsService,
    private creditCardsService: CreditCardsService,
  ) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private getCompanyId(): string | undefined {
    return getCurrentCompanyId();
  }

  private validatePaymentInstrument(
    method: string,
    options: {
      cashBoxId?: string | null;
      bankAccountId?: string | null;
      hasChecks?: boolean;
      creditCardId?: string | null;
    },
  ) {
    if (method === 'CASH' && !options.cashBoxId) {
      throw new BadRequestException('Seleccioná una caja para registrar el pago o cobro');
    }
    if (method === 'BANK_TRANSFER' && !options.bankAccountId) {
      throw new BadRequestException('Seleccioná una cuenta bancaria para registrar el pago o cobro');
    }
    if (method === 'CHECK' && !options.hasChecks) {
      throw new BadRequestException('Seleccioná al menos un cheque para registrar el pago o cobro');
    }
    if (method === 'CREDIT_CARD' && !options.creditCardId) {
      throw new BadRequestException('Seleccioná una tarjeta corporativa o canal de cobro');
    }
  }

  private validateMixedTenders(
    tenders: Array<{ method: string; amount: any; cash_box_id?: string | null; bank_account_id?: string | null }> | undefined,
    amount: number,
    hasChecks: boolean,
  ) {
    if (!tenders || tenders.length < 2 || tenders.length > 3) {
      throw new BadRequestException('Un pago mixto debe combinar entre dos y tres medios');
    }
    const methods = new Set(tenders.map((tender) => tender.method));
    if ([...methods].some((method) => !['CASH', 'BANK_TRANSFER', 'CHECK'].includes(method))) {
      throw new BadRequestException('Los pagos mixtos solo admiten efectivo, transferencias y cheques');
    }
    if (methods.size !== tenders.length) {
      throw new BadRequestException('Cada medio puede agregarse una sola vez al pago mixto');
    }
    const hasCheckTender = methods.has('CHECK');
    if (hasCheckTender !== hasChecks) {
      throw new BadRequestException('La selección de cheques debe coincidir con los medios del pago mixto');
    }

    const total = tenders.reduce((sum, tender) => sum + Number(tender.amount), 0);
    if (Math.abs(Math.round(total * 100) / 100 - Math.round(amount * 100) / 100) > 0.01) {
      throw new BadRequestException('La suma de los medios debe coincidir con el importe del pago');
    }

    for (const tender of tenders) {
      this.validatePaymentInstrument(tender.method, {
        cashBoxId: tender.cash_box_id,
        bankAccountId: tender.bank_account_id,
        hasChecks: hasCheckTender,
      });
      if (tender.method === 'CASH' && tender.bank_account_id) {
        throw new BadRequestException('El efectivo solo puede asociarse a una caja');
      }
      if (tender.method === 'BANK_TRANSFER' && tender.cash_box_id) {
        throw new BadRequestException('La transferencia solo puede asociarse a una cuenta bancaria');
      }
      if (tender.method === 'CHECK' && (tender.cash_box_id || tender.bank_account_id)) {
        throw new BadRequestException('Los cheques no pueden asociarse a una caja o cuenta bancaria');
      }
    }
  }

  private tenderMovementPayment(payment: any, tender: any, convertedAmount: number | null) {
    return {
      ...payment,
      amount: tender.amount,
      converted_amount: convertedAmount,
      cash_box_id: tender.method === 'CASH' ? tender.cash_box_id : null,
      bank_account_id: tender.method === 'BANK_TRANSFER' ? tender.bank_account_id : null,
    };
  }

  private mixedTenderConvertedAmounts(payment: any, tenders: any[]) {
    const convertedTotal = payment.converted_amount == null ? null : Number(payment.converted_amount);
    const amountTotal = Number(payment.amount);
    if (convertedTotal == null || amountTotal <= 0 || !tenders.length) return tenders.map(() => null);

    const amounts = tenders.map((tender) => Math.round((convertedTotal * Number(tender.amount) / amountTotal) * 100) / 100);
    const allocated = amounts.slice(0, -1).reduce((sum, amount) => sum + amount, 0);
    amounts[amounts.length - 1] = Math.round((convertedTotal - allocated) * 100) / 100;
    return amounts;
  }

  // ═══════════════════════════════════════════
  // CREATE (DRAFT — no side effects)
  // ═══════════════════════════════════════════

  async create(dto: CreatePaymentDto, userId: string) {
    if (dto.installments_total != null && (!Number.isInteger(dto.installments_total) || dto.installments_total < 1 || dto.installments_total > 48)) {
      throw new BadRequestException('La cantidad de cuotas debe ser un número entero entre 1 y 48');
    }
    if (dto.withholding_remittance_id) {
      if (dto.type !== 'PAYMENT' || dto.payment_method !== 'BANK_TRANSFER' || dto.party_id || dto.documents?.length || dto.obligations?.length || dto.withholdings?.length) {
        throw new BadRequestException('Un VEP se registra como pago bancario independiente, sin tercero, facturas ni retenciones nuevas')
      }
      const remittance = await this.prisma.withholding_remittances.findFirst({ where: { id: dto.withholding_remittance_id, deleted_at: null } })
      if (!remittance || remittance.status !== 'REGISTERED') throw new BadRequestException('El VEP no existe o ya fue pagado')
      if (Math.abs(Number(remittance.vep_amount) - dto.amount) > 0.01 || remittance.currency_code.toUpperCase() !== dto.currency_code.toUpperCase()) {
        throw new BadRequestException('El importe y la moneda del pago deben coincidir con el VEP')
      }
      const activePayment = await this.prisma.payments.findFirst({ where: { withholding_remittance_id: remittance.id, deleted_at: null, status: { in: ['DRAFT', 'CONFIRMED', 'PAID'] } }, select: { id: true } })
      if (activePayment) throw new BadRequestException('Este VEP ya tiene un pago en curso')
    }
    if (dto.obligations?.length && dto.type !== 'PAYMENT') {
      throw new BadRequestException('Los servicios e impuestos pendientes solo pueden asociarse a un pago');
    }
    console.log('[payments] create DTO:', JSON.stringify(dto, null, 2));
    console.log('[payments] create userId:', userId);

    if (dto.documents && dto.documents.length > 0 && !dto.party_id) {
      throw new BadRequestException('party_id es requerido cuando se aplican documentos');
    }

    if (dto.payment_mode === 'ADVANCE' && !dto.party_id) {
      throw new BadRequestException('party_id es requerido para anticipos');
    }

    const isMixedPayment = dto.payment_method === 'MIXED';
    const hasRequestedChecks = Boolean(dto.checks?.length || dto.check_ids?.length);
    if (isMixedPayment) {
      if (dto.bank_charges?.length) {
        throw new BadRequestException('Los gastos bancarios detallados no se pueden incluir en pagos mixtos todavía');
      }
      if (dto.withholding_remittance_id) {
        throw new BadRequestException('Un VEP debe registrarse como un pago bancario independiente');
      }
      this.validateMixedTenders(dto.tenders, dto.amount, hasRequestedChecks);
    } else {
      if (dto.tenders?.length) throw new BadRequestException('Los medios detallados solo se usan en pagos mixtos');
      this.validatePaymentInstrument(dto.payment_method, {
        cashBoxId: dto.cash_box_id,
        bankAccountId: dto.bank_account_id,
        hasChecks: hasRequestedChecks,
        creditCardId: dto.credit_card_id,
      });
    }

    const party = dto.party_id
      ? await this.prisma.business_parties.findFirst({
          where: { id: dto.party_id, deleted_at: null },
          select: {
            type: true,
            roles: { where: { active: true }, select: { role: true } },
            employees: { where: { is_active: true, deleted_at: null }, select: { id: true } },
          },
        })
      : null;

    if (dto.party_id && !party) {
      throw new BadRequestException('La parte interesada seleccionada no existe');
    }

    if (dto.payment_method === 'PAYROLL_DEDUCTION') {
      const customerEnabled = party?.type === 'CUSTOMER' || party?.roles.some((role) => role.role === 'CUSTOMER');
      if (dto.type !== 'COLLECTION') {
        throw new BadRequestException('El descuento de haberes solo puede utilizarse para cobrar una venta');
      }
      if (!party?.employees.length || !customerEnabled) {
        throw new BadRequestException('Seleccioná un empleado habilitado como cliente interno');
      }
      if (!dto.documents?.length) {
        throw new BadRequestException('El descuento de haberes debe aplicarse a un documento de venta');
      }
    }

    const paymentPartyType = dto.type === 'COLLECTION' ? 'CUSTOMER' : (party?.type ?? dto.party_type);

    // Resolver los cheques antes de crear el pago o cobro. El instrumento
    // físico se recibe o entrega por su valor completo: no es fraccionable.
    const checkAllocations: { check_id: string; amount_applied: number }[] = [];
    if (dto.checks?.length) {
      for (const requested of dto.checks) {
        const check = await this.prisma.checks.findFirst({
          where: { id: requested.check_id, deleted_at: null },
        });
        if (!check) throw new NotFoundException(`Cheque ${requested.check_id} no encontrado`);
        const available = check.available_amount != null ? Number(check.available_amount) : Number(check.amount);
        if (requested.amount_applied > available + 0.01) {
          throw new BadRequestException(
            `El cheque #${check.check_number} tiene saldo disponible ${available} y se intenta aplicar ${requested.amount_applied}`,
          );
        }
        const amountApplied = available;
        if (check.is_own && Math.abs(amountApplied - Number(check.amount)) > 0.01) {
          throw new BadRequestException(
            `El cheque propio #${check.check_number} se aplica por su monto total (${check.amount}).`,
          );
        }
        checkAllocations.push({ check_id: requested.check_id, amount_applied: amountApplied });
      }
    } else if (dto.check_ids?.length) {
      for (const checkId of dto.check_ids) {
        const check = await this.prisma.checks.findFirst({ where: { id: checkId, deleted_at: null } });
        if (!check) throw new NotFoundException(`Cheque ${checkId} no encontrado`);
        checkAllocations.push({
          check_id: checkId,
          amount_applied: check.available_amount != null ? Number(check.available_amount) : Number(check.amount),
        });
      }
    }
    if (isMixedPayment) {
      const checkTender = dto.tenders!.find((tender) => tender.method === 'CHECK');
      const checksAmount = checkAllocations.reduce((sum, allocation) => sum + allocation.amount_applied, 0);
      if (checkTender && Math.abs(Math.round(checksAmount * 100) / 100 - Math.round(checkTender.amount * 100) / 100) > 0.01) {
        throw new BadRequestException('El importe del medio cheque debe coincidir con el valor de los cheques seleccionados');
      }
    }
    const effectiveAmount =
      !isMixedPayment && dto.payment_method === 'CHECK' && checkAllocations.length > 0
        ? Number(checkAllocations.reduce((sum, allocation) => sum + allocation.amount_applied, 0).toFixed(2))
        : dto.amount;

    const paymentNumber = await this.prisma.payments.aggregate({
      _max: {
        number: true,
      },
    });

    const nextNumber = (paymentNumber._max.number ?? 0) + 1;

    // ─── Auto-calculate converted_amount if not provided ─────────
    let convertedAmount = effectiveAmount === dto.amount ? (dto.converted_amount ?? null) : null;
    let exchangeRate = dto.exchange_rate ?? null;
    let rateType = (dto.rate_type as any) ?? null;

    if (dto.currency_code && !convertedAmount) {
      try {
        const baseCurrency = await this.conversionService.getBaseCurrency();
        if (dto.currency_code.toUpperCase() !== baseCurrency.code.toUpperCase()) {
          if (!exchangeRate) {
            const resolved = await this.conversionService.resolveRate(
              dto.currency_code,
              baseCurrency.code,
              parseLocalDateTime(dto.date),
              rateType,
            );
            exchangeRate = resolved.rate;
            rateType = resolved.rateType;
          }
          convertedAmount = this.conversionService.convertAmount(effectiveAmount, exchangeRate);
        }
      } catch {
        // If rate not found, leave as null
      }
    }

    try {
      console.log('[payments] create dto.date:', dto.date, '→ parsed:', parseLocalDateTime(dto.date).toISOString());
      const payment = await this.prisma.payments.create({
        data: {
          number: nextNumber,
          type: dto.type as any,
          payment_mode: (dto.payment_mode as any) ?? 'NORMAL',
          date: parseLocalDateTime(dto.date),
          party_id: dto.party_id,
          party_type: paymentPartyType,
          payment_method: dto.payment_method as any,
          amount: effectiveAmount,
          currency_code: dto.currency_code,
          exchange_rate: exchangeRate,
          rate_type: rateType,
          converted_amount: convertedAmount,
          exchange_note: dto.exchange_note,
          description: dto.description,
          reference: dto.reference,
          bank_account_id: isMixedPayment ? null : dto.bank_account_id,
          cash_box_id: isMixedPayment ? null : dto.cash_box_id,
          account_id: dto.account_id,
          withholding_remittance_id: dto.withholding_remittance_id,
          status: 'DRAFT',
          created_by: userId,
        },
      });

      if (isMixedPayment) {
        await this.prisma.payment_tenders.createMany({
          data: dto.tenders!.map((tender) => ({
            payment_id: payment.id,
            method: tender.method as any,
            amount: tender.amount,
            cash_box_id: tender.cash_box_id ?? null,
            bank_account_id: tender.bank_account_id ?? null,
            created_by: userId,
          })),
        });
      }

      // Store documents for later confirmation
      if (dto.documents && dto.documents.length > 0) {
        for (const doc of dto.documents) {
          await this.prisma.payment_documents.create({
            data: {
              payment_id: payment.id,
              document_id: doc.document_id,
              amount_applied: doc.amount_applied,
              created_by: userId,
            },
          });
        }
      }

      await this.syncTreasuryObligations(payment.id, dto.obligations, dto.party_id, dto.currency_code, userId);

      if (dto.payment_method === 'CREDIT_CARD' && dto.credit_card_id) {
        const card = await this.prisma.credit_cards.findFirst({
          where: { id: dto.credit_card_id, active: true, deleted_at: null },
        });
        if (!card) throw new BadRequestException('La tarjeta o canal de cobro seleccionado no existe o está inactivo');
        const expectedType = dto.type === 'COLLECTION' ? 'CUSTOMER' : 'COMPANY';
        if (card.type !== expectedType) {
          throw new BadRequestException(
            dto.type === 'COLLECTION'
              ? 'Seleccioná un canal de cobro para registrar una venta con tarjeta'
              : 'Seleccioná una tarjeta corporativa para pagar una compra',
          );
        }
        const installments = Math.max(1, dto.installments_total ?? 1);
        const commissionRate = dto.type === 'COLLECTION' ? Number(card.commission_rate ?? 0) : 0;
        const commissionAmount = Number(((effectiveAmount * commissionRate) / 100).toFixed(2));
        const transaction = await this.prisma.credit_card_transactions.create({
          data: {
            credit_card_id: card.id,
            payment_id: payment.id,
            type: dto.type === 'COLLECTION' ? 'COLLECTION' : 'PURCHASE',
            date: parseLocalDateTime(dto.date),
            amount: effectiveAmount,
            currency_code: dto.currency_code,
            exchange_rate: exchangeRate,
            rate_type: rateType,
            converted_amount: convertedAmount,
            commission_rate: commissionRate || null,
            commission_amount: commissionAmount || null,
            net_amount: dto.type === 'COLLECTION' ? effectiveAmount - commissionAmount : effectiveAmount,
            net_currency_code: dto.currency_code,
            expected_clearing_date: dto.expected_clearing_date
              ? parseLocalDateTime(dto.expected_clearing_date)
              : dto.type === 'COLLECTION' && card.clearing_days
                ? new Date(parseLocalDateTime(dto.date).getTime() + card.clearing_days * 86400000)
                : null,
            installments_total: installments,
            installment_amount: Number((effectiveAmount / installments).toFixed(2)),
            description: dto.description,
            authorization: dto.card_authorization,
            created_by: userId,
          },
        });
        if (dto.type !== 'COLLECTION') {
          const baseDate = parseLocalDateTime(dto.date);
          for (let installment = 1; installment <= installments; installment += 1) {
            const dueDate = new Date(baseDate);
            dueDate.setMonth(dueDate.getMonth() + installment);
            await this.prisma.credit_card_installments.create({
              data: {
                transaction_id: transaction.id,
                installment_number: installment,
                total_installments: installments,
                amount: Number((effectiveAmount / installments).toFixed(2)),
                currency_code: dto.currency_code,
                exchange_rate: exchangeRate,
                due_date: dueDate,
                created_by: userId,
              },
            });
          }
        }
      }

      // Store withholdings (retenciones) — status CALCULATED until confirm
      if (dto.withholdings && dto.withholdings.length > 0) {
        if (!dto.party_id) {
          throw new BadRequestException('party_id es requerido cuando se registran retenciones');
        }
        for (const wh of dto.withholdings) {
          await this.prisma.withholdings.create({
            data: {
              company_id: this.getCompanyId() ?? payment.id,
              business_party_id: payment.party_id!,
              direction: payment.type === 'PAYMENT' || payment.type === 'EXPENSE' ? 'PRACTICADA' : 'SUFRIDA',
              payment_id: payment.id,
              tax_type: wh.tax_type,
              jurisdiction_id: wh.jurisdiction_id ?? null,
              withholding_concept_id: wh.withholding_concept_id ?? null,
              tax_rule_id: wh.tax_rule_id ?? null,
              base_amount: wh.base_amount,
              rate: wh.rate ?? null,
              withheld_amount: wh.withheld_amount,
              automatic_amount: wh.withheld_amount,
              currency_code: payment.currency_code,
              exchange_rate: payment.exchange_rate,
              certificate_number: wh.certificate_number ?? null,
              certificate_date: wh.certificate_date ? new Date(wh.certificate_date) : null,
              status: 'CALCULATED',
              date: payment.date,
              observations: wh.observations ?? null,
              created_by: userId,
              ...(wh.allocations?.length
                ? {
                    allocations: {
                      create: wh.allocations.map((al) => ({
                        document_id: al.document_id,
                        allocated_amount: al.allocated_amount,
                        created_by: userId,
                      })),
                    },
                  }
                : {}),
            },
          });
        }
      }

      // Store bank charges (gastos y retenciones bancarias) — detail until confirm
      if (dto.bank_charges && dto.bank_charges.length > 0) {
        const hasBankTransfer = isMixedPayment
          ? dto.tenders!.some((tender) => tender.method === 'BANK_TRANSFER')
          : dto.payment_method === 'BANK_TRANSFER';
        if (!hasBankTransfer) {
          throw new BadRequestException(
            'Los gastos bancarios solo aplican a pagos o cobros por transferencia bancaria',
          );
        }
        for (const charge of dto.bank_charges) {
          const concept = await this.prisma.bank_concepts.findFirst({
            where: { id: charge.bank_concept_id, deleted_at: null },
          });
          if (!concept) throw new NotFoundException('Concepto bancario no encontrado');
          if (!concept.is_active) throw new BadRequestException('El concepto bancario está inactivo');
          if (!concept.available_payments) {
            throw new BadRequestException(`El concepto "${concept.name}" no está disponible para pagos`);
          }
          const computed = this.bankMovements.prepareCharge(concept, {
            baseAmount: charge.base_amount,
            percentage: charge.percentage,
            taxAmount: charge.tax_amount,
            totalAmount: charge.total_amount,
            nature: (charge.nature as any) ?? null,
          });
          await this.prisma.payment_bank_charges.create({
            data: {
              payment_id: payment.id,
              bank_concept_id: concept.id,
              concept_code_snapshot: concept.code,
              concept_name_snapshot: concept.name,
              nature: computed.nature,
              base_amount: computed.baseAmount,
              percentage_applied: computed.percentage,
              tax_amount: computed.taxAmount,
              total_amount: computed.totalAmount,
              affects_balance: concept.affects_balance,
              jurisdiction: charge.retention?.jurisdiction ?? null,
              tax_code: charge.retention?.tax_code ?? null,
              certificate_number: charge.retention?.certificate_number ?? null,
              period: charge.retention?.period ?? null,
              reference: charge.reference ?? null,
              created_by: userId,
            },
          });
        }
      }

      for (const alloc of checkAllocations) {
        await this.prisma.checks.update({
          where: { id: alloc.check_id },
          data: { payment_id: payment.id, updated_at: new Date(), updated_by: userId },
        });
        await this.prisma.payment_checks.upsert({
          where: { payment_id_check_id: { payment_id: payment.id, check_id: alloc.check_id } },
          update: { amount_applied: alloc.amount_applied },
          create: {
            payment_id: payment.id,
            check_id: alloc.check_id,
            amount_applied: alloc.amount_applied,
            created_by: userId,
          },
        });
      }

      return payment;
    } catch (error) {
      console.error('[payments] create ERROR:', error);
      throw error;
    }
  }

  // ═══════════════════════════════════════════
  // CONFIRM (apply side effects)
  // ═══════════════════════════════════════════

  async confirm(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden confirmar pagos en borrador');
    }
    if (payment.withholding_remittance_id) {
      const remittance = await this.prisma.withholding_remittances.findFirst({ where: { id: payment.withholding_remittance_id, deleted_at: null } })
      if (!remittance || remittance.status !== 'REGISTERED' || Math.abs(Number(remittance.vep_amount) - Number(payment.amount)) > 0.01 || remittance.currency_code.toUpperCase() !== payment.currency_code.toUpperCase()) {
        throw new BadRequestException('El VEP ya no está disponible o los datos del pago no coinciden')
      }
    }

    const mixedTenders = payment.payment_method === 'MIXED' ? (payment.tenders ?? []) : [];
    const hasCheckTender = payment.payment_method === 'CHECK' || mixedTenders.some((tender: any) => tender.method === 'CHECK');
    const checkCount = hasCheckTender ? await this.prisma.payment_checks.count({ where: { payment_id: id } }) : 0;
    if (payment.payment_method === 'MIXED') {
      this.validateMixedTenders(mixedTenders, Number(payment.amount), checkCount > 0);
    } else {
      this.validatePaymentInstrument(payment.payment_method, {
        cashBoxId: payment.cash_box_id,
        bankAccountId: payment.bank_account_id,
        hasChecks: checkCount > 0,
        creditCardId: payment.credit_card_transactions?.[0]?.credit_card_id,
      });
    }

    // Validate documents if present
    const paymentDocs = await this.prisma.payment_documents.findMany({
      where: { payment_id: id, deleted_at: null },
    });
    const paymentObligations = await this.prisma.treasury_obligations.findMany({
      where: { payment_id: id, deleted_at: null },
    });

    // Load withholdings for validation + confirmation
    const withholdings = await this.prisma.withholdings.findMany({
      where: { payment_id: id, deleted_at: null },
    });
    const withheldTotal = withholdings.reduce((s, w) => s + w.withheld_amount.toNumber(), 0);

    if (withholdings.length > 0 && !payment.party_id) {
      throw new BadRequestException('party_id es requerido cuando se registran retenciones');
    }

    if (paymentDocs.length > 0) {
      if (!payment.party_id) {
        throw new BadRequestException('party_id es requerido cuando se aplican documentos');
      }

      for (const pd of paymentDocs) {
        const document = await this.prisma.documents.findUnique({
          where: { id: pd.document_id },
          include: { document_types: { select: { category: true } } },
        });
        if (!document) {
          throw new NotFoundException(`Documento ${pd.document_id} no encontrado`);
        }
        const pending = document.total.toNumber() - document.paid_amount.toNumber();
        if (pending <= 0) {
          throw new BadRequestException(`El documento ${document.number} ya está saldado`);
        }
        // Convertir pending a la moneda de pago si es cross-currency
        const docCurrency = document.currency_code?.toUpperCase();
        const payCurrency = payment.currency_code?.toUpperCase();
        if (document.document_types?.category === 'VALE' && docCurrency !== payCurrency) {
          throw new BadRequestException(`El pago del Vale #${document.descrip?.match(/Vale #(\d+)/)?.[1] ?? document.number} debe registrarse en ${docCurrency}`);
        }
        let pendingInPayCurrency = pending;
        if (docCurrency !== payCurrency && document.exchange_rate) {
          pendingInPayCurrency = Number((pending * Number(document.exchange_rate)).toFixed(2));
        }
        if (pd.amount_applied.toNumber() > pendingInPayCurrency + 0.01) {
          throw new BadRequestException(
            `El monto aplicado (${pd.amount_applied}) excede el saldo pendiente (${pendingInPayCurrency} ${payCurrency}) del documento ${document.number}`,
          );
        }
      }

      const linkedDocs = await this.prisma.documents.findMany({
        where: { id: { in: paymentDocs.map((pd) => pd.document_id) } },
        select: { id: true, commercial_operation_id: true },
      });
      const applicationsByOperation = new Map<string, number>();
      for (const pd of paymentDocs) {
        const operationId = linkedDocs.find((doc) => doc.id === pd.document_id)?.commercial_operation_id;
        if (!operationId) continue;
        applicationsByOperation.set(
          operationId,
          (applicationsByOperation.get(operationId) ?? 0) + pd.amount_applied.toNumber(),
        );
      }
      for (const [operationId, newAmount] of applicationsByOperation) {
        const operation = await this.commercialFlow.refresh(operationId);
        if (operation && Number(operation.paid_total) + newAmount > Number(operation.ordered_total) + 0.01) {
          throw new BadRequestException('El monto aplicado excede el saldo pendiente de la operación comercial');
        }
      }
    }

    // Validación: dinero efectivo + retenciones >= importe aplicado a documentos
    if (paymentDocs.length > 0 && (withholdings.length > 0 || payment.payment_method === 'MIXED')) {
      const appliedTotal = paymentDocs.reduce((s, pd) => s + pd.amount_applied.toNumber(), 0);
      const cashTotal = payment.amount.toNumber();
      if (appliedTotal > cashTotal + withheldTotal + 0.01) {
        throw new BadRequestException(
          `El importe aplicado (${appliedTotal.toFixed(2)}) excede el dinero efectivo (${cashTotal.toFixed(2)}) más retenciones (${withheldTotal.toFixed(2)})`,
        );
      }
    }

    // Validación: los cheques vinculados deben cubrir lo aplicado a documentos
    if (hasCheckTender) {
      const allocations = await this.prisma.payment_checks.findMany({
        where: { payment_id: payment.id },
      });
      if (allocations.length > 0) {
        const checksTotal = allocations.reduce((s, a) => s + a.amount_applied.toNumber(), 0);
        const checkTender = mixedTenders.find((tender: any) => tender.method === 'CHECK');
        if (checkTender && Math.abs(Math.round(checksTotal * 100) / 100 - Math.round(Number(checkTender.amount) * 100) / 100) > 0.01) {
          throw new BadRequestException('El importe del medio cheque no coincide con los cheques vinculados');
        }
        const appliedDocsTotal = paymentDocs.reduce((s, pd) => s + pd.amount_applied.toNumber(), 0);
        if (!checkTender && appliedDocsTotal > checksTotal + withheldTotal + 0.01) {
          throw new BadRequestException(
            `Los cheques vinculados (${checksTotal.toFixed(2)}) no cubren el importe aplicado a documentos (${appliedDocsTotal.toFixed(2)})`,
          );
        }
      }
    }

    // Determine current account entry type:
    // ADVANCE without docs → NO current account entry (pendiente de factura)
    // Otherwise → PAYMENT/COLLECTION/EXPENSE (como siempre)
    const isAdvanceNoDocs = payment.payment_mode === 'ADVANCE' && paymentDocs.length === 0;
    const isDirectObligationPayment = paymentObligations.length > 0 && paymentDocs.length === 0;

    const confirmed = await this.prisma.$transaction(async (tx) => {
      // Apply to documents
      for (const pd of paymentDocs) {
        await tx.documents.update({
          where: { id: pd.document_id },
          data: {
            paid_amount: { increment: pd.amount_applied.toNumber() },
            updated_at: new Date(),
            updated_by: userId,
          },
        });

        // If document is a VALE, mark the hr_vale as PAID
        const doc = await tx.documents.findUnique({
          where: { id: pd.document_id },
          include: { document_types: { select: { category: true } } },
        });
        if (doc?.document_types?.category === 'VALE' && payment.party_id) {
          // Extract vale number from description "Vale #N"
          const match = doc.descrip?.match(/Vale #(\d+)/);
          if (match) {
            const valeNumber = parseInt(match[1], 10);
            const vale = await tx.hr_vales.findFirst({
              where: { party_id: payment.party_id, number: valeNumber, deleted_at: null, OR: [{ party_type: 'EMPLOYEE' }, { party_type: 'PARTNER', type: { in: ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'] } }] },
            });
            if (vale) {
              await this.applyHrValePayment(tx, vale, doc, pd.amount_applied.toNumber(), payment, userId);
              const fullyPaid = Number(doc.paid_amount) >= Number(doc.total) - 0.01;
              await tx.hr_vales.update({
                where: { id: vale.id },
                data: {
                  status: fullyPaid ? 'PAID' : 'CONFIRMED',
                  paid_at: fullyPaid ? new Date() : null,
                  updated_at: new Date(),
                  updated_by: userId,
                },
              });
            }
          }
        }
      }

      if (payment.payment_method === 'MIXED') {
        const convertedAmounts = this.mixedTenderConvertedAmounts(payment, mixedTenders);
        for (let index = 0; index < mixedTenders.length; index += 1) {
          const tender = mixedTenders[index];
          const tenderPayment = this.tenderMovementPayment(payment, tender, convertedAmounts[index]);
          if (tender.method === 'CASH') {
            await this.createCashBoxMovement(tenderPayment, userId, tx);
          } else if (tender.method === 'BANK_TRANSFER') {
            const bankOperation = await this.createBankMovement(tenderPayment, userId, tx);
            if (bankOperation) await this.createBankCharges(tenderPayment, bankOperation, userId, tx);
          }
        }
      } else {
        // Create cash box movement
        if (payment.cash_box_id) {
          await this.createCashBoxMovement(payment, userId, tx);
        }

        // Create bank account movement (for non-check payments)
        if (payment.bank_account_id && payment.payment_method !== 'CHECK') {
          const bankOperation = await this.createBankMovement(payment, userId, tx);
          if (bankOperation) {
            await this.createBankCharges(payment, bankOperation, userId, tx);
          }
        }
      }

      // Process linked checks once, whether they are the only method or one
      // component of a mixed payment.
      if (hasCheckTender) {
        await this.processLinkedChecks(payment, userId, tx);
      }

      // Update current account — NOT for advance without documents
      // (the advance impacts CC only when applied to an invoice)
      if (payment.party_id && !isAdvanceNoDocs && !isDirectObligationPayment) {
        await this.createCurrentAccountEntry(payment, userId, tx, payment.type);
      }

      if (payment.payment_method === 'PAYROLL_DEDUCTION') {
        await this.createPayrollDeductionEntry(payment, userId, tx);
      }

      // Retenciones: entrada de cuenta corriente + marcar APPLIED
      if (withholdings.length > 0 && payment.party_id && !isAdvanceNoDocs) {
        for (const wh of withholdings) {
          await this.currentAccountsService.addEntry(
            {
              party_id: payment.party_id,
              party_type: payment.party_type ?? 'SUPPLIER',
              currency_code: wh.currency_code,
              type: 'WITHHOLDING',
              amount: wh.withheld_amount.toNumber(),
              exchange_rate: wh.exchange_rate ? Number(wh.exchange_rate) : undefined,
              rate_type: payment.rate_type ?? undefined,
              description: `Retención ${wh.tax_type}${wh.certificate_number ? ` (cert. ${wh.certificate_number})` : ''} - Pago #${payment.number}`,
              reference_type: 'withholding',
              reference_id: wh.id,
              payment_id: payment.id,
              date: payment.date instanceof Date ? payment.date.toISOString().split('T')[0] : payment.date,
            },
            userId,
            tx,
          );
        }
        await tx.withholdings.updateMany({
          where: { payment_id: id, deleted_at: null },
          data: { status: 'APPLIED', updated_at: new Date(), updated_by: userId },
        });
      }

      // Update status
      if (payment.withholding_remittance_id) {
        const updated = await tx.withholding_remittances.updateMany({
          where: { id: payment.withholding_remittance_id, status: 'REGISTERED', deleted_at: null },
          data: { status: 'PAID', paid_at: payment.date, updated_by: userId },
        })
        if (updated.count !== 1) throw new BadRequestException('El VEP fue pagado por otro movimiento o dejó de estar disponible')
      }
      if (payment.payment_method === 'CREDIT_CARD') {
        await this.creditCardsService.registerConfirmedPurchaseStatements(id, userId, tx);
      }
      return tx.payments.update({
        where: { id },
        data: {
          status: 'CONFIRMED',
          confirmed_at: new Date(),
          confirmed_by: userId,
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }, { timeout: 15_000 });

    const operationIds = [
      ...new Set(
        (
          await this.prisma.documents.findMany({
            where: { id: { in: paymentDocs.map((pd) => pd.document_id) }, commercial_operation_id: { not: null } },
            select: { commercial_operation_id: true },
          })
        )
          .map((doc) => doc.commercial_operation_id)
          .filter(Boolean),
      ),
    ] as string[];

    for (const operationId of operationIds) {
      const operation = await this.commercialFlow.refresh(operationId);
      if (
        operation?.delivery_status === 'ELIGIBLE' &&
        operation.auto_create_delivery_note &&
        !operation.delivery_note_id
      ) {
        const remito = await this.documentsSales.deliver(operation.root_document_id, userId);
        await this.prisma.commercial_operations.update({
          where: { id: operation.id },
          data: { delivery_note_id: remito.id, delivery_status: 'DRAFT_CREATED', updated_by: userId },
        });
      }
    }

    await this.prisma.treasury_obligations.updateMany({
      where: { payment_id: id, deleted_at: null },
      data: { status: 'PAID', paid_at: payment.date, updated_at: new Date(), updated_by: userId },
    });
    if (paymentDocs.length) {
      await this.prisma.treasury_obligations.updateMany({
        where: { document_id: { in: paymentDocs.map((item) => item.document_id) }, deleted_at: null },
        data: { payment_id: id, status: 'PAID', paid_at: payment.date, updated_at: new Date(), updated_by: userId },
      });
    }

    return confirmed;
  }

  // ═══════════════════════════════════════════
  // MARK AS PAID (check received/cashed)
  // ═══════════════════════════════════════════

  async markAsPaid(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'CONFIRMED') {
      throw new BadRequestException('Solo se pueden marcar como pagados pagos confirmados');
    }

    const paid = await this.prisma.payments.update({
      where: { id },
      data: {
        status: 'PAID',
        payment_date: new Date(),
        updated_at: new Date(),
        updated_by: userId,
      },
    });
    await this.prisma.treasury_obligations.updateMany({
      where: { payment_id: id, deleted_at: null },
      data: { status: 'PAID', paid_at: new Date(), updated_at: new Date(), updated_by: userId },
    });
    return paid;
  }

  // ═══════════════════════════════════════════
  // REJECT (reverse side effects)
  // ═══════════════════════════════════════════

  async reject(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'CONFIRMED') {
      throw new BadRequestException('Solo se pueden rechazar pagos confirmados');
    }

    await this.reverseSideEffects(payment, userId, 'payment_rejection');
    await this.prisma.treasury_obligations.updateMany({
      where: { payment_id: id, deleted_at: null },
      data: { payment_id: null, status: 'READY', paid_at: null, updated_at: new Date(), updated_by: userId },
    });

    const rejected = await this.prisma.payments.update({
      where: { id },
      data: {
        status: 'REVERSED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
    if (payment.withholding_remittance_id) await this.prisma.withholding_remittances.updateMany({ where: { id: payment.withholding_remittance_id, status: 'PAID' }, data: { status: 'REGISTERED', paid_at: null, updated_by: userId } })
    await this.refreshPaymentOperations(id);
    return rejected;
  }

  // ═══════════════════════════════════════════
  // REVERSE (cancel confirmed payment)
  // ═══════════════════════════════════════════

  async reverse(id: string, userId: string, checkAction: 'RETURN_TO_PORTFOLIO' | 'CANCEL' = 'RETURN_TO_PORTFOLIO') {
    const payment = await this.findOne(id);
    if (payment.status === 'DRAFT') {
      throw new BadRequestException('No se puede anular un pago en borrador. Use eliminar.');
    }
    if (payment.status === 'CANCELLED') {
      throw new BadRequestException('El pago ya está anulado');
    }

    const cardTransactions = payment.credit_card_transactions ?? [];
    for (const transaction of cardTransactions) {
      if (transaction.clearing_status === 'CLEARED') {
        throw new BadRequestException(
          'La operación de tarjeta ya impactó en banco y debe revertirse primero desde su liquidación',
        );
      }
      await this.creditCardsService.assertPurchaseCanBeReversed(transaction.id);
    }

    await this.reverseSideEffects(payment, userId, 'payment_reversal', checkAction);
    await this.prisma.treasury_obligations.updateMany({
      where: { payment_id: id, deleted_at: null },
      data: { payment_id: null, status: 'READY', paid_at: null, updated_at: new Date(), updated_by: userId },
    });
    for (const transaction of cardTransactions) {
      await this.prisma.credit_card_installments.updateMany({
        where: { transaction_id: transaction.id, deleted_at: null },
        data: { deleted_at: new Date(), deleted_by: userId, updated_at: new Date(), updated_by: userId },
      });
      await this.creditCardsService.removePurchaseFromStatements(transaction.id, userId);
      await this.prisma.credit_card_transactions.update({
        where: { id: transaction.id },
        data: { clearing_status: 'FAILED', updated_by: userId },
      });
    }

    const reversed = await this.prisma.payments.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
    if (payment.withholding_remittance_id) await this.prisma.withholding_remittances.updateMany({ where: { id: payment.withholding_remittance_id, status: 'PAID' }, data: { status: 'REGISTERED', paid_at: null, updated_by: userId } })
    await this.refreshPaymentOperations(id);
    return reversed;
  }

  // ═══════════════════════════════════════════
  // FIND ALL / ONE
  // ═══════════════════════════════════════════

  async findAll(filters?: {
    party_id?: string;
    type?: string;
    payment_method?: string;
    status?: string;
    account_id?: string;
    user_id?: string;
  }) {
    const where: Record<string, any> = { deleted_at: null };
    if (filters?.party_id) where.party_id = filters.party_id;
    if (filters?.type) where.type = filters.type;
    if (filters?.payment_method) where.payment_method = filters.payment_method;
    if (filters?.status) where.status = filters.status;
    if (filters?.account_id) where.account_id = filters.account_id;
    if (filters?.user_id) where.created_by = filters.user_id;

    const payments = await this.prisma.payments.findMany({
      where,
      orderBy: { number: 'desc' },
      include: {
        party: { select: { id: true, name: true } },
        account: { select: { id: true, code: true, name: true, account_type: true } },
        documents: {
          where: { deleted_at: null },
          select: {
            id: true,
            payment_id: true,
            document_id: true,
            amount_applied: true,
            document: {
              select: {
                id: true,
                number: true,
                date: true,
                total: true,
                currency_code: true,
                document_types: {
                  select: {
                    code: true,
                    description: true,
                    system_modules: { select: { code: true } },
                  },
                },
              },
            },
          },
        },
        withholdings: {
          where: { deleted_at: null },
          include: { jurisdiction: { select: { id: true, name: true } } },
        },
      },
    });

    const paymentIds = payments.map((payment) => payment.id);
    const partnerValeTypeFilter = filters?.type === 'PAYMENT'
      ? { in: ['RETIRO', 'REEMBOLSO', 'PRESTAMO'] }
      : filters?.type === 'COLLECTION'
        ? { in: ['APORTE'] }
        : { in: ['APORTE', 'RETIRO', 'REEMBOLSO', 'PRESTAMO'] };
    const includePartnerVales = (!filters?.type || ['PAYMENT', 'COLLECTION'].includes(filters.type))
      && (!filters?.status || ['PAID', 'CANCELLED'].includes(filters.status))
      && (!filters?.payment_method || ['CASH', 'BANK_TRANSFER'].includes(filters.payment_method));
    const partnerVales = !includePartnerVales
      ? []
      : await this.prisma.hr_vales.findMany({
          where: {
            party_type: 'PARTNER',
            ...(partnerValeTypeFilter ? { type: partnerValeTypeFilter } : {}),
            ...(filters?.party_id ? { party_id: filters.party_id } : {}),
            ...(filters?.user_id ? { created_by: filters.user_id } : {}),
            ...(filters?.status ? { status: filters.status } : { status: { in: ['PAID', 'CANCELLED'] } }),
            OR: [
              { status: 'PAID', deleted_at: null },
              { status: 'CANCELLED' },
            ],
          },
          orderBy: [{ date: 'desc' }, { created_at: 'desc' }],
          select: {
            id: true,
            number: true,
            party_id: true,
            type: true,
            amount: true,
            currency_code: true,
            exchange_rate: true,
            rate_type: true,
            converted_amount: true,
            status: true,
            description: true,
            date: true,
            created_by: true,
            party: { select: { id: true, name: true } },
          },
        });
    const valeIds = partnerVales.map((vale) => vale.id);
    let valeCashMovements: any[] = [];
    let valeBankMovements: any[] = [];
    if (valeIds.length) {
      [valeCashMovements, valeBankMovements] = await Promise.all([
          this.prisma.cash_box_movements.findMany({
            where: { reference_type: 'hr_vale', reference_id: { in: valeIds }, deleted_at: null },
            select: {
              reference_id: true,
              type: true,
              date: true,
              created_at: true,
              created_by: true,
              description: true,
              cash_box_id: true,
              cash_box: { select: { id: true, name: true, type: true, currency_code: true } },
            },
          }),
          this.prisma.bank_account_movements.findMany({
            where: { reference_type: 'hr_vale', reference_id: { in: valeIds }, deleted_at: null },
            select: {
              reference_id: true,
              type: true,
              date: true,
              created_at: true,
              created_by: true,
              description: true,
              bank_account_id: true,
              bank_account: { select: { id: true, name: true, bank_name: true, account_number: true, cbu: true, alias: true, currency_code: true } },
            },
          }),
      ]);
    }
    const cashMovementByVale = new Map(valeCashMovements.map((movement) => [movement.reference_id, movement]));
    const bankMovementByVale = new Map(valeBankMovements.map((movement) => [movement.reference_id, movement]));
    const partnerValePayments = partnerVales.flatMap((vale) => {
      const cashMovement = cashMovementByVale.get(vale.id);
      const bankMovement = bankMovementByVale.get(vale.id);
      const movement = cashMovement ?? bankMovement;
      if (!movement) return [];
      if (filters?.payment_method === 'CASH' && !cashMovement) return [];
      if (filters?.payment_method && filters.payment_method !== 'CASH' && filters.payment_method !== 'BANK_TRANSFER') return [];
      if (filters?.payment_method === 'BANK_TRANSFER' && !bankMovement) return [];
      return [{
        id: vale.id,
        number: vale.number,
        type: movement.type,
        date: movement.date,
        party_id: vale.party_id,
        party_type: 'PARTNER',
        party: vale.party,
        payment_method: cashMovement ? 'CASH' : 'BANK_TRANSFER',
        amount: vale.amount,
        currency_code: vale.currency_code,
        exchange_rate: vale.exchange_rate,
        rate_type: vale.rate_type,
        converted_amount: vale.converted_amount,
        description: movement.description ?? `Vale #${vale.number} · ${vale.type}`,
        reference: `Vale #${vale.number}`,
        cash_box_id: cashMovement?.cash_box_id ?? null,
        cash_box: cashMovement?.cash_box ?? null,
        bank_account_id: bankMovement?.bank_account_id ?? null,
        bank_account: bankMovement?.bank_account ?? null,
        status: vale.status === 'CANCELLED' ? 'CANCELLED' : 'PAID',
        payment_mode: 'NORMAL',
        created_at: movement.created_at,
        created_by: movement.created_by ?? vale.created_by,
        source_kind: 'PARTNER_VALE' as const,
        source_id: vale.id,
        source_description: vale.description,
        documents: [],
        obligations: [],
      }];
    });
    const creatorIds = [...new Set(payments.map((p) => p.created_by).filter(Boolean))] as string[];
    const [users, obligations] = await Promise.all([
      creatorIds.length
        ? this.db.getDefaultClient().users.findMany({
            where: { id: { in: creatorIds } },
            select: { id: true, name: true, email: true },
          })
        : Promise.resolve([]),
      paymentIds.length
        ? this.prisma.treasury_obligations.findMany({
            where: { payment_id: { in: paymentIds }, deleted_at: null },
            orderBy: [{ due_date: 'asc' }, { id: 'asc' }],
            select: {
              id: true,
              payment_id: true,
              period_key: true,
              description: true,
              amount: true,
              estimated_amount: true,
              currency_code: true,
              due_date: true,
              reference: true,
            },
          })
        : Promise.resolve([]),
    ]);
    const userMap = Object.fromEntries(users.map((user) => [user.id, { name: user.name, email: user.email }]));
    const obligationsByPayment = new Map<string, typeof obligations>();
    for (const obligation of obligations) {
      if (!obligation.payment_id) continue;
      const existing = obligationsByPayment.get(obligation.payment_id) ?? [];
      existing.push(obligation);
      obligationsByPayment.set(obligation.payment_id, existing);
    }

    const paymentRows = payments.map((p) => ({
      ...p,
      creator: p.created_by ? (userMap[p.created_by] ?? null) : null,
      obligations: obligationsByPayment.get(p.id) ?? [],
    }));
    return [...paymentRows, ...partnerValePayments]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async findOne(id: string) {
    const payment = await this.prisma.payments.findFirst({
      where: { id, deleted_at: null },
      include: {
        party: { select: { id: true, name: true } },
        bank_account: {
          select: {
            id: true,
            name: true,
            bank_name: true,
            account_number: true,
            cbu: true,
            alias: true,
            currency_code: true,
          },
        },
        cash_box: { select: { id: true, name: true, type: true, currency_code: true } },
        account: { select: { id: true, code: true, name: true, account_type: true } },
        payment_allocations: {
          include: {
            check: {
              select: {
                id: true,
                check_number: true,
                bank_name: true,
                issuer_name: true,
                amount: true,
                currency_code: true,
                due_date: true,
                is_own: true,
              },
            },
          },
        },
        tenders: {
          where: { deleted_at: null },
          orderBy: { created_at: 'asc' },
          include: {
            cash_box: { select: { id: true, name: true, type: true, currency_code: true } },
            bank_account: {
              select: { id: true, name: true, bank_name: true, account_number: true, currency_code: true },
            },
          },
        },
        documents: {
          include: {
            document: {
              select: {
                id: true,
                number: true,
                total: true,
                paid_amount: true,
                party_id: true,
                date: true,
                currency_code: true,
                business_parties: { select: { id: true, name: true } },
                document_types: { select: { id: true, code: true, description: true, category: true } },
              },
            },
          },
        },
        withholdings: {
          where: { deleted_at: null },
          include: {
            jurisdiction: { select: { id: true, name: true } },
            allocations: {
              include: { document: { select: { id: true, number: true } } },
            },
          },
        },
        credit_card_transactions: {
          where: { deleted_at: null },
          include: {
            credit_card: true,
            installments: { where: { deleted_at: null }, orderBy: { installment_number: 'asc' } },
          },
        },
      },
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    const obligations = await this.prisma.treasury_obligations.findMany({
      where: { payment_id: id, deleted_at: null },
      orderBy: { due_date: 'asc' },
    });
    return { ...payment, obligations };
  }

  // ═══════════════════════════════════════════
  // UPDATE (only DRAFT)
  // ═══════════════════════════════════════════

  async update(id: string, dto: UpdatePaymentDto, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden editar pagos en borrador');
    }
    if (dto.installments_total != null && (!Number.isInteger(dto.installments_total) || dto.installments_total < 1 || dto.installments_total > 48)) {
      throw new BadRequestException('La cantidad de cuotas debe ser un número entero entre 1 y 48');
    }
    if (dto.withholdings?.length && !(dto.party_id ?? payment.party_id)) {
      throw new BadRequestException('party_id es requerido cuando se registran retenciones');
    }
    if (dto.obligations?.length && payment.type !== 'PAYMENT') {
      throw new BadRequestException('Los servicios e impuestos pendientes solo pueden asociarse a un pago');
    }

    const effectiveMethod = dto.payment_method ?? payment.payment_method;
    const effectiveTenders = dto.tenders ?? payment.tenders ?? [];
    if (effectiveMethod === 'MIXED') {
      if (payment.withholding_remittance_id) {
        throw new BadRequestException('Un VEP debe registrarse como un pago bancario independiente');
      }
      const activeBankCharges = await this.prisma.payment_bank_charges.count({
        where: { payment_id: id, deleted_at: null },
      });
      if (activeBankCharges > 0) {
        throw new BadRequestException('Quitá los gastos bancarios detallados antes de combinar medios de pago');
      }
    }
    const currentCheckIds = (payment.payment_allocations ?? []).map((allocation: any) => allocation.check_id);
    const effectiveCheckIds = dto.checks
      ? dto.checks.map((check) => check.check_id)
      : dto.check_ids ?? currentCheckIds;
    if (effectiveMethod === 'MIXED') {
      this.validateMixedTenders(effectiveTenders, Number(dto.amount ?? payment.amount), effectiveCheckIds.length > 0);
      const checkTender = effectiveTenders.find((tender: any) => tender.method === 'CHECK');
      if (checkTender && dto.checks) {
        const requestedCheckAmount = dto.checks.reduce((sum, check) => sum + Number(check.amount_applied), 0);
        if (Math.abs(Math.round(requestedCheckAmount * 100) / 100 - Math.round(Number(checkTender.amount) * 100) / 100) > 0.01) {
          throw new BadRequestException('El importe del medio cheque debe coincidir con los cheques seleccionados');
        }
      }
    } else {
      if (dto.tenders?.length) throw new BadRequestException('Los medios detallados solo se usan en pagos mixtos');
      const checkCount = effectiveMethod === 'CHECK' ? effectiveCheckIds.length : 0;
      this.validatePaymentInstrument(effectiveMethod, {
        cashBoxId: dto.cash_box_id ?? payment.cash_box_id,
        bankAccountId: dto.bank_account_id ?? payment.bank_account_id,
        hasChecks: checkCount > 0,
        creditCardId: dto.credit_card_id ?? payment.credit_card_transactions?.[0]?.credit_card_id,
      });
    }

    const data: Record<string, any> = {
      updated_at: new Date(),
      updated_by: userId,
    };

    if (dto.date) data.date = parseLocalDateTime(dto.date);
    if (dto.party_id) data.party_id = dto.party_id;
    if (dto.party_type) data.party_type = dto.party_type;
    if (dto.payment_method) data.payment_method = dto.payment_method;
    if (dto.amount !== undefined) data.amount = dto.amount;
    if (dto.currency_code) data.currency_code = dto.currency_code;
    if (dto.exchange_rate) data.exchange_rate = dto.exchange_rate;
    if (dto.rate_type) data.rate_type = dto.rate_type;
    if (dto.converted_amount) data.converted_amount = dto.converted_amount;
    if (dto.exchange_note) data.exchange_note = dto.exchange_note;
    if (dto.description) data.description = dto.description;
    if (dto.reference) data.reference = dto.reference;
    if (effectiveMethod === 'MIXED') {
      data.bank_account_id = null;
      data.cash_box_id = null;
      data.amount = dto.amount ?? payment.amount;
    } else {
      if (dto.bank_account_id) data.bank_account_id = dto.bank_account_id;
      if (dto.cash_box_id) data.cash_box_id = dto.cash_box_id;
    }
    if (dto.account_id !== undefined) data.account_id = dto.account_id || null;
    if (dto.payment_mode) data.payment_mode = dto.payment_mode;

    const updated = await this.prisma.$transaction(async (tx) => {
      const paymentUpdate = await tx.payments.update({
        where: { id },
        data,
      });

      if (dto.tenders !== undefined) {
        await tx.payment_tenders.deleteMany({ where: { payment_id: id } });
        if (dto.tenders.length) {
          await tx.payment_tenders.createMany({
            data: dto.tenders.map((tender) => ({
              payment_id: id,
              method: tender.method as any,
              amount: tender.amount,
              cash_box_id: tender.cash_box_id ?? null,
              bank_account_id: tender.bank_account_id ?? null,
              created_by: userId,
            })),
          });
        }
      }

      if (dto.checks !== undefined || dto.check_ids !== undefined) {
        const requestedChecks = dto.checks ?? (dto.check_ids ?? []).map((check_id) => ({ check_id, amount_applied: 0 }));
        const requestedIds = new Set(requestedChecks.map((check) => check.check_id));
        const existingAllocations = await tx.payment_checks.findMany({
          where: { payment_id: id },
          include: { check: { select: { amount: true, available_amount: true } } },
        });

        for (const allocation of existingAllocations) {
          if (requestedIds.has(allocation.check_id)) continue;
          await tx.checks.updateMany({
            where: { id: allocation.check_id, payment_id: id },
            data: {
              payment_id: null,
              status: 'PENDING',
              available_amount: allocation.amount_applied,
              updated_at: new Date(),
              updated_by: userId,
            },
          });
          await tx.payment_checks.delete({
            where: { payment_id_check_id: { payment_id: id, check_id: allocation.check_id } },
          });
        }

        for (const requested of requestedChecks) {
          const check = await tx.checks.findFirst({ where: { id: requested.check_id, deleted_at: null } });
          if (!check) throw new NotFoundException(`Cheque ${requested.check_id} no encontrado`);
          if (check.payment_id && check.payment_id !== id) {
            throw new BadRequestException(`El cheque #${check.check_number} ya está vinculado a otro pago`);
          }
          const available = check.available_amount != null ? Number(check.available_amount) : Number(check.amount);
          if (requested.amount_applied > 0 && requested.amount_applied > available + 0.01) {
            throw new BadRequestException(`El cheque #${check.check_number} no tiene saldo suficiente`);
          }
          const amountApplied = available;
          await tx.checks.update({
            where: { id: check.id },
            data: { payment_id: id, updated_at: new Date(), updated_by: userId },
          });
          await tx.payment_checks.upsert({
            where: { payment_id_check_id: { payment_id: id, check_id: check.id } },
            update: { amount_applied: amountApplied },
            create: { payment_id: id, check_id: check.id, amount_applied: amountApplied, created_by: userId },
          });
        }
      }

      if (dto.documents !== undefined) {
        const requestedByDocument = new Map(
          dto.documents.map((document) => [document.document_id, document.amount_applied] as [string, number]),
        );
        const requestedIds = [...requestedByDocument.keys()];
        const now = new Date();

        await tx.payment_documents.updateMany({
          where: {
            payment_id: id,
            deleted_at: null,
            ...(requestedIds.length ? { document_id: { notIn: requestedIds } } : {}),
          },
          data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
        });

        for (const [documentId, amountApplied] of requestedByDocument) {
          await tx.payment_documents.upsert({
            where: { payment_id_document_id: { payment_id: id, document_id: documentId } },
            update: {
              amount_applied: amountApplied,
              deleted_at: null,
              deleted_by: null,
              updated_at: now,
              updated_by: userId,
            },
            create: {
              payment_id: id,
              document_id: documentId,
              amount_applied: amountApplied,
              created_by: userId,
            },
          });
        }
      }

      if (dto.withholdings !== undefined) {
        const now = new Date();
        await tx.withholdings.updateMany({
          where: { payment_id: id, deleted_at: null },
          data: { status: 'CANCELLED', deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
        });

        const partyId = dto.party_id ?? payment.party_id;
        for (const withholding of dto.withholdings) {
          await tx.withholdings.create({
            data: {
              company_id: this.getCompanyId() ?? payment.id,
              business_party_id: partyId!,
              direction: payment.type === 'PAYMENT' || payment.type === 'EXPENSE' ? 'PRACTICADA' : 'SUFRIDA',
              payment_id: payment.id,
              tax_type: withholding.tax_type,
              jurisdiction_id: withholding.jurisdiction_id ?? null,
              withholding_concept_id: withholding.withholding_concept_id ?? null,
              tax_rule_id: withholding.tax_rule_id ?? null,
              base_amount: withholding.base_amount,
              rate: withholding.rate ?? null,
              withheld_amount: withholding.withheld_amount,
              automatic_amount: withholding.withheld_amount,
              currency_code: dto.currency_code ?? payment.currency_code,
              exchange_rate: dto.exchange_rate ?? payment.exchange_rate,
              certificate_number: withholding.certificate_number ?? null,
              certificate_date: withholding.certificate_date ? new Date(withholding.certificate_date) : null,
              status: 'CALCULATED',
              date: dto.date ? parseLocalDateTime(dto.date) : payment.date,
              observations: withholding.observations ?? null,
              created_by: userId,
              ...(withholding.allocations?.length
                ? {
                    allocations: {
                      create: withholding.allocations.map((allocation) => ({
                        document_id: allocation.document_id,
                        allocated_amount: allocation.allocated_amount,
                        created_by: userId,
                      })),
                    },
                  }
                : {}),
            },
          });
        }
      }

      return paymentUpdate;
    });
    if (dto.obligations !== undefined) {
      await this.syncTreasuryObligations(
        id,
        dto.obligations,
        dto.party_id ?? payment.party_id ?? undefined,
        dto.currency_code ?? payment.currency_code,
        userId,
      );
    }
    const existingCardTransaction = payment.credit_card_transactions?.[0];
    if (effectiveMethod === 'CREDIT_CARD') {
      const transaction = existingCardTransaction;
      const cardId = dto.credit_card_id ?? transaction?.credit_card_id;
      if (!cardId) throw new BadRequestException('Seleccioná una tarjeta corporativa o canal de cobro');
      const card = await this.prisma.credit_cards.findFirst({ where: { id: cardId, active: true, deleted_at: null } });
      if (!card) throw new BadRequestException('La tarjeta o canal de cobro no está disponible');
      const expectedType = payment.type === 'COLLECTION' ? 'CUSTOMER' : 'COMPANY';
      if (card.type !== expectedType)
        throw new BadRequestException('La tarjeta seleccionada no corresponde al tipo de operación');
      const amount = Number(dto.amount ?? payment.amount);
      const installments = Math.max(1, dto.installments_total ?? transaction?.installments_total ?? 1);
      const commissionRate = payment.type === 'COLLECTION' ? Number(card.commission_rate ?? 0) : 0;
      const txData: any = {
        credit_card_id: cardId,
        date: dto.date ? parseLocalDateTime(dto.date) : payment.date,
        amount,
        currency_code: dto.currency_code ?? payment.currency_code,
        installments_total: installments,
        installment_amount: Number((amount / installments).toFixed(2)),
        authorization: dto.card_authorization ?? transaction?.authorization,
        description: dto.description ?? payment.description ?? transaction?.description,
        commission_rate: commissionRate || null,
        commission_amount: commissionRate ? Number(((amount * commissionRate) / 100).toFixed(2)) : null,
        net_amount: payment.type === 'COLLECTION' ? Number((amount * (1 - commissionRate / 100)).toFixed(2)) : amount,
        net_currency_code: dto.currency_code ?? payment.currency_code,
        expected_clearing_date: dto.expected_clearing_date
          ? parseLocalDateTime(dto.expected_clearing_date)
          : transaction?.expected_clearing_date,
        clearing_status: 'PENDING',
        actual_clearing_date: null,
        updated_at: new Date(),
        updated_by: userId,
      };
      if (transaction) {
        await this.prisma.credit_card_transactions.update({ where: { id: transaction.id }, data: txData });
      } else {
        await this.prisma.credit_card_transactions.create({
          data: {
            ...txData,
            payment_id: id,
            type: payment.type === 'COLLECTION' ? 'COLLECTION' : 'PURCHASE',
            exchange_rate: dto.exchange_rate ?? payment.exchange_rate,
            rate_type: dto.rate_type ?? payment.rate_type,
            converted_amount: dto.converted_amount ?? payment.converted_amount,
            net_currency_code: dto.currency_code ?? payment.currency_code,
            created_by: userId,
          },
        });
      }
    } else if (existingCardTransaction) {
      const now = new Date();
      await this.prisma.credit_card_installments.updateMany({
        where: { transaction_id: existingCardTransaction.id, deleted_at: null, status: 'PENDING' },
        data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
      });
      await this.prisma.credit_card_transactions.update({
        where: { id: existingCardTransaction.id },
        data: { clearing_status: 'FAILED', updated_at: now, updated_by: userId },
      });
    }
    return this.findOne(updated.id);
  }

  async updateFinalizedFinancialDetails(
    id: string,
    dto: import('./dto/update-payment-financial-details.dto').UpdatePaymentFinancialDetailsDto,
    userId: string,
  ) {
    const payment = await this.findOne(id);
    if (!['CONFIRMED', 'PAID'].includes(payment.status)) {
      throw new BadRequestException('Las retenciones y la cuenta contable solo se pueden ajustar en pagos confirmados o pagados');
    }
    if (!['CASH', 'BANK_TRANSFER'].includes(payment.payment_method)) {
      throw new BadRequestException('Este ajuste está disponible para pagos en efectivo o transferencia bancaria');
    }
    if (payment.payment_mode === 'ADVANCE') {
      throw new BadRequestException('Los anticipos no admiten ajustes posteriores de retenciones');
    }

    if (dto.party_id && payment.type !== 'EXPENSE') {
      throw new BadRequestException('Solo se puede asociar un proveedor o entidad desde el ajuste de un gasto varios');
    }
    if (dto.party_id && payment.party_id && dto.party_id !== payment.party_id) {
      throw new BadRequestException('El proveedor o entidad de un gasto confirmado no se puede reemplazar');
    }
    const assignedParty = dto.party_id && !payment.party_id
      ? await this.prisma.business_parties.findFirst({
          where: { id: dto.party_id, deleted_at: null },
          select: { id: true, type: true, roles: { where: { active: true }, select: { role: true } } },
        })
      : null;
    if (dto.party_id && !payment.party_id && !assignedParty) {
      throw new BadRequestException('El proveedor o entidad seleccionada no existe o está inactiva');
    }
    if (assignedParty && !(['SUPPLIER', 'SERVICE_PROVIDER', 'UTILITY', 'FINANCIAL', 'TAX_AUTHORITY'].includes(assignedParty.type)
      || assignedParty.roles.some((role) => ['SUPPLIER', 'SERVICE_PROVIDER', 'UTILITY', 'FINANCIAL', 'TAX_AUTHORITY'].includes(role.role)))) {
      throw new BadRequestException('Seleccioná un proveedor o una entidad habilitada para registrar retenciones');
    }
    const effectivePartyId = payment.party_id ?? assignedParty?.id ?? null;
    const effectivePartyType = payment.party_type ?? assignedParty?.type ?? null;

    const documents = await this.prisma.payment_documents.findMany({
      where: { payment_id: id, deleted_at: null },
      select: { document_id: true, amount_applied: true },
    });
    if (!documents.length && payment.type !== 'EXPENSE') {
      throw new BadRequestException('El pago debe estar aplicado a documentos; los gastos varios se ajustan sobre su importe original');
    }
    const existing = await this.prisma.withholdings.findMany({
      where: { payment_id: id, deleted_at: null },
      select: { id: true, tax_type: true, jurisdiction_id: true, withholding_concept_id: true, tax_rule_id: true, base_amount: true, rate: true, withheld_amount: true, certificate_number: true, remittance_id: true },
    });
    const requested = dto.withholdings ?? existing.map((row) => ({
      tax_type: row.tax_type, jurisdiction_id: row.jurisdiction_id,
      withholding_concept_id: row.withholding_concept_id, tax_rule_id: row.tax_rule_id,
      base_amount: Number(row.base_amount), rate: row.rate == null ? undefined : Number(row.rate),
      withheld_amount: Number(row.withheld_amount),
    }));
    if (requested.length && !effectivePartyId) {
      throw new BadRequestException('Asigná un proveedor o entidad al gasto para registrar retenciones');
    }
    const signature = (items: any[]) => items.map((row) => [
      row.tax_type, row.jurisdiction_id ?? '', row.withholding_concept_id ?? '', row.tax_rule_id ?? '',
      Number(row.base_amount ?? 0), Number(row.rate ?? 0), Number(row.withheld_amount ?? 0),
    ].join('|')).sort().join('::');
    const changed = signature(requested) !== signature(existing);

    if (changed && existing.length) {
      const ids = existing.map((row) => row.id);
      const [applications, protectedRows] = await Promise.all([
        this.prisma.withholding_tax_applications.count({ where: { withholding_id: { in: ids }, status: 'APPLIED', reversed_at: null } }),
        this.prisma.withholdings.count({ where: { id: { in: ids }, OR: [{ remittance_id: { not: null } }, { certificate_number: { not: null } }] } }),
      ]);
      if (applications || protectedRows) {
        throw new BadRequestException('No se pueden modificar retenciones con certificado, remesa o imputación fiscal activa. Anulá primero esa trazabilidad.');
      }
    }
    if (requested.some((row) => !Number.isFinite(Number(row.withheld_amount)) || Number(row.withheld_amount) < 0)) {
      throw new BadRequestException('Cada retención debe tener un importe válido igual o mayor a cero');
    }
    const retainedTotal = requested.reduce((sum, row) => sum + Number(row.withheld_amount || 0), 0);
    const grossApplied = documents.length
      ? documents.reduce((sum, row) => sum + Number(row.amount_applied), 0)
      : Number(payment.amount) + existing.reduce((sum, row) => sum + Number(row.withheld_amount), 0);
    if (retainedTotal > grossApplied + 0.01) throw new BadRequestException('El total de retenciones no puede superar el importe bruto del pago o gasto');
    const nextNet = Math.round((grossApplied - retainedTotal + Number.EPSILON) * 100) / 100;
    const oldNet = Number(payment.amount);
    const netDifference = Math.round((nextNet - oldNet + Number.EPSILON) * 100) / 100;
    const conversionFactor = oldNet > 0 && payment.converted_amount != null
      ? Number(payment.converted_amount) / oldNet
      : payment.exchange_rate ? Number(payment.exchange_rate) : 1;
    const nextConvertedAmount = payment.converted_amount == null
      ? null
      : Math.round((nextNet * conversionFactor + Number.EPSILON) * 100) / 100;
    const now = new Date();

    await this.prisma.$transaction(async (tx) => {
      if (dto.account_id) {
        const account = await tx.accounts.findFirst({ where: { id: dto.account_id, active: true, deleted_at: null }, select: { id: true } });
        if (!account) throw new BadRequestException('La cuenta contable seleccionada no existe o está inactiva');
      }

      const oldIds = existing.map((row) => row.id);
      const oldLedgerEntries = await tx.current_account_entries.findMany({
        where: {
          payment_id: id,
          deleted_at: null,
          OR: [
            { reference_type: 'payment_financial_adjustment' },
            ...(changed && oldIds.length ? [{ reference_type: 'withholding', reference_id: { in: oldIds } }] : []),
          ],
        },
        select: { id: true, current_account_id: true, balance_before: true, balance_after: true },
      });
      const removedDeltaByAccount = new Map<string, number>();
      for (const entry of oldLedgerEntries) {
        const delta = Number(entry.balance_after) - Number(entry.balance_before);
        removedDeltaByAccount.set(entry.current_account_id, (removedDeltaByAccount.get(entry.current_account_id) ?? 0) + delta);
      }
      if (oldLedgerEntries.length) {
        await tx.current_account_entries.updateMany({
          where: { id: { in: oldLedgerEntries.map((entry) => entry.id) } },
          data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
        });
        for (const [accountId, removedDelta] of removedDeltaByAccount) {
          await tx.current_accounts.update({ where: { id: accountId }, data: { balance: { decrement: removedDelta }, updated_at: now } });
        }
      }

      const baseEntry = payment.party_id
        ? await tx.current_account_entries.findFirst({
            where: { payment_id: id, reference_type: 'payment', deleted_at: null },
            orderBy: { created_at: 'asc' },
            select: { id: true, current_account_id: true, amount: true, converted_amount: true, balance_before: true, balance_after: true },
          })
        : null;
      if (baseEntry && Math.abs(netDifference) > 0.001) {
        const oldDelta = Number(baseEntry.balance_after) - Number(baseEntry.balance_before);
        const nextBalanceAmount = nextConvertedAmount
          ?? Math.round((nextNet * conversionFactor + Number.EPSILON) * 100) / 100;
        const nextDelta = Math.sign(oldDelta || 1) * nextBalanceAmount;
        await tx.current_account_entries.update({ where: { id: baseEntry.id }, data: {
          amount: nextNet,
          converted_amount: nextBalanceAmount,
          balance_after: Number(baseEntry.balance_before) + nextDelta,
          updated_at: now,
          updated_by: userId,
        } });
        await tx.current_accounts.update({ where: { id: baseEntry.current_account_id }, data: {
          balance: { increment: nextDelta - oldDelta }, updated_at: now,
        } });
      }

      if (!baseEntry && assignedParty) {
        await this.createCurrentAccountEntry({
          ...payment,
          party_id: assignedParty.id,
          party_type: assignedParty.type,
          amount: { toNumber: () => nextNet },
        }, userId, tx, payment.type);
      }

      if (changed) {
        if (oldIds.length) {
          await tx.withholdings.updateMany({
            where: { id: { in: oldIds }, deleted_at: null },
            data: { status: 'CANCELLED', deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
          });
        }
        for (const withholding of requested) {
          const created = await tx.withholdings.create({
            data: {
              company_id: this.getCompanyId() ?? payment.id,
              business_party_id: effectivePartyId!,
              direction: payment.type === 'PAYMENT' || payment.type === 'EXPENSE' ? 'PRACTICADA' : 'SUFRIDA',
              payment_id: id, tax_type: withholding.tax_type,
              jurisdiction_id: withholding.jurisdiction_id ?? null,
              withholding_concept_id: withholding.withholding_concept_id ?? null,
              tax_rule_id: withholding.tax_rule_id ?? null,
              base_amount: withholding.base_amount, rate: withholding.rate ?? null,
              withheld_amount: withholding.withheld_amount, automatic_amount: withholding.withheld_amount,
              currency_code: payment.currency_code, exchange_rate: payment.exchange_rate,
              certificate_number: withholding.certificate_number ?? null,
              certificate_date: withholding.certificate_date ? new Date(withholding.certificate_date) : null,
              status: 'APPLIED', date: payment.date, observations: withholding.observations ?? null,
              created_by: userId,
              ...(withholding.allocations?.length ? { allocations: { create: withholding.allocations.map((a) => ({
                document_id: a.document_id, allocated_amount: a.allocated_amount, created_by: userId,
              })) } } : {}),
            },
          });
          if (effectivePartyId) await this.currentAccountsService.addEntry({
            party_id: effectivePartyId, party_type: effectivePartyType ?? 'SUPPLIER',
            currency_code: payment.currency_code, type: 'WITHHOLDING',
            amount: Number(withholding.withheld_amount),
            exchange_rate: payment.exchange_rate ? Number(payment.exchange_rate) : undefined,
            rate_type: payment.rate_type ?? undefined,
            description: `Retención ${withholding.tax_type} - Pago #${payment.number}`,
            reference_type: 'withholding', reference_id: created.id, payment_id: id,
            date: payment.date instanceof Date ? payment.date.toISOString().slice(0, 10) : payment.date,
          }, userId, tx);
        }
      }

      if (payment.cash_box_id) await this.updateFinalizedCashMovement(tx, payment, nextNet, nextConvertedAmount, userId, now);
      if (payment.bank_account_id) await this.updateFinalizedBankMovement(tx, payment, nextNet, nextConvertedAmount, grossApplied, retainedTotal, userId, now);

      await tx.payments.update({ where: { id }, data: {
        amount: nextNet,
        converted_amount: nextConvertedAmount,
        ...(assignedParty ? { party_id: assignedParty.id, party_type: assignedParty.type } : {}),
        ...(dto.account_id !== undefined ? { account_id: dto.account_id || null } : {}),
        updated_at: now, updated_by: userId,
      } });
      if (effectivePartyId) {
        const currentAccount = await tx.current_accounts.findUnique({ where: { party_id: effectivePartyId }, select: { id: true } });
        if (currentAccount) await recalculateCurrentAccountLedger(tx, currentAccount.id);
      }
    }, { timeout: 15_000 });
    return this.findOne(id);
  }

  private async updateFinalizedCashMovement(
    tx: any,
    payment: any,
    nextNet: number,
    nextConvertedAmount: number | null,
    userId: string,
    now: Date,
  ) {
    const movement = await tx.cash_box_movements.findFirst({
      where: { payment_id: payment.id, reference_type: 'payment', deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
    if (!movement) throw new BadRequestException('No se encontró el movimiento original de caja para actualizar el pago');

    const adjustments = await tx.cash_box_movements.findMany({
      where: { payment_id: payment.id, reference_type: 'payment_financial_adjustment', deleted_at: null },
      select: { id: true, session_id: true, amount: true, balance_before: true, balance_after: true },
    });
    const isOutflow = payment.type === 'PAYMENT' || payment.type === 'EXPENSE';
    const targetDelta = isOutflow ? -Math.abs(nextNet) : Math.abs(nextNet);
    const oldPrimaryDelta = Number(movement.balance_after) - Number(movement.balance_before);
    const oldAdjustmentsDelta = adjustments.reduce((sum: number, row: any) => sum + Number(row.balance_after) - Number(row.balance_before), 0);
    const balance = await tx.cash_box_balances.findUnique({
      where: { cash_box_id_currency_code: { cash_box_id: movement.cash_box_id, currency_code: movement.currency_code } },
    });
    if (!balance) throw new BadRequestException('No se encontró el saldo de caja para recalcular el pago');
    const balanceDelta = targetDelta - oldPrimaryDelta - oldAdjustmentsDelta;
    const nextBalance = Number(balance.balance) + balanceDelta;
    if (nextBalance < -0.001) throw new BadRequestException('El cambio dejaría el saldo de la caja en negativo');

    await tx.cash_box_movements.update({ where: { id: movement.id }, data: {
      amount: Math.abs(nextNet),
      converted_amount: nextConvertedAmount == null ? null : Math.abs(nextConvertedAmount),
      balance_after: Number(movement.balance_before) + targetDelta,
      updated_at: now,
      updated_by: userId,
    } });
    if (adjustments.length) {
      await tx.cash_box_movements.updateMany({
        where: { id: { in: adjustments.map((row: any) => row.id) } },
        data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
      });
    }
    await tx.cash_box_balances.update({
      where: { id: balance.id },
      data: { balance: nextBalance, updated_at: now, updated_by: userId },
    });

    const sessionDeltas = new Map<string, { income: number; expenses: number; count: number }>();
    const registerSessionDelta = (sessionId: string | null, kind: 'income' | 'expenses', amount: number, count = 0) => {
      if (!sessionId) return;
      const value = sessionDeltas.get(sessionId) ?? { income: 0, expenses: 0, count: 0 };
      value[kind] += amount;
      value.count += count;
      sessionDeltas.set(sessionId, value);
    };
    const sourceAmountChange = nextNet - Number(movement.amount);
    registerSessionDelta(movement.session_id, isOutflow ? 'expenses' : 'income', sourceAmountChange);
    for (const adjustment of adjustments) {
      const delta = Number(adjustment.balance_after) - Number(adjustment.balance_before);
      registerSessionDelta(adjustment.session_id, delta < 0 ? 'expenses' : 'income', -Math.abs(delta), -1);
    }
    for (const [sessionId, delta] of sessionDeltas) {
      await tx.cash_box_sessions.update({ where: { id: sessionId }, data: {
        ...(delta.income ? { total_income: { increment: delta.income } } : {}),
        ...(delta.expenses ? { total_expenses: { increment: delta.expenses } } : {}),
        ...(delta.count ? { movement_count: { increment: delta.count } } : {}),
        updated_at: now,
        updated_by: userId,
      } });
    }

    const activeMovements = await tx.cash_box_movements.findMany({
      where: { cash_box_id: movement.cash_box_id, currency_code: movement.currency_code, deleted_at: null },
      orderBy: [{ date: 'asc' }, { created_at: 'asc' }, { id: 'asc' }],
      select: { id: true, balance_before: true, balance_after: true },
    });
    const totalDelta = activeMovements.reduce((sum: number, row: any) => sum + Number(row.balance_after) - Number(row.balance_before), 0);
    let runningBalance = Math.round((nextBalance - totalDelta + Number.EPSILON) * 100) / 100;
    for (const row of activeMovements) {
      const delta = Number(row.balance_after) - Number(row.balance_before);
      const before = runningBalance;
      const after = Math.round((before + delta + Number.EPSILON) * 100) / 100;
      if (Number(row.balance_before) !== before || Number(row.balance_after) !== after) {
        await tx.cash_box_movements.update({ where: { id: row.id }, data: { balance_before: before, balance_after: after } });
      }
      runningBalance = after;
    }
    await tx.cash_box_balances.update({ where: { id: balance.id }, data: { balance: runningBalance, updated_at: now, updated_by: userId } });
  }

  private async updateFinalizedBankMovement(
    tx: any,
    payment: any,
    nextNet: number,
    nextConvertedAmount: number | null,
    grossApplied: number,
    retainedTotal: number,
    userId: string,
    now: Date,
  ) {
    const movement = await tx.bank_account_movements.findFirst({
      where: { payment_id: payment.id, reference_type: 'payment', deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
    if (!movement) throw new BadRequestException('No se encontró el movimiento original del banco para actualizar el pago');

    const adjustments = await tx.bank_account_movements.findMany({
      where: { payment_id: payment.id, reference_type: 'payment_financial_adjustment', deleted_at: null },
      select: { id: true, amount: true },
    });
    const isOutflow = payment.type === 'PAYMENT' || payment.type === 'EXPENSE';
    const targetAmount = isOutflow ? -Math.abs(nextNet) : Math.abs(nextNet);
    const oldAdjustmentsAmount = adjustments.reduce((sum: number, row: any) => sum + Number(row.amount), 0);
    const balanceDelta = targetAmount - Number(movement.amount) - oldAdjustmentsAmount;
    const account = await tx.bank_accounts.findUnique({ where: { id: movement.bank_account_id }, select: { balance: true } });
    if (!account) throw new BadRequestException('No se encontró la cuenta bancaria para recalcular el pago');
    if (isOutflow && Number(account.balance) + balanceDelta < -0.001) {
      throw new BadRequestException('El cambio dejaría el saldo de la cuenta bancaria en negativo');
    }

    await tx.bank_account_movements.update({ where: { id: movement.id }, data: {
      amount: targetAmount,
      nature: isOutflow ? 'DEBIT' : 'CREDIT',
      converted_amount: nextConvertedAmount == null ? null : Math.abs(nextConvertedAmount),
      updated_at: now,
      updated_by: userId,
    } });
    if (adjustments.length) {
      await tx.bank_account_movements.updateMany({
        where: { id: { in: adjustments.map((row: any) => row.id) } },
        data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
      });
    }
    if (Math.abs(balanceDelta) > 0.001) {
      await tx.bank_accounts.update({ where: { id: movement.bank_account_id }, data: {
        balance: { increment: balanceDelta }, updated_at: now, updated_by: userId,
      } });
    }
    await recalculateBankAccountLedger(tx, movement.bank_account_id);
    const operation = await tx.bank_operations.findFirst({
      where: { source_type: 'payment', source_id: payment.id, deleted_at: null },
      orderBy: { created_at: 'desc' },
      select: { id: true },
    });
    if (operation) {
      await this.bankMovements.closeOperation(operation.id, tx);
      await tx.bank_operations.update({ where: { id: operation.id }, data: {
        gross_amount: grossApplied,
        retentions_amount: retainedTotal,
        updated_at: now,
        updated_by: userId,
      } });
    }
  }

  // ═══════════════════════════════════════════
  // REMOVE (soft delete, only DRAFT or CANCELLED)
  // ═══════════════════════════════════════════

  async remove(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status === 'CONFIRMED' || payment.status === 'PAID') {
      throw new BadRequestException('No se puede eliminar un pago confirmado o pagado. Anúlelo primero.');
    }

    await this.prisma.treasury_obligations.updateMany({
      where: { payment_id: id, deleted_at: null },
      data: { payment_id: null, status: 'READY', paid_at: null, updated_at: new Date(), updated_by: userId },
    });
    const cardTransactions = payment.credit_card_transactions ?? [];
    for (const transaction of cardTransactions) {
      if (transaction.clearing_status === 'CLEARED')
        throw new BadRequestException(
          'La operación de tarjeta ya impactó en banco y debe revertirse desde su liquidación',
        );
      await this.prisma.credit_card_installments.updateMany({
        where: { transaction_id: transaction.id, deleted_at: null },
        data: { deleted_at: new Date(), deleted_by: userId },
      });
      await this.prisma.credit_card_transactions.update({
        where: { id: transaction.id },
        data: { clearing_status: 'FAILED', updated_by: userId },
      });
    }
    return this.prisma.payments.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  // ═══════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════

  private async syncTreasuryObligations(
    paymentId: string,
    obligations: Array<{ obligation_id: string; amount_applied: number }> | undefined,
    partyId: string | undefined,
    currencyCode: string,
    userId: string,
  ) {
    if (obligations === undefined) return;
    const ids = [...new Set(obligations.map((item) => item.obligation_id))];
    const rows = ids.length
      ? await this.prisma.treasury_obligations.findMany({
          where: { id: { in: ids }, deleted_at: null },
        })
      : [];
    if (rows.length !== ids.length) throw new BadRequestException('Una de las obligaciones seleccionadas ya no existe');
    for (const row of rows) {
      if (!['READY', 'PLANNED', 'REVIEW'].includes(row.status)) {
        throw new BadRequestException(`La obligación ${row.description} ya no está disponible para pagar`);
      }
      if (row.payment_id && row.payment_id !== paymentId) {
        throw new BadRequestException(`La obligación ${row.description} ya está asociada a otro pago`);
      }
      if (partyId && row.party_id !== partyId) {
        throw new BadRequestException('Todas las obligaciones deben pertenecer al tercero seleccionado');
      }
      if (row.currency_code !== currencyCode) {
        throw new BadRequestException('La moneda de la obligación debe coincidir con la moneda del pago');
      }
      if (row.treatment !== 'DIRECT_EXPENSE' || !row.expense_account_id) {
        throw new BadRequestException(
          `La obligación ${row.description} debe pagarse mediante su factura fiscal o tener una cuenta de gasto configurada`,
        );
      }
    }
    await this.prisma.treasury_obligations.updateMany({
      where: { payment_id: paymentId, id: { notIn: ids }, deleted_at: null },
      data: { payment_id: null, status: 'READY', paid_at: null, updated_by: userId },
    });
    if (ids.length) {
      await this.prisma.treasury_obligations.updateMany({
        where: { id: { in: ids } },
        data: { payment_id: paymentId, status: 'READY', paid_at: null, updated_by: userId },
      });
    }
  }

  private async refreshPaymentOperations(paymentId: string) {
    const links = await this.prisma.payment_documents.findMany({
      where: { payment_id: paymentId, deleted_at: null },
      select: { document: { select: { commercial_operation_id: true } } },
    });
    const operationIds = [
      ...new Set(links.map((link) => link.document.commercial_operation_id).filter(Boolean)),
    ] as string[];
    for (const operationId of operationIds) {
      await this.commercialFlow.refresh(operationId);
    }
  }

  private async processLinkedChecks(payment: any, userId: string, tx?: any) {
    const prisma = tx || this.prisma;

    const checks = await prisma.checks.findMany({
      where: { payment_id: payment.id, deleted_at: null },
    });
    for (const check of checks) {
      if (check.is_own) {
        // Cheque propio: queda confirmado y pendiente de conciliación.
        // Tesorería registra el débito cuando aparece en el extracto bancario.
        if (check.bank_account_id) {
          const bankAccount = await prisma.bank_accounts.findUnique({
            where: { id: check.bank_account_id },
          });
          if (!bankAccount?.active) {
            throw new BadRequestException(`La cuenta del cheque propio #${check.check_number} no está activa`);
          }
          if (bankAccount.currency_code !== check.currency_code) {
            throw new BadRequestException(
              `La moneda del cheque propio #${check.check_number} no coincide con su cuenta bancaria`,
            );
          }
        } else {
          throw new BadRequestException(`El cheque propio #${check.check_number} no tiene cuenta bancaria a debitar`);
        }

        await prisma.checks.update({
          where: { id: check.id },
          data: {
            status: 'CONFIRMED',
            confirmed_by: userId,
            confirmed_at: new Date(),
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      } else {
        if (payment.type === 'COLLECTION') {
          // Un cheque recibido cancela la deuda del cliente, pero permanece en
          // cartera hasta ser depositado o entregado en otro pago.
          await prisma.checks.update({
            where: { id: check.id },
            data: { status: 'PENDING', updated_at: new Date(), updated_by: userId },
          });
          continue;
        }

        // Al entregarlo a un proveedor, el cheque físico sale completo de
        // cartera aunque una parte quede como saldo a favor.
        await prisma.checks.update({
          where: { id: check.id },
          data: {
            available_amount: 0,
            status: 'CLEARED',
            clearing_date: new Date(),
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      }
    }
  }

  private async createCashBoxMovement(payment: any, userId: string, tx?: any) {
    const prisma = tx || this.prisma;
    const cashBox = await prisma.cash_boxes.findFirst({
      where: { id: payment.cash_box_id, deleted_at: null },
      select: { currency_code: true, current_session_id: true },
    });
    if (!cashBox) throw new BadRequestException('Caja no encontrada');
    if (cashBox.currency_code !== payment.currency_code) {
      throw new BadRequestException(
        `La caja opera en ${cashBox.currency_code} y el pago está expresado en ${payment.currency_code}`,
      );
    }

    const balance = await prisma.cash_box_balances.findUnique({
      where: {
        cash_box_id_currency_code: {
          cash_box_id: payment.cash_box_id,
          currency_code: payment.currency_code,
        },
      },
    });

    const currentBalance = balance?.balance.toNumber() ?? 0;
    const isOutflow = payment.type === 'PAYMENT' || payment.type === 'EXPENSE';
    const amount = payment.amount.toNumber();
    const balanceAfter = isOutflow ? currentBalance - amount : currentBalance + amount;

    if (isOutflow && balanceAfter < 0) {
      throw new BadRequestException('Saldo insuficiente en la caja');
    }

    await prisma.cash_box_movements.create({
      data: {
        cash_box_id: payment.cash_box_id,
        session_id: cashBox.current_session_id,
        type: payment.type === 'EXPENSE' ? 'PAYMENT' : (payment.type as any),
        amount: payment.amount,
        currency_code: payment.currency_code,
        exchange_rate: payment.exchange_rate,
        rate_type: payment.rate_type,
        converted_amount: payment.converted_amount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: payment.description ?? `Pago #${payment.number}`,
        payment_id: payment.id,
        reference_type: 'payment',
        reference_id: payment.id,
        date: payment.date,
        created_by: userId,
      },
    });

    if (cashBox.current_session_id) {
      await prisma.cash_box_sessions.update({
        where: { id: cashBox.current_session_id },
        data: {
          movement_count: { increment: 1 },
          ...(isOutflow ? { total_expenses: { increment: amount } } : { total_income: { increment: amount } }),
        },
      });
    }

    if (balance) {
      await prisma.cash_box_balances.update({
        where: { id: balance.id },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    } else {
      await prisma.cash_box_balances.create({
        data: {
          cash_box_id: payment.cash_box_id,
          currency_code: payment.currency_code,
          balance: balanceAfter,
          created_by: userId,
        },
      });
    }
  }

  private async createBankMovement(payment: any, userId: string, tx?: any) {
    const prisma = tx || this.prisma;
    const bankAccount = await prisma.bank_accounts.findUnique({
      where: { id: payment.bank_account_id },
    });

    if (!bankAccount) return null;

    const currentBankBalance = Number(bankAccount.balance);
    const isOutflow = payment.type === 'PAYMENT' || payment.type === 'EXPENSE';
    const amount = payment.amount.toNumber();

    if (isOutflow && currentBankBalance - amount < 0) {
      throw new BadRequestException('Saldo insuficiente en la cuenta bancaria');
    }

    const operation = await this.bankMovements.openOperation(
      {
        bankAccountId: payment.bank_account_id,
        operationType: payment.type === 'COLLECTION' ? 'COLLECTION' : 'PAYMENT',
        sourceType: 'payment',
        sourceId: payment.id,
        date: payment.date,
        currencyCode: payment.currency_code,
        description: payment.description ?? `Pago #${payment.number}`,
        reference: payment.reference ?? null,
        userId,
      },
      prisma,
    );

    await this.bankMovements.addMovement(
      {
        bankAccountId: payment.bank_account_id,
        type: payment.type === 'EXPENSE' ? 'PAYMENT' : payment.type,
        nature: isOutflow ? 'DEBIT' : 'CREDIT',
        amount: isOutflow ? -Math.abs(amount) : Math.abs(amount),
        currencyCode: payment.currency_code,
        exchangeRate: payment.exchange_rate ? Number(payment.exchange_rate) : null,
        rateType: payment.rate_type ?? null,
        convertedAmount: payment.converted_amount ? Number(payment.converted_amount) : null,
        operationId: operation.id,
        description: payment.description ?? `Pago #${payment.number}`,
        reference: payment.reference ?? null,
        referenceType: 'payment',
        referenceId: payment.id,
        paymentId: payment.id,
        date: payment.date,
        userId,
      },
      prisma,
    );

    return operation;
  }

  private async createBankCharges(payment: any, operation: any, userId: string, tx?: any) {
    const prisma = tx || this.prisma;
    const charges = await prisma.payment_bank_charges.findMany({
      where: { payment_id: payment.id, deleted_at: null },
      include: { bank_concept: true },
      orderBy: { created_at: 'asc' },
    });

    for (const charge of charges) {
      if (!Number(charge.total_amount)) continue;
      const movement = await this.bankMovements.addMovement(
        {
          bankAccountId: payment.bank_account_id,
          conceptId: charge.bank_concept_id,
          type: this.resolveChargeMovementType(charge.bank_concept?.concept_type ?? null, charge.nature),
          nature: charge.nature,
          amount:
            charge.nature === 'DEBIT' ? -Math.abs(Number(charge.total_amount)) : Math.abs(Number(charge.total_amount)),
          baseAmount: Number(charge.base_amount),
          taxAmount: Number(charge.tax_amount),
          totalAmount: Number(charge.total_amount),
          currencyCode: payment.currency_code,
          exchangeRate: payment.exchange_rate ? Number(payment.exchange_rate) : null,
          rateType: payment.rate_type ?? null,
          description: charge.concept_name_snapshot ?? payment.description ?? `Gasto pago #${payment.number}`,
          reference: charge.reference ?? null,
          referenceType: 'payment_bank_charge',
          referenceId: charge.id,
          paymentId: payment.id,
          operationId: operation.id,
          date: payment.date,
          userId,
          recalculate: false,
        },
        prisma,
      );

      await prisma.payment_bank_charges.update({
        where: { id: charge.id },
        data: { bank_operation_id: operation.id, bank_account_movement_id: movement.id },
      });
    }

    await this.bankMovements.closeOperation(operation.id, prisma);
  }

  private resolveChargeMovementType(conceptType: string | null, nature: string): any {
    if (nature === 'DEBIT') {
      if (conceptType === 'RETENTION') return 'RETENTION';
      if (conceptType === 'TAX') return 'TAX';
      if (conceptType === 'INTEREST') return 'INTEREST';
      if (conceptType === 'COMMISSION' || conceptType === 'EXPENSE') return 'FEE';
      if (conceptType === 'ADJUSTMENT') return 'ADJUSTMENT';
      return 'FEE';
    }
    return 'DEPOSIT';
  }

  private async createCurrentAccountEntry(payment: any, userId: string, tx?: any, entryType?: string) {
    // EXPENSE is a payment workflow type, but it is not part of the
    // AccountEntryType enum used by current_account_entries. In a party's
    // current account it must be recorded as the corresponding outgoing PAYMENT.
    const sourceType = entryType ?? payment.type;
    const type = sourceType === 'EXPENSE' ? 'PAYMENT' : sourceType;

    await this.currentAccountsService.addEntry(
      {
        party_id: payment.party_id,
        party_type: payment.payment_method === 'PAYROLL_DEDUCTION' ? 'CUSTOMER' : (payment.party_type ?? 'CUSTOMER'),
        currency_code: payment.currency_code,
        type,
        amount: payment.amount.toNumber(),
        exchange_rate: payment.exchange_rate ? Number(payment.exchange_rate) : undefined,
        rate_type: payment.rate_type ?? undefined,
        description: payment.description ?? `Pago #${payment.number}`,
        reference_type: 'payment',
        reference_id: payment.id,
        payment_id: payment.id,
        date: payment.date instanceof Date ? payment.date.toISOString().split('T')[0] : payment.date,
      },
      userId,
      tx,
    );
  }

  private async createPayrollDeductionEntry(payment: any, userId: string, tx: any) {
    if (!payment.party_id || payment.type !== 'COLLECTION') {
      throw new BadRequestException('El descuento de haberes requiere un empleado y un cobro');
    }

    const [employee, customerRole, appliedDocuments] = await Promise.all([
      tx.employees.findFirst({
        where: { party_id: payment.party_id, is_active: true, deleted_at: null },
        select: { id: true },
      }),
      tx.business_party_roles.findFirst({
        where: { party_id: payment.party_id, role: 'CUSTOMER', active: true },
        select: { id: true },
      }),
      tx.payment_documents.count({
        where: { payment_id: payment.id, deleted_at: null },
      }),
    ]);
    if (!employee || !customerRole) {
      throw new BadRequestException('El tercero debe ser un empleado habilitado como cliente interno');
    }
    if (appliedDocuments === 0) {
      throw new BadRequestException('El descuento de haberes debe aplicarse a un documento de venta');
    }

    let account = await tx.hr_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: payment.party_id,
          currency_code: payment.currency_code,
        },
      },
    });
    if (!account) {
      account = await tx.hr_accounts.create({
        data: {
          party_id: payment.party_id,
          party_type: 'EMPLOYEE',
          currency_code: payment.currency_code,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = Number(account.balance);
    const amount = Number(payment.amount);
    const balanceAfter = currentBalance - amount;
    await tx.hr_account_entries.create({
      data: {
        hr_account_id: account.id,
        type: 'PAYROLL_DEDUCTION',
        amount,
        currency_code: payment.currency_code,
        exchange_rate: payment.exchange_rate,
        rate_type: payment.rate_type,
        converted_amount: payment.converted_amount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: `Compra a descontar de haberes - Cobro #${payment.number}`,
        reference_type: 'payment',
        reference_id: payment.id,
        date: payment.date,
        created_by: userId,
      },
    });
    await tx.hr_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date(), updated_by: userId },
    });
  }

  private async applyHrValePayment(tx: any, vale: any, document: any, amount: number, payment: any, userId: string) {
    const account = await tx.hr_accounts.findUnique({
      where: { party_id_currency_code: { party_id: vale.party_id, currency_code: document.currency_code } },
    });
    if (!account) throw new BadRequestException(`No existe cuenta corriente RRHH para el vale #${vale.number}`);
    const before = Number(account.balance);
    const after = before - amount;
    await tx.hr_account_entries.create({
      data: {
        hr_account_id: account.id,
        type: 'PAYMENT',
        amount,
        currency_code: document.currency_code,
        exchange_rate: document.exchange_rate,
        rate_type: document.rate_type,
        converted_amount: document.converted_total,
        balance_before: before,
        balance_after: after,
        description: `Pago de Vale #${vale.number} · Pago #${payment.number}`,
        reference_type: 'payment',
        reference_id: payment.id,
        date: payment.date,
        created_by: userId,
      },
    });
    await tx.hr_accounts.update({
      where: { id: account.id },
      data: { balance: after, updated_at: new Date(), updated_by: userId },
    });
  }

  private async reverseSideEffects(
    payment: any,
    userId: string,
    referenceType: string,
    checkAction: 'RETURN_TO_PORTFOLIO' | 'CANCEL' = 'RETURN_TO_PORTFOLIO',
  ) {
    // Anular retenciones asociadas
    await this.prisma.withholdings.updateMany({
      where: { payment_id: payment.id, deleted_at: null },
      data: { status: 'CANCELLED', updated_at: new Date(), updated_by: userId },
    });

    // Revert documents
    const paymentDocs = await this.prisma.payment_documents.findMany({
      where: { payment_id: payment.id },
      orderBy: { created_at: 'asc' },
    });

    for (const pd of paymentDocs) {
      await this.prisma.documents.update({
        where: { id: pd.document_id },
        data: {
          paid_amount: { decrement: pd.amount_applied.toNumber() },
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }

    if (payment.payment_method === 'MIXED') {
      const cashMovements = await this.prisma.cash_box_movements.findMany({
        where: { payment_id: payment.id, reference_type: 'payment', deleted_at: null },
        orderBy: { created_at: 'asc' },
      });
      for (const movement of cashMovements) {
        const cashBox = await this.prisma.cash_boxes.findFirst({
          where: { id: movement.cash_box_id, deleted_at: null },
          select: { current_session_id: true },
        });
        const balance = await this.prisma.cash_box_balances.findUnique({
          where: { cash_box_id_currency_code: { cash_box_id: movement.cash_box_id, currency_code: movement.currency_code } },
        });
        if (!balance) throw new BadRequestException('No se encontró el saldo de caja para revertir el pago mixto');

        const currentBalance = Number(balance.balance);
        const originalDelta = Number(movement.balance_after) - Number(movement.balance_before);
        const reversalDelta = -originalDelta;
        const balanceAfter = Number((currentBalance + reversalDelta).toFixed(2));
        const amount = Math.abs(Number(movement.amount));
        const wasOutflow = originalDelta < 0;
        await this.prisma.cash_box_movements.create({
          data: {
            cash_box_id: movement.cash_box_id,
            session_id: cashBox?.current_session_id ?? null,
            type: 'ADJUSTMENT',
            amount,
            currency_code: movement.currency_code,
            exchange_rate: movement.exchange_rate,
            rate_type: movement.rate_type,
            converted_amount: movement.converted_amount,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Reversión de pago mixto #${payment.number}`,
            payment_id: payment.id,
            reference_type: referenceType,
            reference_id: payment.id,
            date: new Date(),
            created_by: userId,
          },
        });
        if (cashBox?.current_session_id) {
          await this.prisma.cash_box_sessions.update({
            where: { id: cashBox.current_session_id },
            data: {
              movement_count: { increment: 1 },
              ...(wasOutflow ? { total_income: { increment: amount } } : { total_expenses: { increment: amount } }),
            },
          });
        }
        await this.prisma.cash_box_balances.update({ where: { id: balance.id }, data: { balance: balanceAfter, updated_at: new Date() } });
      }

      const bankMovements = await this.prisma.bank_account_movements.findMany({
        where: { payment_id: payment.id, reference_type: 'payment', deleted_at: null },
        orderBy: { created_at: 'asc' },
      });
      for (const movement of bankMovements) {
        const bankAccount = await this.prisma.bank_accounts.findUnique({ where: { id: movement.bank_account_id } });
        if (!bankAccount) continue;
        const currentBalance = Number(bankAccount.balance);
        const reversalAmount = -Number(movement.amount);
        const balanceAfter = Number((currentBalance + reversalAmount).toFixed(2));
        const isOutflow = movement.nature === 'DEBIT';
        await this.prisma.bank_account_movements.create({
          data: {
            bank_account_id: movement.bank_account_id,
            type: payment.type === 'EXPENSE' ? 'PAYMENT' : (payment.type as any),
            nature: isOutflow ? 'CREDIT' : 'DEBIT',
            amount: reversalAmount,
            currency_code: movement.currency_code,
            exchange_rate: movement.exchange_rate,
            rate_type: movement.rate_type,
            converted_amount: movement.converted_amount,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Reversión de pago mixto #${payment.number}`,
            payment_id: payment.id,
            reference_type: referenceType,
            reference_id: payment.id,
            date: new Date(),
            created_by: userId,
          },
        });
        await this.prisma.bank_accounts.update({
          where: { id: movement.bank_account_id },
          data: { balance: balanceAfter, updated_at: new Date(), updated_by: userId },
        });
        await recalculateBankAccountLedger(this.prisma, movement.bank_account_id);
      }
    }

    // Revert cash box movement
    if (payment.cash_box_id) {
      const cashBox = await this.prisma.cash_boxes.findFirst({
        where: { id: payment.cash_box_id, deleted_at: null },
        select: { currency_code: true, current_session_id: true },
      });
      if (!cashBox) throw new BadRequestException('Caja no encontrada');
      if (cashBox.currency_code !== payment.currency_code) {
        throw new BadRequestException(
          `La caja opera en ${cashBox.currency_code} y el pago está expresado en ${payment.currency_code}`,
        );
      }
      const balance = await this.prisma.cash_box_balances.findUnique({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: payment.cash_box_id,
            currency_code: payment.currency_code,
          },
        },
      });

      if (balance) {
        const currentBalance = balance.balance.toNumber();
        const isOutflow = payment.type === 'PAYMENT' || payment.type === 'EXPENSE';
        const amount = payment.amount.toNumber();
        const balanceAfter = isOutflow ? currentBalance + amount : currentBalance - amount;

        await this.prisma.cash_box_movements.create({
          data: {
            cash_box_id: payment.cash_box_id,
            session_id: cashBox.current_session_id,
            type: 'ADJUSTMENT',
            amount: payment.amount,
            currency_code: payment.currency_code,
            exchange_rate: payment.exchange_rate,
            rate_type: payment.rate_type,
            converted_amount: payment.converted_amount,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Reversión de pago #${payment.number}`,
            payment_id: payment.id,
            reference_type: referenceType,
            reference_id: payment.id,
            date: new Date(),
            created_by: userId,
          },
        });

        if (cashBox.current_session_id) {
          await this.prisma.cash_box_sessions.update({
            where: { id: cashBox.current_session_id },
            data: {
              movement_count: { increment: 1 },
              ...(isOutflow ? { total_income: { increment: amount } } : { total_expenses: { increment: amount } }),
            },
          });
        }

        await this.prisma.cash_box_balances.update({
          where: { id: balance.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      }
    }

    // Revert bank movement (only for non-check payments)
    if (payment.bank_account_id && payment.payment_method !== 'CHECK') {
      const bankAccount = await this.prisma.bank_accounts.findUnique({
        where: { id: payment.bank_account_id },
      });

      if (bankAccount) {
        const currentBankBalance = bankAccount.balance.toNumber();
        const isOutflow = payment.type === 'PAYMENT' || payment.type === 'EXPENSE';
        const amount = payment.amount.toNumber();
        const bankBalanceAfter = isOutflow ? currentBankBalance + amount : currentBankBalance - amount;

        await this.prisma.bank_account_movements.create({
          data: {
            bank_account_id: payment.bank_account_id,
            type: payment.type === 'EXPENSE' ? 'PAYMENT' : (payment.type as any),
            nature: isOutflow ? 'CREDIT' : 'DEBIT',
            amount: isOutflow ? Math.abs(amount) : -Math.abs(amount),
            currency_code: payment.currency_code,
            exchange_rate: payment.exchange_rate,
            rate_type: payment.rate_type,
            converted_amount: payment.converted_amount,
            balance_before: currentBankBalance,
            balance_after: bankBalanceAfter,
            description: `Reversión de pago #${payment.number}`,
            payment_id: payment.id,
            reference_type: 'payment_reversal',
            reference_id: payment.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.bank_accounts.update({
          where: { id: payment.bank_account_id },
          data: { balance: bankBalanceAfter, updated_at: new Date() },
        });
        await recalculateBankAccountLedger(this.prisma, payment.bank_account_id);
      }
    }

    // Revert linked checks
    if (payment.payment_method === 'CHECK' || (payment.payment_method === 'MIXED' && payment.tenders?.some((tender: any) => tender.method === 'CHECK'))) {
      await this.reverseLinkedChecks(payment, userId, checkAction);
    }

    // Quitar de la cuenta corriente todas las entradas vinculadas al pago.
    // El pago anulado conserva la trazabilidad; la cuenta muestra sólo deuda real.
    if (payment.party_id) {
      const entries = await this.prisma.current_account_entries.findMany({
        where: { payment_id: payment.id, deleted_at: null },
        orderBy: { created_at: 'asc' },
      });

      const entriesByAccount = new Map<string, typeof entries>();
      for (const entry of entries) {
        const accountEntries = entriesByAccount.get(entry.current_account_id) ?? [];
        accountEntries.push(entry);
        entriesByAccount.set(entry.current_account_id, accountEntries);
      }

      for (const [accountId, accountEntries] of entriesByAccount) {
        const removedDelta = accountEntries.reduce(
          (sum, entry) => sum + Number(entry.balance_after) - Number(entry.balance_before),
          0,
        );
        const account = await this.prisma.current_accounts.findUnique({
          where: { id: accountId },
          select: { balance: true },
        });
        if (!account) continue;

        await this.prisma.current_account_entries.updateMany({
          where: { id: { in: accountEntries.map((entry) => entry.id) } },
          data: { deleted_at: new Date(), deleted_by: userId, updated_at: new Date(), updated_by: userId },
        });
        await this.prisma.current_accounts.update({
          where: { id: accountId },
          data: { balance: Number(account.balance) - removedDelta, updated_at: new Date() },
        });
        await recalculateCurrentAccountLedger(this.prisma, accountId);
      }
    }

    const hrEntries = await this.prisma.hr_account_entries.findMany({
      where: { reference_type: 'payment', reference_id: payment.id, deleted_at: null },
    });
    for (const entry of hrEntries) {
      if (payment.payment_method === 'PAYROLL_DEDUCTION' && entry.type === 'PAYROLL_DEDUCTION') {
        const account = await this.prisma.hr_accounts.findUnique({ where: { id: entry.hr_account_id } });
        if (!account) continue;
        const removedDelta = Number(entry.balance_after) - Number(entry.balance_before);
        const now = new Date();
        await this.prisma.hr_account_entries.update({
          where: { id: entry.id },
          data: { deleted_at: now, deleted_by: userId, updated_at: now, updated_by: userId },
        });
        await this.prisma.hr_accounts.update({
          where: { id: account.id },
          data: { balance: Number(account.balance) - removedDelta, updated_at: now, updated_by: userId },
        });
        continue;
      }

      if (entry.type !== 'PAYMENT') continue;
      const alreadyReversed = await this.prisma.hr_account_entries.findFirst({
        where: { reference_type: 'payment_reversal', reference_id: entry.id, deleted_at: null },
        select: { id: true },
      });
      if (alreadyReversed) continue;
      const account = await this.prisma.hr_accounts.findUnique({ where: { id: entry.hr_account_id } });
      if (!account) continue;
      const before = Number(account.balance);
      const after = before + Number(entry.amount);
      await this.prisma.hr_account_entries.create({
        data: {
          hr_account_id: account.id,
          type: 'PAYMENT',
          amount: entry.amount,
          currency_code: entry.currency_code,
          exchange_rate: entry.exchange_rate,
          rate_type: entry.rate_type,
          converted_amount: entry.converted_amount,
          balance_before: before,
          balance_after: after,
          description: `Reversión de pago #${payment.number} · Vale`,
          reference_type: 'payment_reversal',
          reference_id: entry.id,
          date: new Date(),
          created_by: userId,
        },
      });
      await this.prisma.hr_accounts.update({
        where: { id: account.id },
        data: { balance: after, updated_at: new Date(), updated_by: userId },
      });
    }

    for (const pd of paymentDocs) {
      const document = await this.prisma.documents.findUnique({
        where: { id: pd.document_id },
        include: { document_types: { select: { category: true } } },
      });
      if (document?.document_types?.category !== 'VALE' || !payment.party_id) continue;
      const match = document.descrip?.match(/Vale #(\d+)/);
      if (!match) continue;
      const vale = await this.prisma.hr_vales.findFirst({
        where: { party_id: payment.party_id, number: Number(match[1]), deleted_at: null, OR: [{ party_type: 'EMPLOYEE' }, { party_type: 'PARTNER', type: { in: ['SUELDO', 'ADELANTO', 'EXTRAS', 'COMISION'] } }] },
      });
      if (!vale || vale.status === 'CANCELLED') continue;
      const fullyPaid = Number(document.paid_amount) >= Number(document.total) - 0.01;
      await this.prisma.hr_vales.update({
        where: { id: vale.id },
        data: { status: fullyPaid ? 'PAID' : 'CONFIRMED', paid_at: fullyPaid ? vale.paid_at : null, updated_at: new Date(), updated_by: userId },
      });
    }
  }

  private async reverseLinkedChecks(
    payment: any,
    userId: string,
    checkAction: 'RETURN_TO_PORTFOLIO' | 'CANCEL' = 'RETURN_TO_PORTFOLIO',
  ) {
    const checks = await this.prisma.checks.findMany({
      where: { payment_id: payment.id, deleted_at: null },
    });

    for (const check of checks) {
      if (check.is_own) {
        // Revertir únicamente si el cheque llegó a generar un débito real. Un
        // cheque confirmado pero todavía no vencido no afectó el banco.
        if (check.bank_account_id) {
          const issuedMovement = await this.prisma.bank_account_movements.findFirst({
            where: {
              reference_type: 'check',
              reference_id: check.id,
              type: 'CHECK_ISSUED',
              deleted_at: null,
            },
            orderBy: { created_at: 'desc' },
          });
          const bankAccount = await this.prisma.bank_accounts.findUnique({
            where: { id: check.bank_account_id },
          });

          if (bankAccount && issuedMovement) {
            const currentBalance = Number(bankAccount.balance);
            const originalDelta = Number(issuedMovement.balance_after) - Number(issuedMovement.balance_before);
            const reversalAmount = -originalDelta;
            const balanceAfter = currentBalance + reversalAmount;

            await this.prisma.bank_account_movements.create({
              data: {
                bank_account_id: check.bank_account_id,
                type: 'ADJUSTMENT',
                amount: reversalAmount,
                currency_code: check.currency_code,
                exchange_rate: check.exchange_rate,
                rate_type: check.rate_type,
                converted_amount: check.converted_amount,
                balance_before: currentBalance,
                balance_after: balanceAfter,
                description: `Reversión de cheque propio #${check.check_number} en pago #${payment.number}`,
                reference_type: 'check_reversal',
                reference_id: check.id,
                payment_id: payment.id,
                date: new Date(),
                created_by: userId,
              },
            });

            await this.prisma.bank_accounts.update({
              where: { id: check.bank_account_id },
              data: { balance: balanceAfter, updated_at: new Date() },
            });
            await recalculateBankAccountLedger(this.prisma, check.bank_account_id);
          }
        }

        // El usuario decide si el cheque vuelve a estar disponible o queda
        // cancelado junto con el pago ingresado por error.
        await this.prisma.checks.update({
          where: { id: check.id },
          data: {
            status: checkAction === 'CANCEL' ? 'CANCELLED' : 'PENDING',
            confirmed_by: null,
            confirmed_at: null,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      } else {
        // Revertir estado del cheque de tercero según la decisión tomada al
        // anular. Al devolverlo a cartera recupera el valor físico completo.
        const allocation = await this.prisma.payment_checks.findUnique({
          where: { payment_id_check_id: { payment_id: payment.id, check_id: check.id } },
        });
        await this.prisma.checks.update({
          where: { id: check.id },
          data: {
            status: checkAction === 'CANCEL' ? 'CANCELLED' : 'PENDING',
            clearing_date: null,
            available_amount: checkAction === 'CANCEL' ? 0 : Number(check.amount),
            updated_at: new Date(),
            updated_by: userId,
          },
        });

        if (allocation) {
          await this.prisma.payment_checks.delete({
            where: { payment_id_check_id: { payment_id: payment.id, check_id: check.id } },
          });
        }
      }
    }
  }

  // ═══════════════════════════════════════════
  // APPLY ADVANCE — vincula anticipo a factura
  // ═══════════════════════════════════════════

  async applyAdvance(paymentId: string, dto: { document_id: string; amount: number }, userId: string) {
    const payment = await this.findOne(paymentId);

    if (payment.status !== 'CONFIRMED' && payment.status !== 'PAID') {
      throw new BadRequestException('Solo se pueden aplicar anticipos a pagos confirmados o pagados');
    }
    if (payment.payment_mode !== 'ADVANCE') {
      throw new BadRequestException('Este pago no es un anticipo');
    }

    // Validar documento (fuera de transacción — solo lectura)
    const document = await this.prisma.documents.findUnique({
      where: { id: dto.document_id },
      include: { document_type: true },
    });
    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }
    if (document.deleted_at) {
      throw new NotFoundException('Documento eliminado');
    }
    if (document.party_id !== payment.party_id) {
      throw new BadRequestException('El documento no pertenece al mismo tercero del pago');
    }
    // Cross-currency is now allowed: advance in USD can be applied to invoice in ARS

    return this.prisma.$transaction(async (tx) => {
      // Validar saldo disponible DENTRO de la transacción (evita race condition)
      const applied = await tx.payment_documents.aggregate({
        _sum: { amount_applied: true },
        where: { payment_id: paymentId, deleted_at: null },
      });
      const totalApplied = applied._sum.amount_applied?.toNumber() ?? 0;
      const available = payment.amount.toNumber() - totalApplied;

      if (dto.amount > available) {
        throw new BadRequestException(
          `El monto solicitado (${dto.amount}) excede el saldo disponible (${available}) del anticipo`,
        );
      }

      const docPending = document.total.toNumber() - document.paid_amount.toNumber();
      if (docPending <= 0) {
        throw new BadRequestException('El documento ya está saldado');
      }
      if (dto.amount > docPending) {
        throw new BadRequestException(
          `El monto (${dto.amount}) excede el saldo pendiente (${docPending}) del documento`,
        );
      }

      // Verificar si ya existe un link para este pago-documento (upsert)
      const existingLink = await tx.payment_documents.findUnique({
        where: { payment_id_document_id: { payment_id: paymentId, document_id: dto.document_id } },
      });
      if (existingLink) {
        // Incrementar monto aplicado en link existente
        await tx.payment_documents.update({
          where: { id: existingLink.id },
          data: {
            amount_applied: { increment: dto.amount },
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      } else {
        // Crear nuevo link
        await tx.payment_documents.create({
          data: {
            payment_id: paymentId,
            document_id: dto.document_id,
            amount_applied: dto.amount,
            created_by: userId,
          },
        });
      }

      // Incrementar paid_amount del documento
      await tx.documents.update({
        where: { id: dto.document_id },
        data: {
          paid_amount: { increment: dto.amount },
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      // Crear entrada en cuenta corriente usando CurrentAccountsService
      if (payment.party_id) {
        await this.currentAccountsService.addEntry(
          {
            party_id: payment.party_id,
            party_type: payment.party_type ?? 'SUPPLIER',
            currency_code: payment.currency_code,
            type: 'PAYMENT',
            amount: dto.amount,
            exchange_rate: payment.exchange_rate ? Number(payment.exchange_rate) : undefined,
            rate_type: payment.rate_type ?? undefined,
            description: `Anticipo #${payment.number} aplicado a factura`,
            reference_type: 'payment',
            reference_id: paymentId,
            payment_id: paymentId,
            date: new Date().toISOString(),
          },
          userId,
        );
      }

      // Retornar pago actualizado
      return tx.payments.findUnique({
        where: { id: paymentId },
        include: {
          party: { select: { id: true, name: true } },
          documents: {
            include: {
              document: { select: { id: true, number: true, total: true, paid_amount: true } },
            },
          },
        },
      });
    });
  }

  // ═══════════════════════════════════════════
  // REMOVE ADVANCE APPLICATION — desvincula anticipo de factura
  // ═══════════════════════════════════════════

  async removeAdvanceApplication(paymentId: string, documentId: string, userId: string) {
    const payment = await this.findOne(paymentId);

    if (payment.status !== 'CONFIRMED' && payment.status !== 'PAID') {
      throw new BadRequestException('Solo se pueden modificar aplicaciones de pagos confirmados o pagados');
    }

    const link = await this.prisma.payment_documents.findFirst({
      where: { payment_id: paymentId, document_id: documentId, deleted_at: null },
    });
    if (!link) {
      throw new NotFoundException('No existe aplicación de este anticipo a este documento');
    }

    return this.prisma.$transaction(async (tx) => {
      // Decrementar paid_amount del documento
      await tx.documents.update({
        where: { id: documentId },
        data: {
          paid_amount: { decrement: link.amount_applied.toNumber() },
          updated_at: new Date(),
          updated_by: userId,
        },
      });

      // Eliminar el link
      await tx.payment_documents.delete({
        where: { id: link.id },
      });

      // Retornar pago actualizado
      return tx.payments.findUnique({
        where: { id: paymentId },
        include: {
          party: { select: { id: true, name: true } },
          documents: {
            include: {
              document: { select: { id: true, number: true, total: true, paid_amount: true } },
            },
          },
        },
      });
    });
  }

  // ═══════════════════════════════════════════
  // FIND ADVANCE AVAILABLE — anticipos con saldo disponible
  // ═══════════════════════════════════════════

  async findAdvanceAvailable(partyId?: string) {
    const where: Record<string, any> = {
      payment_mode: 'ADVANCE',
      status: 'CONFIRMED',
      deleted_at: null,
    };
    if (partyId) where.party_id = partyId;

    const payments = await this.prisma.payments.findMany({
      where,
      orderBy: { date: 'asc' },
      include: {
        party: { select: { id: true, name: true } },
      },
    });

    const results: Array<{
      id: string;
      number: number;
      date: Date;
      amount: number;
      available: number;
      currency_code: string;
      party_id: string | null;
      party_name: string | null;
    }> = [];

    // Batch aggregate to avoid N+1 queries
    const paymentIds = payments.map((p) => p.id);
    const aggregates =
      paymentIds.length > 0
        ? await this.prisma.payment_documents.groupBy({
            by: ['payment_id'],
            _sum: { amount_applied: true },
            where: { payment_id: { in: paymentIds }, deleted_at: null },
          })
        : [];
    const appliedMap = new Map<string, number>(
      aggregates.map((a) => [a.payment_id, a._sum.amount_applied?.toNumber() ?? 0]),
    );

    for (const p of payments) {
      const totalApplied = appliedMap.get(p.id) ?? 0;
      const available = p.amount.toNumber() - totalApplied;

      if (available > 0) {
        results.push({
          id: p.id,
          number: p.number,
          date: p.date,
          amount: p.amount.toNumber(),
          available,
          currency_code: p.currency_code,
          party_id: p.party_id,
          party_name: p.party?.name ?? null,
        });
      }
    }

    return results;
  }

  // ═══════════════════════════════════════════
  // FIND PARTY BY NAME OR TAX ID
  // ═══════════════════════════════════════════

  async findPartyByNameOrTaxId(name: string, taxId: string) {
    if (taxId) {
      const byTaxId = await this.prisma.business_parties.findFirst({
        where: { tax_id: taxId, deleted_at: null },
      });
      if (byTaxId) return byTaxId;
    }

    if (name) {
      const byName = await this.prisma.business_parties.findFirst({
        where: { name: { contains: name, mode: 'insensitive' }, deleted_at: null },
      });
      if (byName) return byName;
    }

    return null;
  }
}
