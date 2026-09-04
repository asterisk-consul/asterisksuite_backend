import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { parseLocalDateTime } from '@/common/utils/dates';
import { CurrencyConversionService } from '../currencies/currency-conversion.service';
import { CurrentAccountsService } from '../current-accounts/current-accounts.service';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

@Injectable()
export class PaymentsService {
  constructor(
    private db: PrismaService,
    private conversionService: CurrencyConversionService,
    private currentAccountsService: CurrentAccountsService,
  ) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  private getCompanyId(): string | undefined {
    return getCurrentCompanyId();
  }

  // ═══════════════════════════════════════════
  // CREATE (DRAFT — no side effects)
  // ═══════════════════════════════════════════

  async create(dto: CreatePaymentDto, userId: string) {
    console.log('[payments] create DTO:', JSON.stringify(dto, null, 2))
    console.log('[payments] create userId:', userId)

    if (dto.documents && dto.documents.length > 0 && !dto.party_id) {
      throw new BadRequestException('party_id es requerido cuando se aplican documentos');
    }

    if (dto.payment_mode === 'ADVANCE' && !dto.party_id) {
      throw new BadRequestException('party_id es requerido para anticipos');
    }

    const lastPayment = await this.prisma.payments.findFirst({
      where: { deleted_at: null },
      orderBy: { number: 'desc' },
    });
    const nextNumber = (lastPayment?.number ?? 0) + 1;

    // ─── Auto-calculate converted_amount if not provided ─────────
    let convertedAmount = dto.converted_amount ?? null
    let exchangeRate = dto.exchange_rate ?? null
    let rateType = (dto.rate_type as any) ?? null

    if (dto.currency_code && !convertedAmount) {
      try {
        const baseCurrency = await this.conversionService.getBaseCurrency()
        if (dto.currency_code.toUpperCase() !== baseCurrency.code.toUpperCase()) {
          if (!exchangeRate) {
            const resolved = await this.conversionService.resolveRate(
              dto.currency_code,
              baseCurrency.code,
              parseLocalDateTime(dto.date),
              rateType,
            )
            exchangeRate = resolved.rate
            rateType = resolved.rateType
          }
          convertedAmount = this.conversionService.convertAmount(dto.amount, exchangeRate)
        }
      } catch {
        // If rate not found, leave as null
      }
    }

    try {
      console.log('[payments] create dto.date:', dto.date, '→ parsed:', parseLocalDateTime(dto.date).toISOString())
      const payment = await this.prisma.payments.create({
        data: {
          number: nextNumber,
          type: dto.type as any,
          payment_mode: (dto.payment_mode as any) ?? 'NORMAL',
          date: parseLocalDateTime(dto.date),
          party_id: dto.party_id,
          party_type: dto.party_type,
          payment_method: dto.payment_method as any,
          amount: dto.amount,
          currency_code: dto.currency_code,
          exchange_rate: exchangeRate,
          rate_type: rateType,
          converted_amount: convertedAmount,
          exchange_note: dto.exchange_note,
          description: dto.description,
          reference: dto.reference,
          bank_account_id: dto.bank_account_id,
          cash_box_id: dto.cash_box_id,
          account_id: dto.account_id,
          status: 'DRAFT',
          created_by: userId,
        },
      });

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
            direction: payment.type === 'PAYMENT' ? 'PRACTICADA' : 'SUFRIDA',
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

    // Link checks to this payment (con aplicación parcial opcional)
    const checkAllocations: { check_id: string; amount_applied: number }[] = [];
    if (dto.checks && dto.checks.length > 0) {
      for (const c of dto.checks) {
        const check = await this.prisma.checks.findFirst({ where: { id: c.check_id, deleted_at: null } });
        if (!check) throw new NotFoundException(`Cheque ${c.check_id} no encontrado`);
        const available = check.available_amount != null ? Number(check.available_amount) : Number(check.amount);
        if (c.amount_applied > available + 0.01) {
          throw new BadRequestException(
            `El cheque #${check.check_number} tiene saldo disponible ${available} y se intenta aplicar ${c.amount_applied}`,
          );
        }
        if (check.is_own && Math.abs(c.amount_applied - Number(check.amount)) > 0.01) {
          throw new BadRequestException(
            `El cheque propio #${check.check_number} se aplica por su monto total (${check.amount}). Usá un anticipo para el resto.`,
          );
        }
        checkAllocations.push({ check_id: c.check_id, amount_applied: c.amount_applied });
      }
    } else if (dto.check_ids && dto.check_ids.length > 0) {
      // Legacy: check_ids se aplican por su monto completo
      for (const checkId of dto.check_ids) {
        const check = await this.prisma.checks.findFirst({ where: { id: checkId, deleted_at: null } });
        if (!check) throw new NotFoundException(`Cheque ${checkId} no encontrado`);
        checkAllocations.push({ check_id: checkId, amount_applied: check.available_amount != null ? Number(check.available_amount) : Number(check.amount) });
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
      console.error('[payments] create ERROR:', error)
      throw error
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

    // Validate documents if present
    const paymentDocs = await this.prisma.payment_documents.findMany({
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
        });
        if (!document) {
          throw new NotFoundException(`Documento ${pd.document_id} no encontrado`);
        }
        const pending = document.total.toNumber() - document.paid_amount.toNumber();
        if (pending <= 0) {
          throw new BadRequestException(
            `El documento ${document.number} ya está saldado`,
          );
        }
        // Convertir pending a la moneda de pago si es cross-currency
        const docCurrency = document.currency_code?.toUpperCase();
        const payCurrency = payment.currency_code?.toUpperCase();
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
    }

    // Validación: dinero efectivo + retenciones >= importe aplicado a documentos
    if (paymentDocs.length > 0 && withholdings.length > 0) {
      const appliedTotal = paymentDocs.reduce((s, pd) => s + pd.amount_applied.toNumber(), 0);
      const cashTotal = payment.amount.toNumber();
      if (appliedTotal > cashTotal + withheldTotal + 0.01) {
        throw new BadRequestException(
          `El importe aplicado (${appliedTotal.toFixed(2)}) excede el dinero efectivo (${cashTotal.toFixed(2)}) más retenciones (${withheldTotal.toFixed(2)})`,
        );
      }
    }

    // Validación: los cheques vinculados deben cubrir lo aplicado a documentos
    if (payment.payment_method === 'CHECK') {
      const allocations = await this.prisma.payment_checks.findMany({
        where: { payment_id: payment.id },
      });
      if (allocations.length > 0) {
        const checksTotal = allocations.reduce((s, a) => s + a.amount_applied.toNumber(), 0);
        const appliedDocsTotal = paymentDocs.reduce((s, pd) => s + pd.amount_applied.toNumber(), 0);
        if (appliedDocsTotal > checksTotal + withheldTotal + 0.01) {
          throw new BadRequestException(
            `Los cheques vinculados (${checksTotal.toFixed(2)}) no cubren el importe aplicado a documentos (${appliedDocsTotal.toFixed(2)})`,
          );
        }
      }
    }

    // Determine current account entry type:
    // ADVANCE without docs → NO current account entry (pendiente de factura)
    // Otherwise → PAYMENT/COLLECTION (como siempre)
    const isAdvanceNoDocs = payment.payment_mode === 'ADVANCE' && paymentDocs.length === 0;

    return this.prisma.$transaction(async (tx) => {
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
            await tx.hr_vales.updateMany({
              where: {
                party_id: payment.party_id,
                number: valeNumber,
                status: 'CONFIRMED',
                deleted_at: null,
              },
              data: {
                status: 'PAID',
                paid_at: new Date(),
                updated_at: new Date(),
                updated_by: userId,
              },
            });
          }
        }
      }

      // Create cash box movement
      if (payment.cash_box_id) {
        await this.createCashBoxMovement(payment, userId, tx);
      }

      // Create bank account movement (for non-check payments)
      if (payment.bank_account_id && payment.payment_method !== 'CHECK') {
        await this.createBankMovement(payment, userId, tx);
      }

      // Process linked checks
      if (payment.payment_method === 'CHECK') {
        await this.processLinkedChecks(payment, userId, tx);
      }

      // Update current account — NOT for advance without documents
      // (the advance impacts CC only when applied to an invoice)
      if (payment.party_id && !isAdvanceNoDocs) {
        await this.createCurrentAccountEntry(payment, userId, tx, payment.type);
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
          );
        }
        await tx.withholdings.updateMany({
          where: { payment_id: id, deleted_at: null },
          data: { status: 'APPLIED', updated_at: new Date(), updated_by: userId },
        });
      }

