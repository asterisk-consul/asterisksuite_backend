import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxMovementDto } from './dto/create-cash-box-movement.dto';
import { UpdateCashBoxMovementDto } from './dto/update-cash-box-movement.dto';
import { FilterCashBoxMovementDto } from './dto/filter-cash-box-movement.dto';
import { parseLocalDateTime } from '@/common/utils/dates';

@Injectable()
export class CashBoxMovementsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateCashBoxMovementDto, userId: string) {
    // 1. Validar que la caja existe
    const box = await this.prisma.cash_boxes.findFirst({
      where: { id: dto.cash_box_id, deleted_at: null },
    });
    if (!box) throw new NotFoundException('Caja no encontrada');

    // 2. Validar sesión si se provee
    if (dto.session_id) {
      const session = await this.prisma.cash_box_sessions.findFirst({
        where: { id: dto.session_id, status: 'OPEN', deleted_at: null },
      });
      if (!session) throw new BadRequestException('Sesión no encontrada o no está abierta');
    }

    // 3. Obtener saldo actual de la moneda
    const balance = await this.prisma.cash_box_balances.findUnique({
      where: {
        cash_box_id_currency_code: {
          cash_box_id: dto.cash_box_id,
          currency_code: dto.currency_code,
        },
      },
    });

    const currentBalance = balance?.balance.toNumber() ?? 0;
    const isOutflow = ['PAYMENT', 'LOAN', 'CHECK_ISSUED', 'TRANSFER'].includes(dto.type);
    const balanceAfter = isOutflow ? currentBalance - dto.amount : currentBalance + dto.amount;

    // 4. Validar saldo suficiente para egresos
    if (isOutflow && balanceAfter < 0) {
      throw new BadRequestException(
        `Saldo insuficiente. Actual: ${currentBalance}, Egreso: ${dto.amount}`,
      );
    }

    // 5. Crear movimiento
    const movement = await this.prisma.cash_box_movements.create({
      data: {
        cash_box_id: dto.cash_box_id,
        session_id: dto.session_id ?? box.current_session_id,
        employee_id: dto.employee_id,
        type: dto.type as any,
        amount: dto.amount,
        currency_code: dto.currency_code,
        exchange_rate: dto.exchange_rate,
        balance_before: currentBalance,
        balance_after: balanceAfter,
        description: dto.description,
        reference_type: dto.reference_type,
        reference_id: dto.reference_id,
        payment_id: dto.payment_id,
        bank_account_id: dto.bank_account_id,
        date: dto.date ? parseLocalDateTime(dto.date) : new Date(),
        created_by: userId,
      },
    });

    // 6. Actualizar saldo de la caja
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

    // 7. Actualizar totales de la sesión
    if (movement.session_id) {
      const sessionUpdate: Record<string, any> = {
        movement_count: { increment: 1 },
      };

      if (isOutflow) {
        sessionUpdate.total_expenses = { increment: dto.amount };
      } else {
        sessionUpdate.total_income = { increment: dto.amount };
      }

      await this.prisma.cash_box_sessions.update({
        where: { id: movement.session_id },
        data: sessionUpdate,
      });
    }

    return movement;
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
    await this.findOne(id);

    return this.prisma.cash_box_movements.update({
      where: { id },
      data: {
        ...dto,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);

    return this.prisma.cash_box_movements.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}
