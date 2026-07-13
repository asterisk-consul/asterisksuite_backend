import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { QueryAuditDto } from './dto/query-audit.dto';

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
      return logs.map((log) => ({ ...log, user: null }));
    }

    const publicPrisma = this.db.getDefaultClient();
    const found = await publicPrisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });

    const usersMap = Object.fromEntries(found.map((u) => [u.id, u]));

    return logs.map((log) => ({
      ...log,
      user: log.changed_by ? (usersMap[log.changed_by] ?? null) : null,
    }));
  }

  /**
   * Consulta general de audit logs con filtros
   */
  async findAll(query: QueryAuditDto) {
    const { table, record_id, action, user_id, days, limit = 50, offset = 0 } = query;

    const where: any = {};

    if (table) where.table_name = table;
    if (record_id) where.record_id = record_id;
    if (action) where.action = action;
    if (user_id) where.changed_by = user_id;
    if (days) {
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      where.changed_at = { gte: since };
    }

    const [logs, total] = await Promise.all([
      this.prisma.audit_logs.findMany({
        where,
        orderBy: { changed_at: 'desc' },
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