      // Update status
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
    });
  }

  // ═══════════════════════════════════════════
  // MARK AS PAID (check received/cashed)
  // ═══════════════════════════════════════════

  async markAsPaid(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'CONFIRMED') {
      throw new BadRequestException('Solo se pueden marcar como pagados pagos confirmados');
    }

    return this.prisma.payments.update({
      where: { id },
      data: {
        status: 'PAID',
        payment_date: new Date(),
        updated_at: new Date(),
        updated_by: userId,
      },
    });
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

    return this.prisma.payments.update({
      where: { id },
      data: {
        status: 'REVERSED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  // ═══════════════════════════════════════════
  // REVERSE (cancel confirmed payment)
  // ═══════════════════════════════════════════

  async reverse(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status === 'DRAFT') {
      throw new BadRequestException('No se puede anular un pago en borrador. Use eliminar.');
    }
    if (payment.status === 'CANCELLED') {
      throw new BadRequestException('El pago ya está anulado');
    }

    await this.reverseSideEffects(payment, userId, 'payment_reversal');

    return this.prisma.payments.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  // ═══════════════════════════════════════════
  // FIND ALL / ONE
  // ═══════════════════════════════════════════

  async findAll(filters?: { party_id?: string; type?: string; payment_method?: string; status?: string; account_id?: string; user_id?: string }) {
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
          include: {
            document: { select: { id: true, number: true } },
          },
        },
        withholdings: {
          where: { deleted_at: null },
          include: { jurisdiction: { select: { id: true, name: true } } },
        },
      },
    });

    const creatorIds = [...new Set(payments.map(p => p.created_by).filter(Boolean))] as string[];
    let userMap: Record<string, { name: string; email: string }> = {};
    if (creatorIds.length > 0) {
      const users = await this.db.getDefaultClient().users.findMany({
        where: { id: { in: creatorIds } },
        select: { id: true, name: true, email: true },
      });
      userMap = Object.fromEntries(users.map(u => [u.id, { name: u.name, email: u.email }]));
    }

    return payments.map(p => ({
      ...p,
      creator: p.created_by ? userMap[p.created_by] ?? null : null,
    }));
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
      },
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return payment;
  }

  // ═══════════════════════════════════════════
  // UPDATE (only DRAFT)
  // ═══════════════════════════════════════════

  async update(id: string, dto: UpdatePaymentDto, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden editar pagos en borrador');
    }

    const data: Record<string, any> = {
      updated_at: new Date(),
      updated_by: userId,
    };

    if (dto.date) data.date = parseLocalDateTime(dto.date);
    if (dto.party_id) data.party_id = dto.party_id;
    if (dto.party_type) data.party_type = dto.party_type;
    if (dto.payment_method) data.payment_method = dto.payment_method;
    if (dto.amount) data.amount = dto.amount;
    if (dto.currency_code) data.currency_code = dto.currency_code;
    if (dto.exchange_rate) data.exchange_rate = dto.exchange_rate;
    if (dto.rate_type) data.rate_type = dto.rate_type;
    if (dto.converted_amount) data.converted_amount = dto.converted_amount;
    if (dto.exchange_note) data.exchange_note = dto.exchange_note;
    if (dto.description) data.description = dto.description;
    if (dto.reference) data.reference = dto.reference;
    if (dto.bank_account_id) data.bank_account_id = dto.bank_account_id;
    if (dto.cash_box_id) data.cash_box_id = dto.cash_box_id;
    if (dto.account_id !== undefined) data.account_id = dto.account_id || null;
    if (dto.payment_mode) data.payment_mode = dto.payment_mode;

    return this.prisma.payments.update({
      where: { id },
      data,
    });
  }

  // ═══════════════════════════════════════════
  // REMOVE (soft delete, only DRAFT or CANCELLED)
  // ═══════════════════════════════════════════

  async remove(id: string, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status === 'CONFIRMED' || payment.status === 'PAID') {
      throw new BadRequestException('No se puede eliminar un pago confirmado o pagado. Anúlelo primero.');
    }

    // Remove linked payment_documents
    await this.prisma.payment_documents.deleteMany({
      where: { payment_id: id },
    });

    // Remove linked withholdings + allocations
    await this.prisma.withholding_allocations.deleteMany({
      where: { withholding: { payment_id: id } },
    });
    await this.prisma.withholdings.deleteMany({
      where: { payment_id: id },
    });

    return this.prisma.payments.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // ═══════════════════════════════════════════
  // PRIVATE HELPERS
  // ═══════════════════════════════════════════

  private async processLinkedChecks(payment: any, userId: string, tx?: any) {
    const prisma = tx || this.prisma;

    const checks = await prisma.checks.findMany({
      where: { payment_id: payment.id, deleted_at: null },
    });
    const allocations = await prisma.payment_checks.findMany({
      where: { payment_id: payment.id },
    });

    for (const check of checks) {
      const allocation = allocations.find((a: any) => a.check_id === check.id);
      const applied = allocation ? allocation.amount_applied.toNumber() : Number(check.amount);

      if (check.is_own) {
        // Cheque propio: CONFIRMED + debita banco asignado al cheque (siempre por el total)
        if (check.bank_account_id) {
          const bankAccount = await prisma.bank_accounts.findUnique({
            where: { id: check.bank_account_id },
          });

          if (bankAccount && Number(bankAccount.balance) >= Number(check.amount)) {
            const currentBalance = Number(bankAccount.balance);
            const balanceAfter = currentBalance - Number(check.amount);

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

            await prisma.bank_account_movements.create({
              data: {
                bank_account_id: check.bank_account_id,
                type: 'CHECK_ISSUED',
                amount: -Number(check.amount),
                currency_code: check.currency_code,
                exchange_rate: check.exchange_rate,
                rate_type: check.rate_type,
                converted_amount: check.converted_amount,
                balance_before: currentBalance,
                balance_after: balanceAfter,
                description: `Cheque propio #${check.check_number} confirmado en pago #${payment.number}`,
                reference_type: 'check',
                reference_id: check.id,
                payment_id: payment.id,
                date: new Date(),
                created_by: userId,
              },
            });

            await prisma.bank_accounts.update({
              where: { id: check.bank_account_id },
              data: { balance: balanceAfter, updated_at: new Date() },
            });
          }
        } else {
          // Sin cuenta bancaria: solo marca como CONFIRMED
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
        }
      } else {
        // Cheque de tercero: aplicación parcial — descuenta el saldo disponible.
        // Queda PENDING (en cartera) mientras le quede saldo; CLEARED al agotarse.
        const currentAvailable = check.available_amount != null ? Number(check.available_amount) : Number(check.amount);
        const remaining = Math.max(0, Number((currentAvailable - applied).toFixed(2)));
        const fullyUsed = remaining <= 0.01;

        await prisma.checks.update({
          where: { id: check.id },
          data: {
            available_amount: fullyUsed ? 0 : remaining,
            ...(fullyUsed ? { status: 'CLEARED', clearing_date: new Date() } : {}),
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      }
    }
  }

  private async createCashBoxMovement(payment: any, userId: string, tx?: any) {
    const prisma = tx || this.prisma;
    const balance = await prisma.cash_box_balances.findUnique({
      where: {
        cash_box_id_currency_code: {
          cash_box_id: payment.cash_box_id,
          currency_code: payment.currency_code,
        },
      },
    });

    const currentBalance = balance?.balance.toNumber() ?? 0;
    const isOutflow = payment.type === 'PAYMENT';
    const amount = payment.amount.toNumber();
    const balanceAfter = isOutflow ? currentBalance - amount : currentBalance + amount;

    if (isOutflow && balanceAfter < 0) {
      throw new BadRequestException('Saldo insuficiente en la caja');
    }

    await prisma.cash_box_movements.create({
      data: {
        cash_box_id: payment.cash_box_id,
        type: payment.type as any,
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

    if (!bankAccount) return;

    const currentBankBalance = bankAccount.balance.toNumber();
    const isOutflow = payment.type === 'PAYMENT';
    const amount = payment.amount.toNumber();
    const bankBalanceAfter = isOutflow ? currentBankBalance - amount : currentBankBalance + amount;

    await prisma.bank_account_movements.create({
      data: {
        bank_account_id: payment.bank_account_id,
        type: payment.type as any,
        amount: payment.amount,
        currency_code: payment.currency_code,
        exchange_rate: payment.exchange_rate,
        rate_type: payment.rate_type,
        converted_amount: payment.converted_amount,
        balance_before: currentBankBalance,
        balance_after: bankBalanceAfter,
        description: payment.description ?? `Pago #${payment.number}`,
        payment_id: payment.id,
        date: payment.date,
        created_by: userId,
      },
    });

    await prisma.bank_accounts.update({
      where: { id: payment.bank_account_id },
      data: { balance: bankBalanceAfter, updated_at: new Date() },
    });
  }

  private async createCurrentAccountEntry(payment: any, userId: string, tx?: any, entryType?: string) {
    const type = entryType ?? payment.type;

    await this.currentAccountsService.addEntry(
      {
        party_id: payment.party_id,
        party_type: payment.party_type ?? 'CUSTOMER',
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
    );
  }

  private async reverseSideEffects(payment: any, userId: string, referenceType: string) {
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

    // Revert cash box movement
    if (payment.cash_box_id) {
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
        const isOutflow = payment.type === 'PAYMENT';
        const amount = payment.amount.toNumber();
        const balanceAfter = isOutflow ? currentBalance + amount : currentBalance - amount;

        await this.prisma.cash_box_movements.create({
          data: {
            cash_box_id: payment.cash_box_id,
            type: payment.type as any,
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
        const isOutflow = payment.type === 'PAYMENT';
        const amount = payment.amount.toNumber();
        const bankBalanceAfter = isOutflow ? currentBankBalance + amount : currentBankBalance - amount;

        await this.prisma.bank_account_movements.create({
          data: {
            bank_account_id: payment.bank_account_id,
            type: payment.type as any,
            amount: payment.amount,
            currency_code: payment.currency_code,
            exchange_rate: payment.exchange_rate,
            rate_type: payment.rate_type,
            converted_amount: payment.converted_amount,
            balance_before: currentBankBalance,
            balance_after: bankBalanceAfter,
            description: `Reversión de pago #${payment.number}`,
            payment_id: payment.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.bank_accounts.update({
          where: { id: payment.bank_account_id },
          data: { balance: bankBalanceAfter, updated_at: new Date() },
        });
      }
    }

    // Revert linked checks
    if (payment.payment_method === 'CHECK') {
      await this.reverseLinkedChecks(payment, userId);
    }

    // Revert ALL current account entries for this payment
    // (could be multiple: the initial ADVANCE/PAYMENT + entries from applyAdvance)
    if (payment.party_id) {
      // Find all entries for this payment
      const entries = await this.prisma.current_account_entries.findMany({
        where: { payment_id: payment.id },
        orderBy: { created_at: 'asc' },
      });

      // Reverse each entry using CurrentAccountsService
      for (const entry of entries) {
        await this.currentAccountsService.addEntry(
          {
            party_id: payment.party_id,
            party_type: payment.party_type ?? 'CUSTOMER',
            currency_code: entry.currency_code,
            type: entry.type as any,
            amount: entry.amount.toNumber(),
            exchange_rate: entry.exchange_rate ? Number(entry.exchange_rate) : undefined,
            rate_type: entry.rate_type ?? undefined,
            description: `Reversión de pago #${payment.number}`,
            reference_type: referenceType,
            reference_id: payment.id,
            payment_id: payment.id,
            date: new Date().toISOString(),
          },
          userId,
        );
      }
    }
  }

  private async reverseLinkedChecks(payment: any, userId: string) {
    const checks = await this.prisma.checks.findMany({
      where: { payment_id: payment.id, deleted_at: null },
    });

    for (const check of checks) {
      if (check.is_own) {
        // Revertir movimiento bancario del cheque propio
        if (check.bank_account_id && check.status === 'CONFIRMED') {
          const bankAccount = await this.prisma.bank_accounts.findUnique({
            where: { id: check.bank_account_id },
          });

          if (bankAccount) {
            const currentBalance = Number(bankAccount.balance);
            const balanceAfter = currentBalance + Number(check.amount);

            await this.prisma.bank_account_movements.create({
              data: {
                bank_account_id: check.bank_account_id,
                type: 'CHECK_ISSUED',
                amount: Number(check.amount),
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
          }
        }

        // Revertir estado del cheque propio
        await this.prisma.checks.update({
          where: { id: check.id },
          data: {
            status: 'PENDING',
            confirmed_by: null,
            confirmed_at: null,
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      } else {
        // Revertir estado del cheque de tercero: devuelve el saldo aplicado
        const allocation = await this.prisma.payment_checks.findUnique({
          where: { payment_id_check_id: { payment_id: payment.id, check_id: check.id } },
        });
        const applied = allocation ? allocation.amount_applied.toNumber() : Number(check.amount);
        const currentAvailable = check.available_amount != null ? Number(check.available_amount) : 0;

        await this.prisma.checks.update({
          where: { id: check.id },
          data: {
            status: 'PENDING',
            clearing_date: null,
            available_amount: Number((currentAvailable + applied).toFixed(2)),
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
    const paymentIds = payments.map(p => p.id);
    const aggregates = paymentIds.length > 0
      ? await this.prisma.payment_documents.groupBy({
          by: ['payment_id'],
          _sum: { amount_applied: true },
          where: { payment_id: { in: paymentIds }, deleted_at: null },
        })
      : [];
    const appliedMap = new Map<string, number>(
      aggregates.map(a => [a.payment_id, a._sum.amount_applied?.toNumber() ?? 0])
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
