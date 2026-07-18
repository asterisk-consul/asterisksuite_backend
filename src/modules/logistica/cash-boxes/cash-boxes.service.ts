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

    return this.prisma.cash_boxes.create({
      data: {
        name: dto.name,
        type: dto.type as any ?? 'FIXED',
        responsible_id: dto.responsible_id,
        opening_balance: dto.opening_balance ?? 0,
        max_limit: dto.max_limit,
        active: dto.active ?? true,
        is_main: dto.is_main ?? false,
        created_by: userId,
      },
    });
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

    const session = await this.prisma.cash_box_sessions.create({
      data: {
        cash_box_id: cashBoxId,
        user_id: userId,
        opening_balance: dto.opening_balance,
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
    const box = await this.findOne(cashBoxId);
    if (!box.current_session) {
      throw new BadRequestException('No hay sesión abierta en esta caja');
    }

    const session = box.current_session;
    const income = Number(session.total_income ?? 0);
    const expenses = Number(session.total_expenses ?? 0);
    const openingBalance = Number(session.opening_balance ?? 0);
    const theoreticalBalance = openingBalance + income - expenses;
    const difference = Number(dto.actual_balance ?? 0) - theoreticalBalance;

    const closed = await this.prisma.cash_box_sessions.update({
      where: { id: session.id },
      data: {
        closed_at: new Date(),
        closing_balance: theoreticalBalance,
        actual_balance: dto.actual_balance,
        difference,
        status: 'CLOSED',
      },
    });

    // Actualizar caja
    await this.prisma.cash_boxes.update({
      where: { id: cashBoxId },
      data: {
        current_session_id: null,
        status: 'CLOSED',
        last_session_closed_at: new Date(),
      },
    });

    return closed;
  }

  async forceCloseSession(cashBoxId: string, dto: ForceCloseSessionDto, userId: string) {
    const box = await this.findOne(cashBoxId);
    if (!box.current_session) {
      throw new BadRequestException('No hay sesión abierta en esta caja');
    }

    const session = box.current_session;
    const income = Number(session.total_income ?? 0);
    const expenses = Number(session.total_expenses ?? 0);
    const openingBalance = Number(session.opening_balance ?? 0);
    const theoreticalBalance = openingBalance + income - expenses;
    const difference = Number(dto.actual_balance ?? 0) - theoreticalBalance;

    const closed = await this.prisma.cash_box_sessions.update({
      where: { id: session.id },
      data: {
        closed_at: new Date(),
        closing_balance: theoreticalBalance,
        actual_balance: dto.actual_balance,
        difference,
        status: 'FORCED',
        force_closed: true,
        force_closed_by: userId,
        force_closed_at: new Date(),
        force_close_reason: dto.reason,
      },
    });

    await this.prisma.cash_boxes.update({
      where: { id: cashBoxId },
      data: {
        current_session_id: null,
        status: 'CLOSED',
        last_session_closed_at: new Date(),
      },
    });

    return closed;
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
}
