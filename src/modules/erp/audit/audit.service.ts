import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { AuditActionFilter, QueryAuditDto } from './dto/query-audit.dto';

type AuditLog = {
  id: string;
  table_name: string;
  record_id: string;
  old_data: any;
  new_data: any;
  changed_by: string | null;
  changed_at: Date;
  ip_address: string | null;
  request_id: string | null;
  action: any;
};

type UserSummary = {
  id: string;
  name: string;
  email: string;
};

type AuditLogWithUser = AuditLog & { user: UserSummary | null };

const SENSITIVE_AUDIT_KEY = /(password|token|secret|api.?key|private.?key)/i;
const AUDIT_ACTIONS = new Set<string>(Object.values(AuditActionFilter));

function redactAuditData(value: any): any {
  if (Array.isArray(value)) return value.map(redactAuditData);
  if (!value || typeof value !== 'object' || value instanceof Date) return value;

  return Object.fromEntries(Object.entries(value).map(([key, child]) => [
    key,
    SENSITIVE_AUDIT_KEY.test(key) ? '[REDACTADO]' : redactAuditData(child),
  ]));
}

function parseFilters(serialized?: string): any[] {
  if (!serialized?.trim()) return [];
  try {
    const parsed = JSON.parse(serialized);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function stringFilter(value: unknown, operator: string): any | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const normalized = value.trim();
  if (operator === 'equals') return normalized;
  if (operator === 'startsWith') return { startsWith: normalized, mode: 'insensitive' };
  if (operator === 'endsWith') return { endsWith: normalized, mode: 'insensitive' };
  return { contains: normalized, mode: 'insensitive' };
}

function dateRangeFilter(value: any): any | null {
  if (!value || typeof value !== 'object') return null;
  const range: Record<string, Date> = {};
  if (typeof value.start === 'string' && !Number.isNaN(Date.parse(value.start))) {
    range.gte = new Date(value.start);
  }
  if (typeof value.end === 'string' && !Number.isNaN(Date.parse(value.end))) {
    const end = new Date(value.end);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value.end)) end.setHours(23, 59, 59, 999);
    range.lte = end;
  }
  return Object.keys(range).length ? range : null;
}

