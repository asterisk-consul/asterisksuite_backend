import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ═══════════════════════════════════════════
  // CREATE (DRAFT — no side effects)
  // ═══════════════════════════════════════════

  async create(dto: CreatePaymentDto, userId: string) {
    if (dto.documents && dto.documents.length > 0 && !dto.party_id) {
      throw new BadRequestException('party_id es requerido cuando se aplican documentos');
    }

    const lastPayment = await this.prisma.payments.findFirst({
      where: { deleted_at: null },
      orderBy: { number: 'desc' },
    });
    const nextNumber = (lastPayment?.number ?? 0) + 1;

    const payment = await this.prisma.payments.create({
      data: {
        number: nextNumber,
        type: dto.type as any,
        date: new Date(dto.date),
        party_id: dto.party_id,
        party_type: dto.party_type,
        payment_method: dto.payment_method as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        rate_type: dto.rate_type as any,
        converted_amount: dto.converted_amount,
        exchange_note: dto.exchange_note,
        description: dto.description,
        reference: dto.reference,
        bank_account_id: dto.bank_account_id,
        cash_box_id: dto.cash_box_id,
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

    return payment;
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
      where: { payment_id: id },
    });

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
        if (pd.amount_applied.toNumber() > pending) {
          throw new BadRequestException(
            `El monto aplicado (${pd.amount_applied}) excede el saldo pendiente (${pending}) del documento ${document.number}`,
          );
        }
      }
    }

    // Apply to documents
    for (const pd of paymentDocs) {
      await this.prisma.documents.update({
        where: { id: pd.document_id },
        data: {
          paid_amount: { increment: pd.amount_applied.toNumber() },
          updated_at: new Date(),
          updated_by: userId,
        },
      });
    }

    // Create cash box movement
    if (payment.cash_box_id) {
      await this.createCashBoxMovement(payment, userId);
    }

    // Create bank account movement
    if (payment.bank_account_id) {
      await this.createBankMovement(payment, userId);
    }

    // Update current account
    if (payment.party_id) {
      await this.createCurrentAccountEntry(payment, userId);
    }

    // Update status
    return this.prisma.payments.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        confirmed_at: new Date(),
        confirmed_by: userId,
        updated_at: new Date(),
        updated_by: userId,
      },
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

  async findAll(filters?: { party_id?: string; type?: string; payment_method?: string; status?: string; user_id?: string }) {
    const where: Record<string, any> = { deleted_at: null };
    if (filters?.party_id) where.party_id = filters.party_id;
    if (filters?.type) where.type = filters.type;
    if (filters?.payment_method) where.payment_method = filters.payment_method;
    if (filters?.status) where.status = filters.status;
    if (filters?.user_id) where.created_by = filters.user_id;

    const payments = await this.prisma.payments.findMany({
      where,
      orderBy: { number: 'desc' },
      include: {
        party: { select: { id: true, name: true } },
        documents: {
          include: {
            document: { select: { id: true, number: true } },
          },
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
        bank_account: { select: { id: true, name: true } },
        documents: {
          include: {
            document: { select: { id: true, number: true, total: true, paid_amount: true } },
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

    if (dto.date) data.date = new Date(dto.date);
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

  private async createCashBoxMovement(payment: any, userId: string) {
    const balance = await this.prisma.cash_box_balances.findUnique({
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

    await this.prisma.cash_box_movements.create({
      data: {
        cash_box_id: payment.cash_box_id,
        type: payment.type as any,
        amount: payment.amount,
        currency_code: payment.currency_code,
        exchange_rate: payment.exchange_rate,
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
      await this.prisma.cash_box_balances.update({
        where: { id: balance.id },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    } else {
      await this.prisma.cash_box_balances.create({
        data: {
          cash_box_id: payment.cash_box_id,
          currency_code: payment.currency_code,
          balance: balanceAfter,
          created_by: userId,
        },
      });
    }
  }

  private async createBankMovement(payment: any, userId: string) {
    const bankAccount = await this.prisma.bank_accounts.findUnique({
      where: { id: payment.bank_account_id },
    });

    if (!bankAccount) return;

    const currentBankBalance = bankAccount.balance.toNumber();
    const isOutflow = payment.type === 'PAYMENT';
    const amount = payment.amount.toNumber();
    const bankBalanceAfter = isOutflow ? currentBankBalance - amount : currentBankBalance + amount;

    await this.prisma.bank_account_movements.create({
      data: {
        bank_account_id: payment.bank_account_id,
        type: payment.type as any,
        amount: payment.amount,
        currency_code: payment.currency_code,
        exchange_rate: payment.exchange_rate,
        balance_before: currentBankBalance,
        balance_after: bankBalanceAfter,
        description: payment.description ?? `Pago #${payment.number}`,
        payment_id: payment.id,
        date: payment.date,
        created_by: userId,
      },
    });

    await this.prisma.bank_accounts.update({
      where: { id: payment.bank_account_id },
      data: { balance: bankBalanceAfter, updated_at: new Date() },
    });
  }

  private async createCurrentAccountEntry(payment: any, userId: string) {
    let currentAccount = await this.prisma.current_accounts.findUnique({
      where: {
        party_id_currency_code: {
          party_id: payment.party_id,
          currency_code: payment.currency_code,
        },
      },
    });

    if (!currentAccount) {
      currentAccount = await this.prisma.current_accounts.create({
        data: {
          party_id: payment.party_id,
          party_type: payment.party_type ?? 'CUSTOMER',
          currency_code: payment.currency_code,
          balance: 0,
          created_by: userId,
        },
      });
    }

    const currentBalance = currentAccount.balance.toNumber();
    const isDebit = payment.type === 'PAYMENT';
    const amount = payment.amount.toNumber();
    const balanceAfter = isDebit ? currentBalance - amount : currentBalance + amount;

    await this.prisma.current_account_entries.create({
      data: {
        current_account_id: currentAccount.id,
        type: payment.type as any,
        amount: payment.amount,
        currency_code: payment.currency_code,
        exchange_rate: payment.exchange_rate,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: payment.description ?? `Pago #${payment.number}`,
        reference_type: 'payment',
        reference_id: payment.id,
        payment_id: payment.id,
        date: payment.date,
        created_by: userId,
      },
    });

    await this.prisma.current_accounts.update({
      where: { id: currentAccount.id },
      data: { balance: balanceAfter, updated_at: new Date() },
    });
  }

  private async reverseSideEffects(payment: any, userId: string, referenceType: string) {
    // Revert documents
    const paymentDocs = await this.prisma.payment_documents.findMany({
      where: { payment_id: payment.id },
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

    // Revert bank movement
    if (payment.bank_account_id) {
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

    // Revert current account entry
    if (payment.party_id) {
      const currentAccount = await this.prisma.current_accounts.findUnique({
        where: {
          party_id_currency_code: {
            party_id: payment.party_id,
            currency_code: payment.currency_code,
          },
        },
      });

      if (currentAccount) {
        const currentBalance = currentAccount.balance.toNumber();
        const isDebit = payment.type === 'PAYMENT';
        const amount = payment.amount.toNumber();
        const balanceAfter = isDebit ? currentBalance + amount : currentBalance - amount;

        await this.prisma.current_account_entries.create({
          data: {
            current_account_id: currentAccount.id,
            type: payment.type as any,
            amount: payment.amount,
            currency_code: payment.currency_code,
            exchange_rate: payment.exchange_rate,
            balance_before: currentBalance,
            balance_after: balanceAfter,
            description: `Reversión de pago #${payment.number}`,
            reference_type: referenceType,
            reference_id: payment.id,
            payment_id: payment.id,
            date: new Date(),
            created_by: userId,
          },
        });

        await this.prisma.current_accounts.update({
          where: { id: currentAccount.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      }
    }
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
