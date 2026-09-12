import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxTransferDto } from './dto/create-cash-box-transfer.dto';

@Injectable()
export class CashBoxTransfersService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateCashBoxTransferDto, userId: string) {
    // Validar que origen y destino sean diferentes
    if (dto.source_type === dto.dest_type && dto.source_id === dto.dest_id) {
      throw new BadRequestException('Origen y destino no pueden ser iguales');
    }

    // Validar sesión abierta en caja origen
    if (dto.source_type === 'cash_box') {
      const box = await this.prisma.cash_boxes.findUnique({
        where: { id: dto.source_id },
        select: { current_session_id: true },
      });
      if (!box?.current_session_id) {
        throw new BadRequestException('La caja origen debe tener una sesión abierta');
      }
      dto.session_id = box.current_session_id;

      // Validar saldo en origen
      const balance = await this.prisma.cash_box_balances.findUnique({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: dto.source_id,
            currency_code: dto.currency_code,
          },
        },
      });

      if (!balance || balance.balance.toNumber() < dto.amount) {
        throw new BadRequestException('Saldo insuficiente en la caja origen');
      }
    }

    // Crear transferencia
    const transfer = await this.prisma.cash_box_transfers.create({
      data: {
        session_id: dto.session_id,
        source_type: dto.source_type,
        source_id: dto.source_id,
        dest_type: dto.dest_type,
        dest_id: dto.dest_id,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        rate_type: dto.rate_type,
        converted_amount: dto.converted_amount,
        description: dto.description,
        reference: dto.reference,
        transfer_type: dto.transfer_type,
        status: 'pending',
        created_by: userId,
      },
    });

    return transfer;
  }

  async confirm(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (transfer.status !== 'pending') {
      throw new BadRequestException('Solo se pueden confirmar transferencias pendientes');
    }

    // Ejecutar transferencia
    await this.executeTransfer(transfer, userId);

    return this.prisma.cash_box_transfers.update({
      where: { id },
      data: {
        status: 'completed',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  private async executeTransfer(transfer: any, userId: string) {
    const isSourceCashBox = transfer.source_type === 'cash_box';
    const isDestCashBox = transfer.dest_type === 'cash_box';

    const sourceAmount = transfer.amount.toNumber();
    const destAmount = transfer.converted_amount?.toNumber() ?? sourceAmount;

    // Resolve destination currency code
    let destCurrencyCode = transfer.currency_code;
    if (isDestCashBox) {
      const destBox = await this.prisma.cash_boxes.findUnique({ where: { id: transfer.dest_id }, select: { currency_code: true, current_session_id: true } });
      destCurrencyCode = destBox?.currency_code ?? transfer.currency_code;
    } else {
      const destAccount = await this.prisma.bank_accounts.findUnique({ where: { id: transfer.dest_id }, select: { currency_code: true } });
      destCurrencyCode = destAccount?.currency_code ?? transfer.currency_code;
    }

    // Resolve destination session ID (each cash box has its own session)
    let destSessionId: string | null = null;
    if (isDestCashBox) {
      const destBox = await this.prisma.cash_boxes.findUnique({ where: { id: transfer.dest_id }, select: { current_session_id: true } });
      destSessionId = destBox?.current_session_id ?? null;
    }

    // Read balances BEFORE updating (needed for correct balance_before in movements)
    let sourceBalanceBefore = 0;
    if (isSourceCashBox) {
      const bal = await this.prisma.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: transfer.source_id, currency_code: transfer.currency_code } },
        select: { balance: true },
      });
      sourceBalanceBefore = bal?.balance.toNumber() ?? 0;
    } else {
      const acc = await this.prisma.bank_accounts.findUnique({ where: { id: transfer.source_id }, select: { balance: true } });
      sourceBalanceBefore = acc?.balance.toNumber() ?? 0;
    }

    let destBalanceBefore = 0;
    if (isDestCashBox) {
      const bal = await this.prisma.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: transfer.dest_id, currency_code: destCurrencyCode } },
        select: { balance: true },
      });
      destBalanceBefore = bal?.balance.toNumber() ?? 0;
    } else {
      const acc = await this.prisma.bank_accounts.findUnique({ where: { id: transfer.dest_id }, select: { balance: true } });
      destBalanceBefore = acc?.balance.toNumber() ?? 0;
    }

    // Restar del origen
    if (isSourceCashBox) {
      await this.updateCashBoxBalance(transfer.source_id, transfer.currency_code, -sourceAmount);
      await this.createMovement(transfer.source_id, transfer.session_id, 'TRANSFER', -sourceAmount, transfer.currency_code, 'Transferencia saliente', userId, sourceBalanceBefore);
    } else {
      await this.updateBankAccountBalance(transfer.source_id, -sourceAmount);
      await this.createBankMovement(transfer.source_id, 'TRANSFER', -sourceAmount, transfer.currency_code, 'Transferencia saliente', userId, sourceBalanceBefore);
    }

    // Sumar al destino
    if (isDestCashBox) {
      await this.updateCashBoxBalance(transfer.dest_id, destCurrencyCode, destAmount);
      await this.createMovement(transfer.dest_id, destSessionId, 'TRANSFER', destAmount, destCurrencyCode, 'Transferencia entrante', userId, destBalanceBefore);
    } else {
      await this.updateBankAccountBalance(transfer.dest_id, destAmount);
      await this.createBankMovement(transfer.dest_id, 'TRANSFER', destAmount, destCurrencyCode, 'Transferencia entrante', userId, destBalanceBefore);
    }
  }

  private async updateBankAccountBalance(accountId: string, delta: number) {
    await this.prisma.bank_accounts.update({
      where: { id: accountId },
      data: { balance: { increment: delta } },
    });
  }

  private async createBankMovement(bankAccountId: string, type: string, amount: number, currencyCode: string, description: string, userId: string, balanceBefore: number) {
    await this.prisma.bank_account_movements.create({
      data: {
        bank_account_id: bankAccountId,
        type: type as any,
        amount,
        currency_code: currencyCode,
        balance_before: balanceBefore,
        balance_after: balanceBefore + amount,
        description,
        created_by: userId,
      },
    });
  }

  private async updateCashBoxBalance(cashBoxId: string, currencyCode: string, delta: number) {
    const balance = await this.prisma.cash_box_balances.findUnique({
      where: {
        cash_box_id_currency_code: { cash_box_id: cashBoxId, currency_code: currencyCode },
      },
    });

    if (balance) {
      const newBalance = balance.balance.toNumber() + delta;
      if (newBalance < 0) throw new BadRequestException('Saldo insuficiente');
      await this.prisma.cash_box_balances.update({
        where: { id: balance.id },
        data: { balance: newBalance, updated_at: new Date() },
      });
    } else if (delta > 0) {
      await this.prisma.cash_box_balances.create({
        data: {
          cash_box_id: cashBoxId,
          currency_code: currencyCode,
          balance: delta,
          created_by: undefined,
        },
      });
    }
  }

  private async createMovement(cashBoxId: string, sessionId: string | null, type: string, amount: number, currencyCode: string, description: string, userId: string, balanceBefore: number) {
    const movement = await this.prisma.cash_box_movements.create({
      data: {
        cash_box_id: cashBoxId,
        session_id: sessionId,
        type: type as any,
        amount,
        currency_code: currencyCode,
        balance_before: balanceBefore,
        balance_after: balanceBefore + amount,
        description,
        created_by: userId,
      },
    });

    // Actualizar totales de la sesión
    if (sessionId) {
      const sessionUpdate: Record<string, any> = { movement_count: { increment: 1 } };
      if (amount > 0) {
        sessionUpdate.total_income = { increment: amount };
      } else {
        sessionUpdate.total_expenses = { increment: Math.abs(amount) };
      }
      await this.prisma.cash_box_sessions.update({
        where: { id: sessionId },
        data: sessionUpdate,
      });
    }

    return movement;
  }

  async findAll(filters?: { source_type?: string; source_id?: string; dest_type?: string; dest_id?: string; status?: string; user_id?: string }) {
    const where: Record<string, any> = { deleted_at: null };
    if (filters?.source_type) where.source_type = filters.source_type;
    if (filters?.source_id) where.source_id = filters.source_id;
    if (filters?.dest_type) where.dest_type = filters.dest_type;
    if (filters?.dest_id) where.dest_id = filters.dest_id;
    if (filters?.status) where.status = filters.status;
    if (filters?.user_id) where.created_by = filters.user_id;

    const transfers = await this.prisma.cash_box_transfers.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    // Resolver creadores desde public.users
    const creatorIds = [...new Set(transfers.map(t => t.created_by).filter(Boolean))] as string[];
    let creatorsMap = new Map<string, { id: string; name: string | null; email: string | null }>();

    if (creatorIds.length > 0) {
      const publicPrisma = this.db.getDefaultClient();
      const creators = await publicPrisma.users.findMany({
        where: { id: { in: creatorIds } },
        select: { id: true, name: true, email: true },
      });
      creatorsMap = new Map(creators.map(c => [c.id, c]));
    }

    return transfers.map(t => ({
      ...t,
      creator: t.created_by ? creatorsMap.get(t.created_by) ?? null : null,
    }));
  }

  async findOne(id: string) {
    const transfer = await this.prisma.cash_box_transfers.findFirst({
      where: { id, deleted_at: null },
    });
    if (!transfer) throw new NotFoundException('Transferencia no encontrada');

    // Resolver creador desde public.users
    let creator = null;
    if (transfer.created_by) {
      const publicPrisma = this.db.getDefaultClient();
      creator = await publicPrisma.users.findUnique({
        where: { id: transfer.created_by },
        select: { id: true, name: true, email: true },
      });
    }

    return { ...transfer, creator };
  }

  async cancel(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (transfer.status !== 'pending') {
      throw new BadRequestException('Solo se pueden cancelar transferencias pendientes');
    }

    return this.prisma.cash_box_transfers.update({
      where: { id },
      data: {
        status: 'cancelled',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    const transfer = await this.findOne(id);
    if (transfer.status === 'completed') {
      throw new BadRequestException('No se puede eliminar una transferencia completada');
    }

    return this.prisma.cash_box_transfers.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}
