import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { ForceCloseSessionDto } from './dto/force-close-session.dto';

@Injectable()
export class CashBoxesService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  // ═══════════════════════════════════════════
  // CRUD CAJAS
  // ═══════════════════════════════════════════

  async create(dto: CreateCashBoxDto, userId: string) {
    // Si is_main=true, desmarcar las demás
    if (dto.is_main) {
      await this.prisma.cash_boxes.updateMany({
        where: { is_main: true, deleted_at: null },
        data: { is_main: false },
      });
    }

    const box = await this.prisma.cash_boxes.create({
      data: {
        name: dto.name,
        type: dto.type as any ?? 'FIXED',
        currency_code: dto.currency_code,
        status: 'CLOSED',
        responsible_id: dto.responsible_id,
        opening_balance: dto.opening_balance ?? 0,
        max_limit: dto.max_limit,
        active: dto.active ?? true,
        is_main: dto.is_main ?? false,
        created_by: userId,
      },
    });

    // Crear balance inicial con la currency seleccionada
    if (dto.opening_balance && dto.opening_balance > 0) {
      await this.prisma.cash_box_balances.create({
        data: {
          cash_box_id: box.id,
          currency_code: dto.currency_code,
          balance: dto.opening_balance,
          created_by: userId,
        },
      });
    }

    return box;
  }

  async findAll(userId?: string) {
    const where: Record<string, any> = { deleted_at: null };

    // Si userId viene, filtrar solo cajas donde el usuario tiene rol
    if (userId) {
      const userRoleIds = await this.prisma.cash_box_user_roles.findMany({
        where: { user_id: userId },
        select: { cash_box_id: true },
      });
      const allowedBoxIds = userRoleIds.map(r => r.cash_box_id);
      where.id = { in: allowedBoxIds };
    }

    return this.prisma.cash_boxes.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        responsible: { select: { id: true, first_name: true, last_name: true } },
        balances: true,
        user_roles: true,
      },
    });
  }

  async findOne(id: string) {
    const box = await this.prisma.cash_boxes.findFirst({
      where: { id, deleted_at: null },
      include: {
        responsible: { select: { id: true, first_name: true, last_name: true } },
        balances: true,
        user_roles: true,
        current_session: true,
      },
    });
    if (!box) throw new NotFoundException('Caja no encontrada');
    return box;
  }

  async update(id: string, dto: UpdateCashBoxDto, userId: string) {
    await this.findOne(id);

    if (dto.is_main) {
      await this.prisma.cash_boxes.updateMany({
        where: { is_main: true, deleted_at: null, NOT: { id } },
        data: { is_main: false },
      });
    }

    return this.prisma.cash_boxes.update({
      where: { id },
      data: {
        ...dto,
        type: dto.type as any,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    const box = await this.findOne(id);
    if (box.current_session) {
      throw new BadRequestException('No se puede eliminar una caja con sesión abierta');
    }

    // Check if box has any balance
    const balances = await this.prisma.cash_box_balances.findMany({
      where: { cash_box_id: id, deleted_at: null },
    });
    const hasBalance = balances.some(b => Number(b.balance) !== 0);
    if (hasBalance) {
      throw new BadRequestException('No se puede eliminar una caja con saldo. Transferí el saldo a otra caja primero.');
    }

    return this.prisma.cash_boxes.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId, active: false },
    });
  }

  async findMain() {
    const box = await this.prisma.cash_boxes.findFirst({
      where: { is_main: true, deleted_at: null },
      include: { balances: true },
    });
    if (!box) throw new NotFoundException('No hay caja principal configurada');
    return box;
  }

  // ═══════════════════════════════════════════
  // BALANCES
  // ═══════════════════════════════════════════

  async getBalances(cashBoxId: string) {
    return this.prisma.cash_box_balances.findMany({
      where: { cash_box_id: cashBoxId, deleted_at: null },
    });
  }

  async addBalance(cashBoxId: string, currencyCode: string, amount: number) {
    const balance = await this.prisma.cash_box_balances.findUnique({
      where: { cash_box_id_currency_code: { cash_box_id: cashBoxId, currency_code: currencyCode } },
    });

    if (balance) {
      return this.prisma.cash_box_balances.update({
        where: { id: balance.id },
        data: { balance: { increment: amount } },
      });
    }

    return this.prisma.cash_box_balances.create({
      data: {
        cash_box_id: cashBoxId,
        currency_code: currencyCode,
        balance: amount,
      },
    });
  }

  async subtractBalance(cashBoxId: string, currencyCode: string, amount: number) {
    const balance = await this.prisma.cash_box_balances.findUnique({
      where: { cash_box_id_currency_code: { cash_box_id: cashBoxId, currency_code: currencyCode } },
    });

    if (!balance || balance.balance.toNumber() < amount) {
      throw new BadRequestException(`Saldo insuficiente en ${currencyCode}`);
    }

    return this.prisma.cash_box_balances.update({
      where: { id: balance.id },
      data: { balance: { decrement: amount } },
    });
  }

  // ═══════════════════════════════════════════
  // USER ROLES
  // ═══════════════════════════════════════════

  async addUserRole(cashBoxId: string, userId: string, role: string) {
    const existing = await this.prisma.cash_box_user_roles.findUnique({
      where: { cash_box_id_user_id: { cash_box_id: cashBoxId, user_id: userId } },
    });
    if (existing) {
      return this.prisma.cash_box_user_roles.update({
        where: { id: existing.id },
        data: { role: role as any, updated_at: new Date() },
      });
    }
    return this.prisma.cash_box_user_roles.create({
      data: {
        cash_box_id: cashBoxId,
        user_id: userId,
        role: role as any,
        created_by: userId,
      },
    });
  }

  async removeUserRole(cashBoxId: string, userId: string) {
    const existing = await this.prisma.cash_box_user_roles.findUnique({
      where: { cash_box_id_user_id: { cash_box_id: cashBoxId, user_id: userId } },
    });
    if (!existing) {
      throw new NotFoundException('Rol de usuario no encontrado en esta caja');
    }
    return this.prisma.cash_box_user_roles.delete({
      where: { id: existing.id },
    });
  }

  async getUserRoles(cashBoxId: string) {
    return this.prisma.cash_box_user_roles.findMany({
      where: { cash_box_id: cashBoxId },
    });
  }

  // ═══════════════════════════════════════════
  // SESIONES
  // ═══════════════════════════════════════════

  async openSession(cashBoxId: string, dto: OpenSessionDto, userId: string) {
    const box = await this.findOne(cashBoxId);

    console.log('[openSession] box.current_session_id:', box.current_session_id, 'current_session:', box.current_session ? 'EXISTS' : 'null');

    // Verificar que no haya sesión abierta
    if (box.current_session) {
      throw new BadRequestException('Ya hay una sesión abierta en esta caja');
    }

    const currencyCode = box.currency_code ?? 'ARS';
    const currentBalance = box.balances.find((balance) => balance.currency_code === currencyCode);
    const openingBalance = currentBalance?.balance.toNumber() ?? 0;

    const session = await this.prisma.cash_box_sessions.create({
      data: {
        cash_box_id: cashBoxId,
        user_id: userId,
        opening_balance: openingBalance,
        status: 'OPEN',
        created_by: userId,
      },
    });

    // Actualizar caja con sesión actual
    await this.prisma.cash_boxes.update({
      where: { id: cashBoxId },
      data: {
        current_session_id: session.id,
        status: 'OPEN',
      },
    });

    return session;
  }

  async closeSession(cashBoxId: string, dto: CloseSessionDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const box = await tx.cash_boxes.findFirst({
        where: { id: cashBoxId, deleted_at: null },
        include: { current_session: true, balances: true },
      });
      if (!box?.current_session) throw new BadRequestException('No hay sesión abierta en esta caja');

      const currencyCode = box.currency_code ?? 'ARS';
      const balance = box.balances.find((item) => item.currency_code === currencyCode && !item.deleted_at);
      const systemBalance = balance?.balance.toNumber() ?? 0;
      const actualBalance = Number(dto.actual_balance);
      const difference = Number((actualBalance - systemBalance).toFixed(2));
      const reason = dto.notes?.trim() || null;

      if (Math.abs(difference) > 0.01 && !reason) {
        throw new BadRequestException('Indicá el motivo de la diferencia de caja');
      }

      if (Math.abs(difference) > 0.01) {
        if (balance) {
          await tx.cash_box_balances.update({
            where: { id: balance.id },
            data: { balance: actualBalance, updated_at: new Date(), updated_by: userId },
          });
        } else {
          await tx.cash_box_balances.create({
            data: { cash_box_id: cashBoxId, currency_code: currencyCode, balance: actualBalance, created_by: userId },
          });
        }

        await tx.cash_box_movements.create({
          data: {
            cash_box_id: cashBoxId,
            session_id: box.current_session.id,
            type: 'ADJUSTMENT',
            amount: Math.abs(difference),
            currency_code: currencyCode,
            balance_before: systemBalance,
            balance_after: actualBalance,
            description: `Ajuste por cierre de caja: ${reason}`,
            reference_type: 'cash_box_closing',
            reference_id: box.current_session.id,
            date: new Date(),
            created_by: userId,
          },
        });
      }

      const closedAt = new Date();
      const closed = await tx.cash_box_sessions.update({
        where: { id: box.current_session.id },
        data: {
          closed_at: closedAt,
          closing_balance: systemBalance,
          actual_balance: actualBalance,
          difference,
          difference_reason: reason,
          movement_count: Math.abs(difference) > 0.01 ? { increment: 1 } : undefined,
          status: 'CLOSED',
          updated_by: userId,
        },
      });

      await tx.cash_boxes.update({
        where: { id: cashBoxId },
        data: { current_session_id: null, status: 'CLOSED', last_session_closed_at: closedAt },
      });

      return closed;
    });
  }

  async forceCloseSession(cashBoxId: string, dto: ForceCloseSessionDto, userId: string) {
    const reason = dto.reason?.trim();
    if (!reason) throw new BadRequestException('Indicá el motivo del cierre forzado');

    const closed = await this.closeSession(cashBoxId, { actual_balance: dto.actual_balance, notes: reason }, userId);
    const forcedAt = new Date();
    return this.prisma.cash_box_sessions.update({
      where: { id: closed.id },
      data: {
        status: 'FORCED',
        force_closed: true,
        force_closed_by: userId,
        force_closed_at: forcedAt,
        force_close_reason: reason,
      },
    });
  }

  async getCurrentSession(cashBoxId: string) {
    const box = await this.findOne(cashBoxId);
    if (!box.current_session) {
      return null;
    }
    return this.prisma.cash_box_sessions.findUnique({
      where: { id: box.current_session_id! },
      include: { movements: true },
    });
  }

  async getSessionHistory(cashBoxId: string) {
    return this.prisma.cash_box_sessions.findMany({
      where: { cash_box_id: cashBoxId, deleted_at: null },
      orderBy: { opened_at: 'desc' },
      take: 50,
    });
  }

  // ═══════════════════════════════════════════
  // RECALCULAR SALDOS (corrección de divergencias)
  // ═══════════════════════════════════════════

  OUTFLOW_TYPES = ['PAYMENT', 'LOAN', 'LOAN_PAYMENT', 'CHECK_ISSUED', 'CHECK_BOUNCED', 'DEBIT'];

  async recalculate(cashBoxId: string) {
    const box = await this.prisma.cash_boxes.findUnique({
      where: { id: cashBoxId },
      include: { balances: true },
    });
    if (!box) throw new NotFoundException('Caja no encontrada');

    // 1. Recalcular saldos por moneda desde todos los movimientos
    const movements = await this.prisma.cash_box_movements.findMany({
      where: { cash_box_id: cashBoxId, deleted_at: null },
      orderBy: { date: 'asc' },
    });

    const balanceByCurrency = new Map<string, number>();
    for (const m of movements) {
      const cur = m.currency_code;
      const current = balanceByCurrency.get(cur) ?? 0;
      const isOutflow = this.OUTFLOW_TYPES.includes(m.type);
      balanceByCurrency.set(cur, isOutflow ? current - m.amount.toNumber() : current + m.amount.toNumber());
    }

    // Actualizar balances por moneda
    for (const [currencyCode, newBalance] of balanceByCurrency) {
      const existing = box.balances.find(b => b.currency_code === currencyCode && !b.deleted_at);
      if (existing) {
        await this.prisma.cash_box_balances.update({
          where: { id: existing.id },
          data: { balance: newBalance, updated_at: new Date() },
        });
      } else {
        await this.prisma.cash_box_balances.create({
          data: { cash_box_id: cashBoxId, currency_code: currencyCode, balance: newBalance, created_by: 'system' },
        });
      }
    }

    // 2. Recalcular totales de la sesión actual
    const currentSession = box.current_session_id
      ? await this.prisma.cash_box_sessions.findUnique({ where: { id: box.current_session_id } })
      : null;

    if (currentSession) {
      const sessionMovements = movements.filter(m => m.session_id === currentSession.id);
      let totalIncome = 0;
      let totalExpenses = 0;
      for (const m of sessionMovements) {
        const isOutflow = this.OUTFLOW_TYPES.includes(m.type);
        if (isOutflow) {
          totalExpenses += m.amount.toNumber();
        } else {
          totalIncome += m.amount.toNumber();
        }
      }

      await this.prisma.cash_box_sessions.update({
        where: { id: currentSession.id },
        data: {
          total_income: totalIncome,
          total_expenses: totalExpenses,
          movement_count: sessionMovements.length,
          updated_at: new Date(),
        },
      });
    }

    return { balances: Object.fromEntries(balanceByCurrency), session_recalculated: !!currentSession };
  }
}
