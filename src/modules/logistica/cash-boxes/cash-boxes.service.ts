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

  async findAll() {
    return this.prisma.cash_boxes.findMany({
      where: { deleted_at: null },
      orderBy: { name: 'asc' },
      include: {
        responsible: { select: { id: true, first_name: true, last_name: true } },
        balances: true,
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
  // SESIONES
  // ═══════════════════════════════════════════

  async openSession(cashBoxId: string, dto: OpenSessionDto, userId: string) {
    const box = await this.findOne(cashBoxId);

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
    const income = session.total_income.toNumber();
    const expenses = session.total_expenses.toNumber();
    const theoreticalBalance = session.opening_balance.toNumber() + income - expenses;
    const difference = dto.actual_balance - theoreticalBalance;

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
    const income = session.total_income.toNumber();
    const expenses = session.total_expenses.toNumber();
    const theoreticalBalance = session.opening_balance.toNumber() + income - expenses;
    const difference = dto.actual_balance - theoreticalBalance;

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
      return { message: 'No hay sesión abierta', session: null };
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
