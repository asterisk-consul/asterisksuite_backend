import { Injectable, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';
import { ConfirmHrValeDto } from './dto/confirm-hr-vale.dto';
import { parseLocalDateTime } from '@/common/utils/dates';

@Injectable()
export class HrService {
  private readonly logger = new Logger(HrService.name);

  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /** Calcula la comisión acumulada de una OV y descuenta liquidaciones anteriores. */
  private async getCommissionMetrics(
    documentId: string,
    ovSubtotal: number,
    ovTotal: number,
    commissionRate: number,
    commissionBase?: string | null,
    asOf?: Date,
  ) {
    const document = await this.prisma.documents.findUnique({
      where: { id: documentId },
      select: { commercial_operation_id: true },
    });

    let baseAmount = 0;
    if (commissionBase === 'PAID') {
      const applications = await this.prisma.payment_documents.findMany({
        where: {
          deleted_at: null,
          payment: {
            deleted_at: null,
            status: { in: ['CONFIRMED', 'PAID'] },
            ...(asOf ? { date: { lte: asOf } } : {}),
          },
          OR: document?.commercial_operation_id
            ? [{ document: { commercial_operation_id: document.commercial_operation_id } }]
            : [{ document_id: documentId }, { document: { parent_document_id: documentId } }],
        },
        select: { amount_applied: true },
      });
      const paidGross = applications.reduce((sum, item) => sum + Number(item.amount_applied), 0);
      baseAmount = ovTotal > 0 ? ovSubtotal * Math.min(paidGross / ovTotal, 1) : 0;
    } else {
      const invoices = await this.prisma.documents.findMany({
        where: {
          parent_document_id: documentId,
          deleted_at: null,
          status: { in: [1, 2] },
          ...(asOf ? { date: { lte: asOf } } : {}),
          document_types: { category: 'INVOICE' },
        },
        select: { subtotal: true },
      });
      baseAmount = Math.min(ovSubtotal, invoices.reduce((sum, invoice) => sum + Number(invoice.subtotal), 0));
    }

    const details = await this.prisma.hr_vale_commission_details.findMany({
      where: {
        document_id: documentId,
        hr_vale: { deleted_at: null, status: { not: 'CANCELLED' } },
      },
      select: { commission_amount: true },
    });
    const settledAmount = details.reduce((sum, detail) => sum + Number(detail.commission_amount), 0);
    const accruedAmount = baseAmount * commissionRate / 100;

    return {
      baseAmount,
      accruedAmount,
      settledAmount,
      pendingAmount: Math.max(0, accruedAmount - settledAmount),
    };
  }

  // ══════════════════════════════════════════════════════════
  // VALES
  // ══════════════════════════════════════════════════════════

  async createVale(dto: CreateHrValeDto, userId: string) {
    const party = await this.prisma.business_parties.findUnique({
      where: { id: dto.party_id },
    });

    if (!party) {
      throw new NotFoundException('Persona no encontrada');
    }

    const lastVale = await this.prisma.hr_vales.findFirst({
      where: { party_id: dto.party_id },
      orderBy: { number: 'desc' },
    });

    const number = (lastVale?.number ?? 0) + 1;

    return this.prisma.hr_vales.create({
      data: {
        number,
        party_id: dto.party_id,
        party_type: dto.party_type,
        type: dto.type as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        rate_type: dto.rate_type as any ?? 'OFFICIAL',
        converted_amount: dto.converted_amount,
        date: parseLocalDateTime(dto.date),
        description: dto.description,
        status: 'DRAFT',
        created_by: userId,
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });
  }

  async findAllVales(params?: {
    party_id?: string;
    party_type?: string;
    status?: string;
    type?: string;
    user_id?: string;
  }) {
    const where: any = { deleted_at: null };

    if (params?.party_id) where.party_id = params.party_id;
    if (params?.party_type) where.party_type = params.party_type;
    if (params?.status) where.status = params.status;
    if (params?.type) where.type = params.type;
    if (params?.user_id) where.created_by = params.user_id;

    const vales = await this.prisma.hr_vales.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
        commission_details: {
          include: {
            document: {
              select: { id: true, number: true, date: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    // Resolver created_by a nombre de usuario
    const userIds = [...new Set(vales.map(v => v.created_by).filter(Boolean))] as string[];
    const users = userIds.length > 0
      ? await this.db.getDefaultClient().users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true },
        })
      : [];
    const userMap = new Map(users.map(u => [u.id, u.name]));

    return vales.map(v => ({
      ...v,
      created_by_name: v.created_by ? (userMap.get(v.created_by) ?? null) : null,
    }));
  }

  async findOneVale(id: string) {
    const vale = await this.prisma.hr_vales.findUnique({
      where: { id },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
        commission_details: {
          include: {
            document: {
              select: { id: true, number: true, date: true },
            },
          },
        },
      },
    });

    if (!vale) {
      throw new NotFoundException('Vale no encontrado');
    }

    return vale;
  }

  async confirmVale(id: string, userId: string, treasury?: ConfirmHrValeDto) {
    const vale = await this.findOneVale(id);

    if (vale.status !== 'DRAFT') {
      throw new BadRequestException('Solo se pueden confirmar vales en borrador');
    }

    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);
    const requiresTreasury = vale.party_type === 'PARTNER';
    if (requiresTreasury && (!treasury?.treasury_target_type || !treasury.treasury_target_id)) {
      throw new BadRequestException('Seleccioná una caja o cuenta bancaria para registrar el movimiento del socio');
    }

    return this.prisma.$transaction(async (tx) => {

    let account = await tx.hr_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: vale.party_id,
          currency_code: vale.currency_code,
        },
      },
    });

    if (!account) {
      account = await tx.hr_accounts.create({
        data: {
          party_id: vale.party_id,
          party_type: vale.party_type,
          currency_code: vale.currency_code,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = account.balance.toNumber();
    const amount = vale.amount.toNumber();
    const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

    await tx.hr_account_entries.create({
      data: {
        hr_account_id: account.id,
        type: isDebit ? 'VALE_DEBIT' : 'VALE_CREDIT',
        amount,
        currency_code: vale.currency_code,
        exchange_rate: vale.exchange_rate,
        rate_type: vale.rate_type,
        converted_amount: vale.converted_amount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: `Vale #${vale.number} - ${vale.type}`,
        reference_type: 'hr_vale',
        reference_id: vale.id,
        date: new Date(),
        created_by: userId,
      },
    });

    await tx.hr_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    // Crear documento VALE + current_account_entry
    await this.createValeDocument(vale, userId, tx, requiresTreasury);

    if (requiresTreasury) {
      await this.createPartnerTreasuryMovement(vale, treasury!, isDebit, userId, tx);
    }

    return tx.hr_vales.update({
      where: { id },
      data: {
        status: requiresTreasury ? 'PAID' : 'CONFIRMED',
        paid_at: requiresTreasury ? new Date() : null,
        confirmed_at: new Date(),
        confirmed_by: userId,
        updated_at: new Date(),
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });
    });
  }

  private async createPartnerTreasuryMovement(
    vale: any,
    treasury: ConfirmHrValeDto,
    isOutflow: boolean,
    userId: string,
    prisma: any,
  ) {
    const amount = vale.amount.toNumber();
    const description = `${vale.type === 'APORTE' ? 'Aporte' : 'Retiro'} de socio · Vale #${vale.number}${vale.description ? ` · ${vale.description}` : ''}`;
    const commonData = {
      type: isOutflow ? 'PAYMENT' : 'COLLECTION',
      amount: vale.amount,
      currency_code: vale.currency_code,
      exchange_rate: vale.exchange_rate,
      rate_type: vale.rate_type,
      converted_amount: vale.converted_amount,
      description: description.substring(0, 255),
      reference_type: 'hr_vale',
      reference_id: vale.id,
      date: vale.date,
      created_by: userId,
    };

    if (treasury.treasury_target_type === 'CASH_BOX') {
      const cashBox = await prisma.cash_boxes.findFirst({
        where: { id: treasury.treasury_target_id, active: true, deleted_at: null },
      });
      if (!cashBox) throw new BadRequestException('Caja no encontrada o inactiva');
      if (cashBox.currency_code !== vale.currency_code) {
        throw new BadRequestException(`La caja opera en ${cashBox.currency_code} y el vale está expresado en ${vale.currency_code}`);
      }
      if (!cashBox.current_session_id) {
        throw new BadRequestException('La caja seleccionada no tiene una sesión abierta');
      }

      const balance = await prisma.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: cashBox.id, currency_code: vale.currency_code } },
      });
      const before = balance?.balance.toNumber() ?? 0;
      const after = isOutflow ? before - amount : before + amount;
      if (isOutflow && after < 0) throw new BadRequestException('Saldo insuficiente en la caja');

      await prisma.cash_box_movements.create({
        data: { ...commonData, cash_box_id: cashBox.id, session_id: cashBox.current_session_id, balance_before: before, balance_after: after },
      });
      if (balance) {
        await prisma.cash_box_balances.update({ where: { id: balance.id }, data: { balance: after } });
      } else {
        await prisma.cash_box_balances.create({ data: { cash_box_id: cashBox.id, currency_code: vale.currency_code, balance: after, created_by: userId } });
      }
      await prisma.cash_box_sessions.update({
        where: { id: cashBox.current_session_id },
        data: {
          movement_count: { increment: 1 },
          ...(isOutflow ? { total_expenses: { increment: amount } } : { total_income: { increment: amount } }),
        },
      });
      return;
    }

    const bank = await prisma.bank_accounts.findFirst({
      where: { id: treasury.treasury_target_id, active: true, deleted_at: null },
    });
    if (!bank) throw new BadRequestException('Cuenta bancaria no encontrada o inactiva');
    if (bank.currency_code !== vale.currency_code) {
      throw new BadRequestException(`La cuenta bancaria opera en ${bank.currency_code} y el vale está expresado en ${vale.currency_code}`);
    }
    const before = bank.balance.toNumber();
    const after = isOutflow ? before - amount : before + amount;
    if (isOutflow && after < 0) throw new BadRequestException('Saldo insuficiente en la cuenta bancaria');
    await prisma.bank_account_movements.create({
      data: { ...commonData, bank_account_id: bank.id, balance_before: before, balance_after: after },
    });
    await prisma.bank_accounts.update({ where: { id: bank.id }, data: { balance: after } });
  }

  async cancelVale(id: string, userId: string) {
    const vale = await this.findOneVale(id);

    if (vale.status === 'CANCELLED') {
      throw new BadRequestException('El vale ya está anulado');
    }

    if (vale.status === 'CONFIRMED' || vale.status === 'PAID') {
    // SUELDO, ADELANTO, EXTRAS = empleado recibe dinero (crédito)
    // RETIRO, REEMBOLSO, PRESTAMO = socio retira/devuelve (débito)
    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);

      // Revertir hr_account_entries
      const account = await this.prisma.hr_accounts.findUnique({
        where: {
          party_id_currency_code: {
            party_id: vale.party_id,
            currency_code: vale.currency_code,
          },
        },
      });

      if (account) {
        const currentBalance = account.balance.toNumber();
        const amount = vale.amount.toNumber();
        const balanceAfter = isDebit ? currentBalance + amount : currentBalance - amount;

        await this.prisma.hr_account_entries.create({
          data: {
            hr_account_id: account.id,
            type: 'ADJUSTMENT',
            amount,
            currency_code: vale.currency_code,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Anulación Vale #${vale.number}`,
            reference_type: 'hr_vale',
            reference_id: vale.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.hr_accounts.update({
          where: { id: account.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      }

      // Revertir documento y current_account_entries
      await this.reverseValeDocument(vale, userId);
      await this.reversePartnerTreasuryMovement(vale, userId);
    }

    return this.prisma.hr_vales.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        updated_at: new Date(),
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  private async reversePartnerTreasuryMovement(vale: any, userId: string) {
    if (vale.party_type !== 'PARTNER') return;
    const [cashMovement, bankMovement] = await Promise.all([
      this.prisma.cash_box_movements.findFirst({ where: { reference_type: 'hr_vale', reference_id: vale.id, deleted_at: null } }),
      this.prisma.bank_account_movements.findFirst({ where: { reference_type: 'hr_vale', reference_id: vale.id, deleted_at: null } }),
    ]);
    const original = cashMovement ?? bankMovement;
    if (!original) return; // Vale histórico: nunca impactó Tesorería.

    const originalWasOutflow = original.type === 'PAYMENT';
    const amount = original.amount.toNumber();
    const reversalType = originalWasOutflow ? 'COLLECTION' : 'PAYMENT';
    const description = `Anulación Vale #${vale.number}`;

    if (cashMovement) {
      const balance = await this.prisma.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: cashMovement.cash_box_id, currency_code: cashMovement.currency_code } },
      });
      const before = balance?.balance.toNumber() ?? 0;
      const after = originalWasOutflow ? before + amount : before - amount;
      await this.prisma.cash_box_movements.create({
        data: {
          cash_box_id: cashMovement.cash_box_id,
          session_id: cashMovement.session_id,
          type: reversalType,
          amount: cashMovement.amount,
          currency_code: cashMovement.currency_code,
          exchange_rate: cashMovement.exchange_rate,
          rate_type: cashMovement.rate_type,
          converted_amount: cashMovement.converted_amount,
          balance_before: before,
          balance_after: after,
          description,
          reference_type: 'hr_vale_cancellation',
          reference_id: vale.id,
          date: new Date(),
          created_by: userId,
        },
      });
      if (balance) await this.prisma.cash_box_balances.update({ where: { id: balance.id }, data: { balance: after } });
      if (cashMovement.session_id) {
        await this.prisma.cash_box_sessions.update({
          where: { id: cashMovement.session_id },
          data: {
            movement_count: { increment: 1 },
            ...(originalWasOutflow ? { total_income: { increment: amount } } : { total_expenses: { increment: amount } }),
          },
        });
      }
      return;
    }

    if (bankMovement) {
      const bank = await this.prisma.bank_accounts.findUnique({ where: { id: bankMovement.bank_account_id } });
      if (!bank) return;
      const before = bank.balance.toNumber();
      const after = originalWasOutflow ? before + amount : before - amount;
      await this.prisma.bank_account_movements.create({
        data: {
          bank_account_id: bank.id,
          type: reversalType,
          amount: bankMovement.amount,
          currency_code: bankMovement.currency_code,
          exchange_rate: bankMovement.exchange_rate,
          rate_type: bankMovement.rate_type,
          converted_amount: bankMovement.converted_amount,
          balance_before: before,
          balance_after: after,
          description,
          reference_type: 'hr_vale_cancellation',
          reference_id: vale.id,
          date: new Date(),
          created_by: userId,
        },
      });
      await this.prisma.bank_accounts.update({ where: { id: bank.id }, data: { balance: after } });
    }
  }

  // ══════════════════════════════════════════════════════════
  // CREAR DOCUMENTO VALE + CURRENT ACCOUNT ENTRY
  // ══════════════════════════════════════════════════════════

  private async createValeDocument(vale: any, userId: string, tx?: any, settledDirectly = false) {
    const prisma = tx || this.prisma;
    // Buscar document_type con category = 'VALE'
    const valeDocType = await prisma.document_types.findFirst({
      where: { category: 'VALE', active: true },
    });

    if (!valeDocType) {
      this.logger.warn('No se encontró document_type con category VALE');
      return null;
    }

    // Buscar sequence para numeración
    let nextNumber = 1;
    let sequenceId: string | null = null;
    if (valeDocType.document_sequence_id) {
      const sequence = await prisma.document_sequences.findUnique({
        where: { id: valeDocType.document_sequence_id },
      });
      if (sequence) {
        sequenceId = sequence.id;
        nextNumber = (sequence.current_number ?? 0) + 1;
        await prisma.document_sequences.update({
          where: { id: sequence.id },
          data: { current_number: nextNumber },
        });
      }
    } else {
      // Sin secuencia: usar max number + 1
      this.logger.warn(`VALE sin secuencia asociada. Usando numeración automática.`);
      const lastDoc = await prisma.documents.findFirst({
        where: { document_type_id: valeDocType.id },
        orderBy: { number: 'desc' },
        select: { number: true }
      });
      nextNumber = (lastDoc?.number ?? 0) + 1;
    }

    // Crear documento
    const doc = await prisma.documents.create({
      data: {
        document_type_id: valeDocType.id,
        document_sequence_id: sequenceId,
        number: nextNumber,
        party_id: vale.party_id,
        currency_code: vale.currency_code,
        total: vale.amount,
        paid_amount: settledDirectly ? vale.amount : 0,
        status: 2, // CONFIRMED
        date: vale.date,
        descrip: `Vale #${vale.number}`.substring(0, 50),
        ref: vale.type,
        created_by: userId,
      },
    });

    this.logger.log(`Documento VALE #${nextNumber} creado para vale #${vale.number}`);

    // Crear entrada en current_accounts
    if (!settledDirectly) {
      await this.createCurrentAccountEntry(vale, doc.id, userId, prisma);
    }

    return doc;
  }

  // ══════════════════════════════════════════════════════════
  // CREAR CURRENT ACCOUNT ENTRY
  // ══════════════════════════════════════════════════════════

  private async createCurrentAccountEntry(vale: any, documentId: string, userId: string, tx?: any) {
    const prisma = tx || this.prisma;
    // Buscar o crear cuenta corriente (una por party, sin currency_code)
    let account = await prisma.current_accounts.findUnique({
      where: { party_id: vale.party_id },
    });

    if (!account) {
      account = await prisma.current_accounts.create({
        data: {
          party_id: vale.party_id,
          party_type: vale.party_type,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = account.balance.toNumber();
    const amount = vale.amount.toNumber();
    // RETIRO, REEMBOLSO, PRESTAMO = socio le debe a la empresa → balance baja (débito)
    // SUELDO, ADELANTO, EXTRAS, APORTE = empresa le debe / socio pone → balance sube (crédito)
    const isDebit = ['RETIRO', 'REEMBOLSO', 'PRESTAMO'].includes(vale.type);
    const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

    await prisma.current_account_entries.create({
      data: {
        current_account_id: account.id,
        type: isDebit ? 'COLLECTION' : 'PAYMENT',
        amount,
        currency_code: vale.currency_code,
        exchange_rate: vale.exchange_rate,
        rate_type: vale.rate_type,
        converted_amount: vale.converted_amount,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: `Vale #${vale.number} - ${vale.description || vale.type}`,
        reference_type: 'document',
        reference_id: documentId,
        date: vale.date,
        created_by: userId,
      },
    });

    await prisma.current_accounts.update({
      where: { id: account.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });

    this.logger.log(`Current account entry creada para vale #${vale.number}`);
  }

  // ══════════════════════════════════════════════════════════
  // REVERTIR DOCUMENTO VALE
  // ══════════════════════════════════════════════════════════

  private async reverseValeDocument(vale: any, userId: string) {
    // Buscar el documento VALE asociado al vale
    const doc = await this.prisma.documents.findFirst({
      where: {
        descrip: { contains: `Vale #${vale.number}` },
        party_id: vale.party_id,
        deleted_at: null,
      },
    });

    if (!doc) {
      this.logger.warn(`No se encontró documento VALE para revertir vale #${vale.number}`);
      return;
    }

    // Revertir current_account_entries
    const entry = await this.prisma.current_account_entries.findFirst({
      where: {
        reference_id: doc.id,
        reference_type: 'document',
        deleted_at: null,
      },
    });

    if (entry) {
      const account = await this.prisma.current_accounts.findUnique({
        where: { id: entry.current_account_id },
      });

      if (account) {
        const currentBalance = account.balance.toNumber();
        const amount = entry.amount.toNumber();
        // Revertir: si era crédito (RETIRO), ahora es débito y viceversa
        const isDebit = entry.balance_after > entry.balance_before;
        const balanceAfter = isDebit ? currentBalance + amount : currentBalance - amount;

        await this.prisma.current_account_entries.create({
          data: {
            current_account_id: account.id,
            type: 'CREDIT_NOTE',
            amount,
            currency_code: doc.currency_code,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Reversión Vale #${vale.number}`,
            reference_type: 'document_reversal',
            reference_id: doc.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.current_accounts.update({
          where: { id: account.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      }
    }

    // Soft-delete el documento
    await this.prisma.documents.update({
      where: { id: doc.id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });

    this.logger.log(`Documento VALE #${doc.number} revertido para vale #${vale.number}`);
  }

  // ══════════════════════════════════════════════════════════
  // CUENTAS CORRIENTES RRHH
  // ══════════════════════════════════════════════════════════

  async getHrAccounts(params?: { party_type?: string }) {
    const where: any = { deleted_at: null, active: true };

    if (params?.party_type) where.party_type = params.party_type;

    return this.prisma.hr_accounts.findMany({
      where,
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { balance: 'desc' },
    });
  }

  async getHrAccountEntries(hrAccountId: string) {
    const account = await this.prisma.hr_accounts.findUnique({
      where: { id: hrAccountId },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });

    if (!account) {
      throw new NotFoundException('Cuenta corriente no encontrada');
    }

    const entries = await this.prisma.hr_account_entries.findMany({
      where: { hr_account_id: hrAccountId, deleted_at: null },
      orderBy: { date: 'desc' },
    });

    return { account, entries };
  }

  async getHrBalance(partyId: string, currencyCode: string) {
    const account = await this.prisma.hr_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: partyId,
          currency_code: currencyCode,
        },
      },
    });

    return { balance: account?.balance ?? 0 };
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE COMISIONES
  // ══════════════════════════════════════════════════════════

  async getCommissionsReport(month: string, sellerId?: string) {
    // month format: "YYYY-MM"
    const [year, monthNum] = month.split('-').map(Number);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Las comisiones se devengan por facturación/cobro, aunque la OV sea anterior al mes.
    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: sellerId ? sellerId : { not: null },
        commission_rate: { not: null },
        document: {
          deleted_at: null,
        },
      },
      include: {
        seller: {
          select: { id: true, first_name: true, last_name: true, party_id: true, commission_base: true },
        },
        document: {
          select: { id: true, number: true, subtotal: true, total: true, date: true, currency_code: true },
        },
      },
      orderBy: { document: { date: 'asc' } },
    });

    // Group by seller
    const sellerMap = new Map<string, {
      seller_id: string;
      seller_name: string;
      party_id: string | null;
      total_ventas: number;
      total_comisiones: number;
      cantidad_ov: number;
      items: {
        document_id: string;
        ov_number: number;
        subtotal: number;
        commission_rate: number;
        commission_amount: number;
        commission_base: string;
        sold_subtotal: number;
        settled_amount: number;
        date: Date;
      }[];
    }>();

    for (const ov of ordenes) {
      const key = ov.seller_id!;
      if (!sellerMap.has(key)) {
        const seller = ov.seller!;
        sellerMap.set(key, {
          seller_id: key,
          seller_name: `${seller.first_name} ${seller.last_name}`,
          party_id: seller.party_id,
          total_ventas: 0,
          total_comisiones: 0,
          cantidad_ov: 0,
          items: [],
        });
      }

      const entry = sellerMap.get(key)!;
      const subtotal = Number(ov.document.subtotal);
      const total = Number(ov.document.total);
      const rate = Number(ov.commission_rate);
      const base = ov.commission_base ?? ov.seller?.commission_base ?? 'INVOICED';
      const metrics = await this.getCommissionMetrics(ov.document_id, subtotal, total, rate, base, endDate);
      if (metrics.pendingAmount <= 0.005) continue;

      entry.total_ventas += metrics.baseAmount;
      entry.total_comisiones += metrics.pendingAmount;
      entry.cantidad_ov += 1;
      entry.items.push({
        document_id: ov.document_id,
        ov_number: ov.document.number,
        subtotal: metrics.baseAmount,
        commission_rate: rate,
        commission_amount: metrics.pendingAmount,
        commission_base: base,
        sold_subtotal: subtotal,
        settled_amount: metrics.settledAmount,
        date: ov.document.date,
      });
    }

    const sellers = Array.from(sellerMap.values()).filter(seller => seller.cantidad_ov > 0);
    return {
      month,
      sellers,
      total_ventas: sellers.reduce((s, v) => s + v.total_ventas, 0),
      total_comisiones: sellers.reduce((s, v) => s + v.total_comisiones, 0),
      cantidad_ov: sellers.reduce((s, v) => s + v.cantidad_ov, 0),
    };
  }

  // ══════════════════════════════════════════════════════════
  // GENERAR VALE EXTRAS POR COMISIONES
  // ══════════════════════════════════════════════════════════

  async generateCommissionVale(sellerId: string, month: string, userId: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    // Una OV puede liquidarse en varios vales a medida que factura o cobra.
    const ordenes = await this.prisma.orden_venta_documents.findMany({
      where: {
        seller_id: sellerId,
        commission_rate: { not: null },
        document: { deleted_at: null },
      },
      include: {
        seller: {
          select: { id: true, first_name: true, last_name: true, party_id: true, commission_base: true },
        },
        document: {
          select: { id: true, number: true, subtotal: true, total: true, date: true, currency_code: true },
        },
      },
    });

    const commissionRows: Array<{ ov: typeof ordenes[number]; base: string; baseAmount: number; pendingAmount: number }> = [];
    for (const ov of ordenes) {
      const rate = Number(ov.commission_rate);
      const base = ov.commission_base ?? ov.seller?.commission_base ?? 'INVOICED';
      const metrics = await this.getCommissionMetrics(
        ov.document_id,
        Number(ov.document.subtotal),
        Number(ov.document.total),
        rate,
        base,
        endDate,
      );
      if (metrics.pendingAmount > 0.005) {
        commissionRows.push({ ov, base, baseAmount: metrics.baseAmount, pendingAmount: metrics.pendingAmount });
      }
    }

    if (!commissionRows.length) throw new BadRequestException('No hay comisiones pendientes para este vendedor en este mes');

    const seller = commissionRows[0].ov.seller!;
    const partyId = seller.party_id;

    if (!partyId) {
      throw new BadRequestException('El vendedor no tiene una party asociada');
    }

    // Calculate total
    const totalCommission = commissionRows.reduce((sum, row) => sum + row.pendingAmount, 0);

    // Create vale
    const lastVale = await this.prisma.hr_vales.findFirst({
      where: { party_id: partyId },
      orderBy: { number: 'desc' },
    });
    const valeNumber = (lastVale?.number ?? 0) + 1;

    const [yearStr, monthStr] = month.split('-');
    const valeDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1, 1);

    const vale = await this.prisma.hr_vales.create({
      data: {
        number: valeNumber,
        party_id: partyId,
        party_type: 'EMPLOYEE',
        type: 'EXTRAS',
        amount: totalCommission,
        currency_code: commissionRows[0].ov.document.currency_code ?? 'ARS',
        date: valeDate,
        description: `Comisiones ${month} - ${seller.first_name} ${seller.last_name}`,
        status: 'DRAFT',
        created_by: userId,
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
    });

    // Create commission detail lines
    for (const row of commissionRows) {
      const ov = row.ov;
      const rate = Number(ov.commission_rate);

      await this.prisma.hr_vale_commission_details.create({
        data: {
          hr_vale_id: vale.id,
          document_id: ov.document_id,
          seller_id: sellerId,
          subtotal: row.baseAmount,
          commission_rate: rate,
          commission_amount: row.pendingAmount,
          commission_base: row.base,
          date: ov.document.date,
        },
      });

      // Conserva la última liquidación como dato informativo; no bloquea futuras parciales.
      await this.prisma.orden_venta_documents.update({
        where: { document_id: ov.document_id },
        data: {
          commission_settled_at: new Date(),
          commission_vale_id: vale.id,
        },
      });
    }

    this.logger.log(`Vale EXTRAS #${valeNumber} generado para ${seller.first_name} ${seller.last_name} - Total: ${totalCommission}`);

    return vale;
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE SOCIO
  // ══════════════════════════════════════════════════════════

  async getPartnerReportOptions() {
    const partners = await this.prisma.partners.findMany({
      where: { deleted_at: null, is_active: true, party_id: { not: null } },
      select: {
        id: true,
        party_id: true,
        first_name: true,
        last_name: true,
        document_type: true,
        document_number: true,
        share_percentage: true,
        party: { select: { name: true } },
      },
      orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
    });

    return partners.map(partner => ({
      id: partner.id,
      party_id: partner.party_id,
      name: partner.party?.name ?? `${partner.first_name} ${partner.last_name}`.trim(),
      document_type: partner.document_type,
      document_number: partner.document_number,
      share_percentage: partner.share_percentage?.toNumber() ?? null,
    }));
  }

  async getPartnerReport(partyId: string, userId: string, companyRole?: string) {
    // 1. Validar acceso: socio solo ve su propio reporte
    if (companyRole === 'USER') {
      const userPartners = await this.db.getDefaultClient().partners.findMany({
        where: { user_id: userId, deleted_at: null },
        select: { party_id: true },
      });
      const userPartyIds = userPartners.map(p => p.party_id).filter(Boolean);
      if (!userPartyIds.includes(partyId)) {
        throw new ForbiddenException('No tenés acceso al reporte de este socio');
      }
    }

    // 2. Datos del socio
    const partner = await this.prisma.partners.findFirst({
      where: { party_id: partyId, deleted_at: null },
      include: {
        party: {
          select: { id: true, name: true, tax_id: true },
        },
      },
    });

    if (!partner) {
      throw new NotFoundException('Socio no encontrado');
    }

    // 3. Vales del socio
    const vales = await this.prisma.hr_vales.findMany({
      where: {
        party_id: partyId,
        party_type: 'PARTNER',
        status: { in: ['CONFIRMED', 'PAID'] },
        deleted_at: null,
      },
      include: {
        party: { select: { id: true, name: true, tax_id: true } },
      },
      orderBy: { date: 'desc' },
    });

    // 4. Saldos por moneda
    const accounts = await this.prisma.hr_accounts.findMany({
      where: { party_id: partyId, active: true },
    });

    const balances = accounts.map(a => ({
      currency_code: a.currency_code,
      balance: a.balance.toNumber(),
      converted_balance: a.converted_balance?.toNumber() ?? null,
    }));

    // 5. Resumen por tipo
    const emptyCurrencySummary = () => ({
      total_aportes: 0,
      total_retiros: 0,
      total_reembolsos: 0,
      total_prestamos: 0,
      saldo_neto: 0,
    });
    const summary = {
      by_currency: {
        ARS: emptyCurrencySummary(),
        USD: emptyCurrencySummary(),
      } as Record<string, ReturnType<typeof emptyCurrencySummary>>,
      saldo_neto_ars: 0,
      saldo_neto_usd: 0,
    };

    for (const vale of vales) {
      if (!['CONFIRMED', 'PAID'].includes(vale.status)) continue;
      const amount = vale.amount.toNumber();
      const rate = vale.exchange_rate?.toNumber() ?? 0;
      const amounts = {
        ARS: vale.currency_code === 'ARS' ? amount : (rate > 0 ? amount * rate : 0),
        USD: vale.currency_code === 'USD' ? amount : (rate > 0 ? amount / rate : 0),
      };
      for (const currency of ['ARS', 'USD'] as const) {
        const currencySummary = summary.by_currency[currency];
        const convertedAmount = amounts[currency];
        if (vale.type === 'APORTE') currencySummary.total_aportes += convertedAmount;
        if (vale.type === 'RETIRO') currencySummary.total_retiros += convertedAmount;
        if (vale.type === 'REEMBOLSO') currencySummary.total_reembolsos += convertedAmount;
        if (vale.type === 'PRESTAMO') currencySummary.total_prestamos += convertedAmount;
        currencySummary.saldo_neto += vale.type === 'APORTE' ? convertedAmount : -convertedAmount;
      }
    }

    // Saldos por moneda
    for (const b of balances) {
      if (b.currency_code === 'ARS') summary.saldo_neto_ars = b.balance;
      if (b.currency_code === 'USD') summary.saldo_neto_usd = b.balance;
    }

    // 6. Evolución de saldos (agrupada por fecha)
    const evolutionMap = new Map<string, { balance_ars: number; balance_usd: number }>();
    let runningArs = 0;
    let runningUsd = 0;
    const confirmedVales = [...vales]
      .filter(vale => ['CONFIRMED', 'PAID'].includes(vale.status))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const vale of confirmedVales) {
      const amount = vale.amount.toNumber();
      const rate = vale.exchange_rate?.toNumber() ?? 0;
      const ars = vale.currency_code === 'ARS' ? amount : (rate > 0 ? amount * rate : 0);
      const usd = vale.currency_code === 'USD' ? amount : (rate > 0 ? amount / rate : 0);
      const direction = vale.type === 'APORTE' ? 1 : -1;
      runningArs += ars * direction;
      runningUsd += usd * direction;
      const dateKey = vale.date.toISOString().split('T')[0];
      evolutionMap.set(dateKey, { balance_ars: runningArs, balance_usd: runningUsd });
    }

    const evolution = Array.from(evolutionMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    return {
      partner: {
        id: partner.id,
        name: partner.party?.name ?? `${partner.first_name} ${partner.last_name}`,
        document_type: partner.document_type,
        document_number: partner.document_number,
        share_percentage: partner.share_percentage?.toNumber() ?? null,
        capital_contributed: partner.capital_contributed?.toNumber() ?? null,
        is_active: partner.is_active,
      },
      balances,
      summary,
      vales: vales.map(v => ({
        ...v,
        amount: v.amount.toNumber(),
        exchange_rate: v.exchange_rate?.toNumber() ?? null,
        converted_amount: v.converted_amount?.toNumber() ?? null,
      })),
      evolution,
    };
  }
}
