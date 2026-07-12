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

  async create(dto: CreatePaymentDto, userId: string) {
    // Validar que si hay documentos, party_id esté presente
    if (dto.documents && dto.documents.length > 0 && !dto.party_id) {
      throw new BadRequestException('party_id es requerido cuando se aplican documentos');
    }

    // Validar que la suma de amount_applied coincida con el amount del pago
    if (dto.documents && dto.documents.length > 0) {
      const totalApplied = dto.documents.reduce((sum, d) => sum + d.amount_applied, 0);
      if (Math.abs(totalApplied - dto.amount) > 0.01) {
        throw new BadRequestException(
          `La suma de los montos aplicados (${totalApplied}) no coincide con el monto del pago (${dto.amount})`,
        );
      }
    }

    // Validar saldo pendiente de documentos
    if (dto.documents && dto.documents.length > 0) {
      for (const doc of dto.documents) {
        const document = await this.prisma.documents.findUnique({
          where: { id: doc.document_id },
        });
        if (!document) {
          throw new NotFoundException(`Documento ${doc.document_id} no encontrado`);
        }

        const pending = document.total.toNumber() - document.paid_amount.toNumber();
        if (pending <= 0) {
          throw new BadRequestException(
            `El documento ${document.number} ya está saldado (total: ${document.total}, pagado: ${document.paid_amount})`,
          );
        }
        if (doc.amount_applied > pending) {
          throw new BadRequestException(
            `El monto aplicado (${doc.amount_applied}) excede el saldo pendiente (${pending}) del documento ${document.number}`,
          );
        }
      }
    }

    // Obtener próximo número secuencial
    const lastPayment = await this.prisma.payments.findFirst({
      where: { deleted_at: null },
      orderBy: { number: 'desc' },
    });
    const nextNumber = (lastPayment?.number ?? 0) + 1;

    // Crear pago
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
        status: dto.status ?? 1,
        created_by: userId,
      },
    });

    // Aplicar a documentos
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

        // Actualizar paid_amount del documento
        await this.prisma.documents.update({
          where: { id: doc.document_id },
          data: {
            paid_amount: { increment: doc.amount_applied },
            updated_at: new Date(),
            updated_by: userId,
          },
        });
      }
    }

    // Crear movimiento en caja
    if (dto.cash_box_id) {
      const balance = await this.prisma.cash_box_balances.findUnique({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: dto.cash_box_id,
            currency_code: dto.currency_code,
          },
        },
      });

      const currentBalance = balance?.balance.toNumber() ?? 0;
      const isOutflow = dto.type === 'PAYMENT';
      const balanceAfter = isOutflow ? currentBalance - dto.amount : currentBalance + dto.amount;

      if (isOutflow && balanceAfter < 0) {
        throw new BadRequestException('Saldo insuficiente en la caja');
      }

      // Crear movimiento
      await this.prisma.cash_box_movements.create({
        data: {
          cash_box_id: dto.cash_box_id,
          session_id: undefined,
          type: dto.type as any,
          amount: dto.amount,
          currency_code: dto.currency_code,
          exchange_rate: dto.exchange_rate,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: dto.description ?? `Pago #${nextNumber}`,
          payment_id: payment.id,
          reference_type: dto.documents?.length ? 'document' : undefined,
          reference_id: dto.documents?.length ? dto.documents[0].document_id : undefined,
          date: new Date(dto.date),
          created_by: userId,
        },
      });

      // Actualizar saldo
      if (balance) {
        await this.prisma.cash_box_balances.update({
          where: { id: balance.id },
          data: { balance: balanceAfter, updated_at: new Date() },
        });
      } else {
        await this.prisma.cash_box_balances.create({
          data: {
            cash_box_id: dto.cash_box_id,
            currency_code: dto.currency_code,
            balance: balanceAfter,
            created_by: userId,
          },
        });
      }
    }

    // Crear movimiento bancario
    if (dto.bank_account_id) {
      const bankBalance = await this.prisma.bank_accounts.findUnique({
        where: { id: dto.bank_account_id },
      });

      if (bankBalance) {
        const currentBankBalance = bankBalance.balance.toNumber();
        const isOutflow = dto.type === 'PAYMENT';
        const bankBalanceAfter = isOutflow ? currentBankBalance - dto.amount : currentBankBalance + dto.amount;

        await this.prisma.bank_account_movements.create({
          data: {
            bank_account_id: dto.bank_account_id,
            type: dto.type as any,
            amount: dto.amount,
            currency_code: dto.currency_code,
            exchange_rate: dto.exchange_rate,
            balance_before: currentBankBalance,
            balance_after: bankBalanceAfter,
            description: dto.description ?? `Pago #${nextNumber}`,
            payment_id: payment.id,
            date: new Date(dto.date),
            created_by: userId,
          },
        });

        await this.prisma.bank_accounts.update({
          where: { id: dto.bank_account_id },
          data: { balance: bankBalanceAfter, updated_at: new Date() },
        });
      }
    }

    // Actualizar cuenta corriente del tercero
    if (dto.party_id) {
      // Buscar o crear cuenta corriente
      let currentAccount = await this.prisma.current_accounts.findUnique({
        where: {
          party_id_currency_code: {
            party_id: dto.party_id,
            currency_code: dto.currency_code,
          },
        },
      });

      if (!currentAccount) {
        currentAccount = await this.prisma.current_accounts.create({
          data: {
            party_id: dto.party_id,
            party_type: dto.party_type ?? 'CUSTOMER',
            currency_code: dto.currency_code,
            balance: 0,
            created_by: userId,
          },
        });
      }

      const currentBalance = currentAccount.balance.toNumber();
      const isDebit = dto.type === 'PAYMENT';
      const balanceAfter = isDebit ? currentBalance - dto.amount : currentBalance + dto.amount;

      await this.prisma.current_account_entries.create({
        data: {
          current_account_id: currentAccount.id,
          type: dto.type as any,
          amount: dto.amount,
          currency_code: dto.currency_code,
          exchange_rate: dto.exchange_rate,
          balance_before: currentBalance,
          balance_after: balanceAfter,
          description: dto.description ?? `Pago #${nextNumber}`,
          reference_type: 'payment',
          reference_id: payment.id,
          payment_id: payment.id,
          date: new Date(dto.date),
          created_by: userId,
        },
      });

      await this.prisma.current_accounts.update({
        where: { id: currentAccount.id },
        data: { balance: balanceAfter, updated_at: new Date() },
      });
    }

    return payment;
  }

  async findAll(filters?: { party_id?: string; type?: string; payment_method?: string; status?: number }) {
    const where: Record<string, any> = { deleted_at: null };
    if (filters?.party_id) where.party_id = filters.party_id;
    if (filters?.type) where.type = filters.type;
    if (filters?.payment_method) where.payment_method = filters.payment_method;
    if (filters?.status !== undefined) where.status = filters.status;

    return this.prisma.payments.findMany({
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

  async update(id: string, dto: UpdatePaymentDto, userId: string) {
    const payment = await this.findOne(id);
    if (payment.status !== 1) {
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

  async remove(id: string, userId: string) {
    const payment = await this.findOne(id);

    // Revertir applied amounts
    const paymentDocs = await this.prisma.payment_documents.findMany({
      where: { payment_id: id },
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

    return this.prisma.payments.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  async reverse(id: string, userId: string) {
    const payment = await this.findOne(id);

    // Revertir applied amounts
    const paymentDocs = await this.prisma.payment_documents.findMany({
      where: { payment_id: id },
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

    // Revertir entrada en cuenta corriente
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
        const balanceAfter = isDebit ? currentBalance + payment.amount.toNumber() : currentBalance - payment.amount.toNumber();

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
            reference_type: 'payment_reversal',
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

    // Marcar como reversado (status = 0)
    return this.prisma.payments.update({
      where: { id },
      data: {
        status: 0,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }
}
