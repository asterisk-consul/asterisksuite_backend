import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateObligationDto, CreateObligationTemplateDto, UpdateObligationDto } from './dto/upsert-obligation.dto';

@Injectable()
export class TreasuryObligationsService {
  constructor(private readonly db: PrismaService) {}
  private get prisma() { return this.db.getClientForCurrentContext(); }

  async findAll(filters: { status?: string; category?: string; from?: string; to?: string; search?: string }) {
    const where: any = { deleted_at: null };
    if (filters.category) where.category = filters.category;
    if (filters.status && filters.status !== 'ALL') where.status = filters.status;
    if (filters.from || filters.to) where.due_date = {
      ...(filters.from ? { gte: new Date(filters.from) } : {}),
      ...(filters.to ? { lte: new Date(filters.to) } : {}),
    };
    const rows = await this.prisma.treasury_obligations.findMany({
      where,
      include: { template: { select: { id: true, name: true, active: true, variable_amount: true } } },
      orderBy: [{ due_date: 'asc' }, { created_at: 'desc' }],
    });
    const partyIds = [...new Set(rows.map(row => row.party_id))];
    const parties = partyIds.length ? await this.prisma.business_parties.findMany({
      where: { id: { in: partyIds }, deleted_at: null },
      select: { id: true, name: true, tax_id: true, type: true },
    }) : [];
    const partyMap = new Map(parties.map(party => [party.id, party]));
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const data = rows.map(row => {
      const dueDate = new Date(row.due_date); dueDate.setHours(0, 0, 0, 0);
      const daysUntilDue = Math.round((dueDate.getTime() - today.getTime()) / 86_400_000);
      const notificationDays = Array.isArray(row.notification_days)
        ? row.notification_days.map(Number).filter(Number.isFinite)
        : [];
      const pending = !['PAID', 'CANCELLED'].includes(row.status);
      const overdue = pending && daysUntilDue < 0;
      const shouldNotify = pending && (overdue || notificationDays.some(days => daysUntilDue >= 0 && daysUntilDue <= days));
      return {
        ...row,
        party: partyMap.get(row.party_id) ?? null,
        effective_status: !pending ? row.status : overdue ? 'OVERDUE' : row.status,
        should_notify: shouldNotify,
        notification_reason: !shouldNotify ? null : overdue
          ? `Venció hace ${Math.abs(daysUntilDue)} día(s)`
          : daysUntilDue === 0 ? 'Vence hoy' : `Vence en ${daysUntilDue} día(s)`,
      };
    }).filter(row => {
      const term = filters.search?.trim().toLowerCase();
      return !term || row.description.toLowerCase().includes(term)
        || row.reference?.toLowerCase().includes(term)
        || row.party?.name.toLowerCase().includes(term);
    });
    return data;
  }

  async summary() {
    const rows = await this.findAll({});
    const pending = rows.filter(r => !['PAID', 'CANCELLED'].includes(r.status));
    const pendingByCurrency = pending.reduce((totals: Record<string, number>, row: any) => {
      totals[row.currency_code] = (totals[row.currency_code] ?? 0) + Number(row.amount ?? row.estimated_amount);
      return totals;
    }, {} as Record<string, number>);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const next30 = new Date(today); next30.setDate(next30.getDate() + 30);
    return {
      pending_amount: pendingByCurrency.ARS ?? 0,
      pending_by_currency: pendingByCurrency,
      overdue: rows.filter(r => r.effective_status === 'OVERDUE').length,
      due_soon: rows.filter(r => !['PAID', 'CANCELLED'].includes(r.status) && new Date(r.due_date) >= today && new Date(r.due_date) <= next30).length,
      notifications_today: rows.filter(r => r.should_notify).length,
      requires_review: rows.filter(r => ['PLANNED', 'REVIEW'].includes(r.status)).length,
    };
  }

