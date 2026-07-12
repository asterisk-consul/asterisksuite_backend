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

    // Validar saldo en origen si es caja
    if (dto.source_type === 'cash_box') {
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

    // Restar del origen
    if (isSourceCashBox) {
      await this.updateCashBoxBalance(transfer.source_id, transfer.currency_code, -transfer.amount.toNumber());
      await this.createMovement(transfer.source_id, transfer.session_id, 'TRANSFER', transfer.amount.toNumber(), transfer.currency_code, `Transferencia saliente`, userId);
    }

    // Sumar al destino
    if (isDestCashBox) {
      await this.updateCashBoxBalance(transfer.dest_id, transfer.currency_code, transfer.amount.toNumber());
      await this.createMovement(transfer.dest_id, transfer.session_id, 'TRANSFER', transfer.amount.toNumber(), transfer.currency_code, `Transferencia entrante`, userId);
    }
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

  private async createMovement(cashBoxId: string, sessionId: string | null, type: string, amount: number, currencyCode: string, description: string, userId: string) {
    const balance = await this.prisma.cash_box_balances.findUnique({
      where: {
        cash_box_id_currency_code: { cash_box_id: cashBoxId, currency_code: currencyCode },
      },
    });

    await this.prisma.cash_box_movements.create({
      data: {
        cash_box_id: cashBoxId,
        session_id: sessionId,
        type: type as any,
        amount,
        currency_code: currencyCode,
        balance_before: balance?.balance.toNumber() ?? 0,
        balance_after: (balance?.balance.toNumber() ?? 0) + amount,
        description,
        created_by: userId,
      },
    });
  }

  async findAll(filters?: { source_type?: string; source_id?: string; dest_type?: string; dest_id?: string; status?: string }) {
    const where: Record<string, any> = { deleted_at: null };
    if (filters?.source_type) where.source_type = filters.source_type;
    if (filters?.source_id) where.source_id = filters.source_id;
    if (filters?.dest_type) where.dest_type = filters.dest_type;
    if (filters?.dest_id) where.dest_id = filters.dest_id;
    if (filters?.status) where.status = filters.status;

    return this.prisma.cash_box_transfers.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const transfer = await this.prisma.cash_box_transfers.findFirst({
      where: { id, deleted_at: null },
    });
    if (!transfer) throw new NotFoundException('Transferencia no encontrada');
    return transfer;
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
