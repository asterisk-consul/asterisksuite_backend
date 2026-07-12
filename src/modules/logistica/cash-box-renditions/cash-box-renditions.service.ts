import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCashBoxRenditionDto } from './dto/create-cash-box-rendition.dto';
import { ApproveRenditionDto } from './dto/approve-rendition.dto';

@Injectable()
export class CashBoxRenditionsService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreateCashBoxRenditionDto, userId: string) {
    // Validar caja
    const box = await this.prisma.cash_boxes.findFirst({
      where: { id: dto.cash_box_id, deleted_at: null },
    });
    if (!box) throw new NotFoundException('Caja no encontrada');

    // Obtener próximo número de rendición
    const lastRendition = await this.prisma.cash_box_renditions.findFirst({
      where: { cash_box_id: dto.cash_box_id, deleted_at: null },
      orderBy: { rendition_number: 'desc' },
    });
    const nextNumber = (lastRendition?.rendition_number ?? 0) + 1;

    // Agregar movimientos del rango de fechas
    const startDate = new Date(dto.start_date);
    const endDate = new Date(dto.end_date);
    endDate.setHours(23, 59, 59, 999);

    const movements = await this.prisma.cash_box_movements.findMany({
      where: {
        cash_box_id: dto.cash_box_id,
        deleted_at: null,
        date: { gte: startDate, lte: endDate },
      },
    });

    let totalIncome = 0;
    let totalExpenses = 0;
    for (const m of movements) {
      const isOutflow = ['PAYMENT', 'LOAN', 'CHECK_ISSUED', 'TRANSFER'].includes(m.type);
      if (isOutflow) {
        totalExpenses += m.amount.toNumber();
      } else {
        totalIncome += m.amount.toNumber();
      }
    }

    const difference = dto.actual_balance != null
      ? dto.actual_balance - dto.closing_balance
      : undefined;

    return this.prisma.cash_box_renditions.create({
      data: {
        cash_box_id: dto.cash_box_id,
        rendition_number: nextNumber,
        start_date: startDate,
        end_date: endDate,
        opening_balance: dto.opening_balance,
        total_income: totalIncome,
        total_expenses: totalExpenses,
        closing_balance: dto.closing_balance,
        actual_balance: dto.actual_balance,
        difference,
        notes: dto.notes,
        status: 'pending',
        created_by: userId,
      },
    });
  }

  async findAll(cashBoxId?: string) {
    const where: Record<string, any> = { deleted_at: null };
    if (cashBoxId) where.cash_box_id = cashBoxId;

    return this.prisma.cash_box_renditions.findMany({
      where,
      orderBy: { rendition_number: 'desc' },
      include: {
        cash_box: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: string) {
    const rendition = await this.prisma.cash_box_renditions.findFirst({
      where: { id, deleted_at: null },
      include: { cash_box: { select: { id: true, name: true } } },
    });
    if (!rendition) throw new NotFoundException('Rendición no encontrada');
    return rendition;
  }

  async approve(id: string, dto: ApproveRenditionDto, userId: string) {
    const rendition = await this.findOne(id);
    if (rendition.status !== 'pending') {
      throw new BadRequestException('Solo se pueden aprobar rendiciones pendientes');
    }

    const difference = dto.actual_balance != null
      ? dto.actual_balance - rendition.closing_balance.toNumber()
      : undefined;

    return this.prisma.cash_box_renditions.update({
      where: { id },
      data: {
        actual_balance: dto.actual_balance ?? rendition.actual_balance,
        difference,
        status: 'approved',
        approved_by: userId,
        approved_at: new Date(),
        notes: dto.notes ?? rendition.notes,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async reject(id: string, userId: string) {
    const rendition = await this.findOne(id);
    if (rendition.status !== 'pending') {
      throw new BadRequestException('Solo se pueden rechazar rendiciones pendientes');
    }

    return this.prisma.cash_box_renditions.update({
      where: { id },
      data: {
        status: 'rejected',
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  async remove(id: string, userId: string) {
    const rendition = await this.findOne(id);
    if (rendition.status === 'approved') {
      throw new BadRequestException('No se puede eliminar una rendición aprobada');
    }

    return this.prisma.cash_box_renditions.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }
}