@Injectable()
export class AuditService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /**
   * Cross-DB: resuelve info de usuario desde public.users para una lista de audit logs.
   * Los audit logs del tenant solo tienen el UUID (changed_by),
   * pero la tabla users vive en la base public.
   */
  private async resolveUsers(logs: AuditLog[]): Promise<AuditLogWithUser[]> {
    const userIds = [
      ...new Set(logs.map((l) => l.changed_by).filter(Boolean)),
    ] as string[];

    if (userIds.length === 0) {
      return logs.map((log) => this.withRedactedData(log, null));
    }

    const publicPrisma = this.db.getDefaultClient();
    const found = await publicPrisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const usersMap = Object.fromEntries(found.map((u) => [u.id, u]));

    return logs.map((log) => this.withRedactedData(
      log,
      log.changed_by ? (usersMap[log.changed_by] ?? null) : null,
    ));
  }

  private withRedactedData(log: AuditLog, user: UserSummary | null): AuditLogWithUser {
    return {
      ...log,
      old_data: redactAuditData(log.old_data),
      new_data: redactAuditData(log.new_data),
      user,
    };
  }

  /**
   * Consulta general de audit logs con filtros
   */
  async findAll(query: QueryAuditDto) {
    const { table, record_id, action, user_id, days, limit = 50, offset = 0 } = query;
    const conditions: any[] = [];

    if (table) conditions.push({ table_name: table });
    if (record_id) conditions.push({ record_id });
    if (action) conditions.push({ action });
    if (user_id) conditions.push({ changed_by: user_id === '__system__' ? null : user_id });
    if (query.date) {
      const { start, end } = this.getArgentinaDayRange(query.date);
      conditions.push({ changed_at: { gte: start, lt: end } });
    }
    if (days) {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      conditions.push({ changed_at: { gte: since } });
    }

    for (const filter of parseFilters(query.filters)) {
      const value = filter?.value;
      const operator = String(filter?.operator ?? 'contains');
      if (filter?.column === 'table_name' || filter?.column === 'record_id') {
        const condition = stringFilter(value, operator);
        if (condition) conditions.push({ [filter.column]: condition });
      } else if (filter?.column === 'action') {
        if (operator === 'in' && Array.isArray(value)) {
          const actions = value.filter((item) => AUDIT_ACTIONS.has(item));
          if (actions.length) conditions.push({ action: { in: actions } });
        } else if (AUDIT_ACTIONS.has(value)) {
          conditions.push({ action: value });
        }
      } else if (filter?.column === 'changed_at') {
        const range = dateRangeFilter(value);
        if (range) conditions.push({ changed_at: range });
      }
    }

    const search = query.search?.trim();
    if (search) {
      const matchingUsers = await this.db.getDefaultClient().users.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        },
        select: { id: true },
        take: 100,
      });
      const searchConditions: any[] = [
        { table_name: { contains: search, mode: 'insensitive' } },
        { record_id: { contains: search, mode: 'insensitive' } },
      ];
      const normalizedAction = search.toUpperCase();
      if (AUDIT_ACTIONS.has(normalizedAction)) searchConditions.push({ action: normalizedAction });
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search)) {
        searchConditions.push({ changed_by: search });
      }
      if (matchingUsers.length) searchConditions.push({ changed_by: { in: matchingUsers.map((user) => user.id) } });
      conditions.push({ OR: searchConditions });
    }

    const where = conditions.length ? { AND: conditions } : {};
    const sortField = ['changed_at', 'table_name', 'record_id', 'action'].includes(query.sort ?? '')
      ? query.sort!
      : 'changed_at';
    const order = query.order === 'asc' ? 'asc' : 'desc';

    const [logs, total] = await Promise.all([
      this.prisma.audit_logs.findMany({
        where,
        orderBy: [{ [sortField]: order } as any, { id: 'desc' }],
        take: limit,
        skip: offset,
      }),
      this.prisma.audit_logs.count({ where }),
    ]);

    const data = await this.resolveUsers(logs);

    return {
      data,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  /** Resumen acotado a un día para la agenda de auditoría. */
  async getAgenda(date?: string) {
    const dateKey = date ?? this.resolveArgentinaToday();
    const { start, end } = this.getArgentinaDayRange(dateKey);
    const where = { changed_at: { gte: start, lt: end } };

    const [actions, groupedUsers] = await Promise.all([
      this.prisma.audit_logs.groupBy({
        by: ['action'],
        where,
        _count: true,
      }),
      this.prisma.audit_logs.groupBy({
        by: ['changed_by'],
        where,
        _count: true,
        orderBy: { _count: { changed_by: 'desc' } },
        take: 101,
      }),
    ]);

    const visibleUserGroups = groupedUsers.slice(0, 100);
    const userIds = visibleUserGroups.map((group) => group.changed_by).filter((id): id is string => Boolean(id));
    const users = userIds.length
      ? await this.db.getDefaultClient().users.findMany({
          where: { id: { in: userIds } },
          select: { id: true, name: true, email: true },
        })
      : [];
    const usersById = new Map(users.map((user) => [user.id, user]));
    const byAction = Object.fromEntries(actions.map((item) => [item.action, item._count])) as Record<string, number>;

    return {
      date: dateKey,
      total: actions.reduce((total, item) => total + item._count, 0),
      byAction,
      users: visibleUserGroups.map((group) => ({
        user_id: group.changed_by,
        user: group.changed_by ? usersById.get(group.changed_by) ?? null : null,
        count: group._count,
      })),
      usersTruncated: groupedUsers.length > 100,
    };
  }

  private resolveArgentinaToday() {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    return `${parts.find((part) => part.type === 'year')?.value}-${parts.find((part) => part.type === 'month')?.value}-${parts.find((part) => part.type === 'day')?.value}`;
  }

  private getArgentinaDayRange(date: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) throw new BadRequestException('La fecha debe tener el formato YYYY-MM-DD.');
    const [, yearValue, monthValue, dayValue] = match;
    const year = Number(yearValue);
    const month = Number(monthValue);
    const day = Number(dayValue);
    const normalized = new Date(Date.UTC(year, month - 1, day));
    if (normalized.getUTCFullYear() !== year || normalized.getUTCMonth() + 1 !== month || normalized.getUTCDate() !== day) {
      throw new BadRequestException('La fecha seleccionada no es válida.');
    }
    const start = new Date(`${date}T00:00:00.000-03:00`);
    return { start, end: new Date(start.getTime() + 24 * 60 * 60 * 1000) };
  }

  /**
   * Historial completo de un registro específico
   */
  async findByRecord(table: string, recordId: string) {
    const logs = await this.prisma.audit_logs.findMany({
      where: {
        table_name: table,
        record_id: recordId,
      },
      orderBy: { changed_at: 'desc' },
    });

    return this.resolveUsers(logs);
  }

  /**
   * Actividad de un usuario específico
   */
  async findByUser(userId: string, days?: number) {
    const where: any = {
      changed_by: userId,
    };

    if (days) {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      where.changed_at = { gte: since };
    }

    const logs = await this.prisma.audit_logs.findMany({
      where,
      orderBy: { changed_at: 'desc' },
      take: 100,
    });

    return this.resolveUsers(logs);
  }

  /**
   * Resumen de actividad (stats)
   */
  async getStats(days: number = 7) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalByAction, totalByTable, recentCount] = await Promise.all([
      this.prisma.audit_logs.groupBy({
        by: ['action'],
        where: { changed_at: { gte: since } },
        _count: true,
      }),
      this.prisma.audit_logs.groupBy({
        by: ['table_name'],
        where: { changed_at: { gte: since } },
        _count: true,
        orderBy: { _count: { table_name: 'desc' } },
        take: 10,
      }),
      this.prisma.audit_logs.count({
        where: { changed_at: { gte: since } },
      }),
    ]);

    return {
      period: `${days} days`,
      total: recentCount,
      byAction: totalByAction.map((r) => ({ action: r.action, count: r._count })),
      topTables: totalByTable.map((r) => ({ table: r.table_name, count: r._count })),
    };
  }
}
