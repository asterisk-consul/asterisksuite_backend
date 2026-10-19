import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxMovementDto } from './dto/create-cash-box-movement.dto';
import { UpdateCashBoxMovementDto } from './dto/update-cash-box-movement.dto';
import { FilterCashBoxMovementDto } from './dto/filter-cash-box-movement.dto';
import { parseLocalDateTime } from '@/common/utils/dates';
import { ReverseCashBoxMovementDto } from './dto/reverse-cash-box-movement.dto';

@Injectable()
export class CashBoxMovementsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateCashBoxMovementDto, userId: string) {
    const amount = Number(dto.amount);
    const isOutflow = dto.type === 'DEBIT';

    return this.prisma.$transaction(async (tx) => {
      const box = await tx.cash_boxes.findFirst({
        where: { id: dto.cash_box_id, active: true, deleted_at: null },
        include: { current_session: true },
      });
      if (!box) throw new NotFoundException('Caja no encontrada o inactiva');
      if (box.status !== 'OPEN' || !box.current_session_id || box.current_session?.status !== 'OPEN') {
        throw new BadRequestException('La caja debe tener una sesión abierta');
      }
      if (box.currency_code && box.currency_code !== dto.currency_code) {
        throw new BadRequestException(`La caja opera en ${box.currency_code}`);
      }

      const balance = await tx.cash_box_balances.findUnique({
        where: { cash_box_id_currency_code: { cash_box_id: dto.cash_box_id, currency_code: dto.currency_code } },
      });
      const balanceBefore = Number(balance?.balance ?? 0);
      const balanceAfter = Number((balanceBefore + (isOutflow ? -amount : amount)).toFixed(2));
      if (isOutflow && balanceAfter < 0) {
        throw new BadRequestException(`Saldo insuficiente. Disponible: ${balanceBefore.toFixed(2)}`);
      }

      const movement = await tx.cash_box_movements.create({
        data: {
          cash_box_id: dto.cash_box_id,
          session_id: box.current_session_id,
          type: dto.type,
          amount,
          currency_code: dto.currency_code,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: `${dto.concept.trim()}: ${dto.description.trim()}`,
          reference_type: 'manual_cash_movement',
          date: dto.date ? parseLocalDateTime(dto.date) : new Date(),
          created_by: userId,
        },
      });

      await tx.cash_box_balances.upsert({
        where: { cash_box_id_currency_code: { cash_box_id: dto.cash_box_id, currency_code: dto.currency_code } },
        create: { cash_box_id: dto.cash_box_id, currency_code: dto.currency_code, balance: balanceAfter, created_by: userId },
        update: { balance: balanceAfter, deleted_at: null, updated_at: new Date(), updated_by: userId },
      });
      await tx.cash_box_sessions.update({
        where: { id: box.current_session_id },
        data: {
          movement_count: { increment: 1 },
          ...(isOutflow
            ? { total_expenses: { increment: amount } }
            : { total_income: { increment: amount } }),
        },
      });
      return movement;
    }, { isolationLevel: 'Serializable' });
  }

  async reverse(id: string, dto: ReverseCashBoxMovementDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const original = await tx.cash_box_movements.findFirst({
        where: { id, deleted_at: null },
      });
      if (!original) throw new NotFoundException('Movimiento no encontrado');
      if (original.cash_box_id !== dto.cash_box_id) {
        throw new BadRequestException('El movimiento no pertenece a la caja indicada');
      }
      if (original.reference_type !== 'manual_cash_movement') {
        throw new BadRequestException('Solo los movimientos manuales se anulan desde esta acción');
      }
      const priorReversal = await tx.cash_box_movements.findFirst({
        where: { reference_type: 'manual_cash_movement_reversal', reference_id: id, deleted_at: null },
        select: { id: true },
      });
      if (priorReversal) throw new BadRequestException('El movimiento ya fue anulado');

      const box = await tx.cash_boxes.findFirst({
        where: { id: original.cash_box_id, active: true, deleted_at: null },
        include: { current_session: true },
      });
      if (!box || box.status !== 'OPEN' || !box.current_session_id || box.current_session?.status !== 'OPEN') {
        throw new BadRequestException('La caja debe tener una sesión abierta para registrar la reversión');
      }
      const balance = await tx.cash_box_balances.findUnique({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: original.cash_box_id,
            currency_code: original.currency_code,
          },
        },
      });
      const balanceBefore = Number(balance?.balance ?? 0);
      const originalDelta = Number(original.balance_after) - Number(original.balance_before);
      const reversalDelta = -originalDelta;
      const balanceAfter = Number((balanceBefore + reversalDelta).toFixed(2));
      if (balanceAfter < 0) {
        throw new BadRequestException('El saldo actual no alcanza para revertir este ingreso');
      }
      const reversalType = reversalDelta < 0 ? 'DEBIT' : 'CREDIT';
      const amount = Math.abs(reversalDelta);

      const reversal = await tx.cash_box_movements.create({
        data: {
          cash_box_id: original.cash_box_id,
          session_id: box.current_session_id,
          type: reversalType,
          amount,
          currency_code: original.currency_code,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          description: `Reversión: ${dto.reason.trim()}`,
          reference_type: 'manual_cash_movement_reversal',
          reference_id: original.id,
          date: new Date(),
          created_by: userId,
        },
      });
      await tx.cash_box_balances.upsert({
        where: {
          cash_box_id_currency_code: {
            cash_box_id: original.cash_box_id,
            currency_code: original.currency_code,
          },
        },
        create: {
          cash_box_id: original.cash_box_id,
          currency_code: original.currency_code,
          balance: balanceAfter,
          created_by: userId,
        },
        update: { balance: balanceAfter, updated_at: new Date(), updated_by: userId },
      });
      await tx.cash_box_sessions.update({
        where: { id: box.current_session_id },
        data: {
          movement_count: { increment: 1 },
          ...(reversalType === 'DEBIT'
            ? { total_expenses: { increment: amount } }
            : { total_income: { increment: amount } }),
        },
      });
      return reversal;
    }, { isolationLevel: 'Serializable' });
  }

  async findAll(filters: FilterCashBoxMovementDto) {
    const where: Record<string, any> = { deleted_at: null };

    if (filters.cash_box_id) where.cash_box_id = filters.cash_box_id;
    if (filters.session_id) where.session_id = filters.session_id;
    if (filters.employee_id) where.employee_id = filters.employee_id;
    if (filters.type) where.type = filters.type;
    if (filters.currency_code) where.currency_code = filters.currency_code;

    if (filters.date_from || filters.date_to) {
      where.date = {};
      if (filters.date_from) where.date.gte = new Date(filters.date_from);
      if (filters.date_to) where.date.lte = new Date(filters.date_to);
    }

    return this.prisma.cash_box_movements.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        employee: { select: { id: true, first_name: true, last_name: true } },
      },
    });
  }

  async findOne(id: string) {
    const movement = await this.prisma.cash_box_movements.findFirst({
      where: { id, deleted_at: null },
      include: {
        employee: { select: { id: true, first_name: true, last_name: true } },
        session: true,
      },
    });
    if (!movement) throw new NotFoundException('Movimiento no encontrado');
    return movement;
  }

  async update(id: string, dto: UpdateCashBoxMovementDto, userId: string) {
    void dto;
    void userId;
    await this.findOne(id);
    throw new BadRequestException('Los movimientos confirmados no se editan; registrá una reversión');
  }

  async remove(id: string, userId: string) {
    void userId;
    await this.findOne(id);
    throw new BadRequestException('Los movimientos confirmados no se eliminan; registrá una reversión');
  }
}