  async findTemplates() {
    const templates = await this.prisma.treasury_obligation_templates.findMany({
      where: { deleted_at: null },
      include: { _count: { select: { obligations: true } } },
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
    const partyIds = [...new Set(templates.map(item => item.party_id))];
    const parties = partyIds.length ? await this.prisma.business_parties.findMany({
      where: { id: { in: partyIds } }, select: { id: true, name: true },
    }) : [];
    const map = new Map(parties.map(p => [p.id, p]));
    return templates.map(item => ({ ...item, party: map.get(item.party_id) ?? null }));
  }

  async create(dto: CreateObligationDto, userId: string) {
    await this.assertParty(dto.party_id, dto.category);
    await this.assertTreatment(dto.treatment ?? 'DIRECT_EXPENSE', dto.service_product_id, dto.expense_account_id);
    return this.prisma.treasury_obligations.create({
      data: {
        ...dto,
        period_key: new Date(dto.due_date).toISOString().slice(0, 7),
        issue_date: dto.issue_date ? new Date(dto.issue_date) : null,
        due_date: new Date(dto.due_date),
        second_due_date: dto.second_due_date ? new Date(dto.second_due_date) : null,
        notification_days: dto.notification_days ?? [7],
        status: dto.amount != null ? 'READY' : 'REVIEW',
        created_by: userId,
      } as any,
    });
  }

  async update(id: string, dto: UpdateObligationDto, userId: string) {
    const current = await this.findOne(id);
    if (dto.party_id || dto.category) {
      await this.assertParty(dto.party_id ?? current.party_id, dto.category ?? current.category);
    }
    if (dto.treatment || dto.service_product_id || dto.expense_account_id) {
      await this.assertTreatment(
        dto.treatment ?? current.treatment,
        dto.service_product_id ?? current.service_product_id ?? undefined,
        dto.expense_account_id ?? current.expense_account_id ?? undefined,
      );
    }
    return this.prisma.treasury_obligations.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.treatment === 'FISCAL_INVOICE' ? { expense_account_id: null } : {}),
        ...(dto.treatment === 'DIRECT_EXPENSE' ? { service_product_id: null, net_amount: null } : {}),
        issue_date: dto.issue_date ? new Date(dto.issue_date) : undefined,
        due_date: dto.due_date ? new Date(dto.due_date) : undefined,
        second_due_date: dto.second_due_date ? new Date(dto.second_due_date) : undefined,
        notification_days: dto.notification_days,
        updated_by: userId,
      } as any,
    });
  }

  async confirm(id: string, userId: string) {
    const row = await this.findOne(id);
    await this.assertTreatment(row.treatment, row.service_product_id ?? undefined, row.expense_account_id ?? undefined);
    if (row.treatment === 'FISCAL_INVOICE' && !row.document_id) {
      throw new BadRequestException('Primero cargá la factura fiscal para calcular IVA y otros impuestos');
    }
    const amount = row.amount ?? row.estimated_amount;
    if (Number(amount) <= 0) throw new BadRequestException('Ingresá un importe antes de confirmar la obligación');
    return this.prisma.treasury_obligations.update({
      where: { id },
      data: { amount, status: 'READY', confirmed_at: new Date(), updated_by: userId },
    });
  }

  async markPaid(id: string, paymentId: string, userId: string) {
    await this.findOne(id);
    const payment = await this.prisma.payments.findFirst({ where: { id: paymentId, deleted_at: null } });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    return this.prisma.treasury_obligations.update({
      where: { id },
      data: {
        payment_id: paymentId,
        status: ['CONFIRMED', 'PAID'].includes(payment.status) ? 'PAID' : 'READY',
        paid_at: ['CONFIRMED', 'PAID'].includes(payment.status) ? payment.date : null,
        updated_by: userId,
      },
    });
  }

  async cancel(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.treasury_obligations.update({
      where: { id }, data: { status: 'CANCELLED', updated_by: userId },
    });
  }

  async createTemplate(dto: CreateObligationTemplateDto, userId: string) {
    await this.assertParty(dto.party_id, dto.category);
    await this.assertTreatment(dto.treatment ?? 'DIRECT_EXPENSE', dto.service_product_id, dto.expense_account_id);
    const interval = dto.frequency === 'CUSTOM' ? dto.interval_months ?? 1 : ({
      MONTHLY: 1, BIMONTHLY: 2, QUARTERLY: 3, SEMIANNUAL: 6, ANNUAL: 12,
    } as Record<string, number>)[dto.frequency];
    return this.prisma.$transaction(async tx => {
      const template = await tx.treasury_obligation_templates.create({
        data: {
          ...dto,
          interval_months: interval,
          start_date: new Date(dto.start_date),
          end_date: dto.end_date ? new Date(dto.end_date) : null,
          notification_days: dto.notification_days ?? [7],
          created_by: userId,
        } as any,
      });
      const dates = this.generateDates(new Date(dto.start_date), dto.due_day, interval, dto.occurrences, dto.end_date ? new Date(dto.end_date) : undefined);
      await tx.treasury_obligations.createMany({
        data: dates.map(dueDate => ({
          template_id: template.id,
          party_id: dto.party_id,
          category: dto.category,
          treatment: dto.treatment ?? 'DIRECT_EXPENSE',
          service_product_id: dto.service_product_id ?? null,
          expense_account_id: dto.expense_account_id ?? null,
          period_key: dueDate.toISOString().slice(0, 7),
          description: dto.name,
          due_date: dueDate,
          estimated_amount: dto.estimated_amount,
          net_amount: dto.net_amount ?? null,
          amount: dto.variable_amount ? null : dto.estimated_amount,
          currency_code: dto.currency_code,
          status: dto.variable_amount ? 'REVIEW' : 'PLANNED',
          notification_days: dto.notification_days ?? [7],
          created_by: userId,
        })) as any,
        skipDuplicates: true,
      });
      return template;
    });
  }

  async toggleTemplate(id: string, active: boolean, userId: string) {
    return this.prisma.treasury_obligation_templates.update({
      where: { id }, data: { active, updated_by: userId },
    });
  }

  private generateDates(start: Date, dueDay: number, interval: number, count?: number, end?: Date) {
    const dates: Date[] = [];
    const max = count ?? (end ? 120 : 12);
    for (let index = 0; index < max; index++) {
      const base = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + index * interval, 1));
      const lastDay = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + 1, 0)).getUTCDate();
      const date = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), Math.min(dueDay, lastDay)));
      if (end && date > end) break;
      dates.push(date);
    }
    return dates;
  }

  private async findOne(id: string) {
    const row = await this.prisma.treasury_obligations.findFirst({ where: { id, deleted_at: null } });
    if (!row) throw new NotFoundException('Obligación no encontrada');
    return row;
  }

  private async assertParty(id: string, category: string) {
    const party = await this.prisma.business_parties.findFirst({ where: { id, deleted_at: null, active: true } });
    if (!party) throw new BadRequestException('La entidad seleccionada no existe o está inactiva');
    const allowedByCategory: Record<string, string[]> = {
      TAX: ['TAX_AUTHORITY'],
      UTILITY: ['UTILITY'],
      SERVICE: ['SERVICE_PROVIDER'],
      FINANCIAL: ['FINANCIAL'],
      OTHER: ['TAX_AUTHORITY', 'UTILITY', 'SERVICE_PROVIDER', 'FINANCIAL'],
    };
    if (!(allowedByCategory[category] ?? []).includes(party.type)) {
      throw new BadRequestException('La parte interesada seleccionada no corresponde a la categoría de la obligación');
    }
  }

  private async assertTreatment(treatment: string, productId?: string, accountId?: string) {
    if (treatment === 'FISCAL_INVOICE') {
      if (!productId) throw new BadRequestException('Seleccioná un concepto de servicio para la factura fiscal');
      const product = await this.prisma.products.findFirst({
        where: { id: productId, deleted_at: null, active: true },
        select: { product_type: true, manages_stock: true },
      });
      if (!product || product.product_type !== 'SERVICE' || product.manages_stock) {
        throw new BadRequestException('El concepto fiscal debe ser un servicio activo que no maneje stock');
      }
      return;
    }
    if (!accountId) throw new BadRequestException('Seleccioná una cuenta de gasto para el pago directo');
    const account = await this.prisma.accounts.findFirst({
      where: { id: accountId, deleted_at: null, active: true, account_type: 'EXPENSE' },
      select: { id: true },
    });
    if (!account) throw new BadRequestException('La cuenta seleccionada debe ser una cuenta de gasto activa');
  }
}
