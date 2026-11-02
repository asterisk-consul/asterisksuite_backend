import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../../prisma/prisma.service';
import { EffectiveModuleState } from './platform-modules.types';

export interface PlatformModuleAuditEvent {
  companyId: string;
  userId: string | null;
  moduleCode: string;
  state: EffectiveModuleState;
  method: string;
  path: string;
  ip: string | null;
  reason: string | null;
  mode: 'audit' | 'enforce';
}

@Injectable()
export class PlatformModuleAuditService {
  private readonly logger = new Logger(PlatformModuleAuditService.name);
  private readonly recentlyRecorded = new Map<string, number>();
  private readonly dedupeMs = Math.max(0, Number(process.env.PLATFORM_MODULE_AUDIT_DEDUPE_MS ?? 5 * 60 * 1000));

  constructor(private readonly db: PrismaService) {}

  @Cron('20 3 * * *', { timeZone: 'America/Argentina/Buenos_Aires' })
  async removeExpiredEvents(): Promise<void> {
    const retentionDays = Math.max(7, Number(process.env.PLATFORM_MODULE_AUDIT_RETENTION_DAYS ?? 90));
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    await this.db.getDefaultClient().audit_logs_public.deleteMany({
      where: { table_name: 'platform_module_access', changed_at: { lt: cutoff } },
    });
  }

  async record(event: PlatformModuleAuditEvent): Promise<void> {
    const key = [
      event.companyId,
      event.userId ?? 'anonymous',
      event.moduleCode,
      event.state,
      event.method,
      event.path,
    ].join(':');
    const now = Date.now();
    const lastRecorded = this.recentlyRecorded.get(key) ?? 0;
    if (now - lastRecorded < this.dedupeMs) return;
    this.recentlyRecorded.delete(key);
    this.recentlyRecorded.set(key, now);
    this.prune(now);

    try {
      await this.db.getDefaultClient().audit_logs_public.create({
        data: {
          table_name: 'platform_module_access',
          record_id: randomUUID(),
          action: 'CREATE',
          changed_by: event.userId,
          ip_address: event.ip,
          new_data: {
            companyId: event.companyId,
            moduleCode: event.moduleCode,
            moduleState: event.state,
            method: event.method,
            path: event.path,
            reason: event.reason,
            mode: event.mode,
          },
        },
      });
    } catch (error) {
      // La auditoría comercial nunca debe interrumpir una operación del ERP.
      this.recentlyRecorded.delete(key);
      this.logger.warn(`No se pudo registrar auditoría de módulos: ${String(error)}`);
    }
  }

  private prune(now: number): void {
    for (const [key, timestamp] of this.recentlyRecorded) {
      if (now - timestamp >= this.dedupeMs) this.recentlyRecorded.delete(key);
    }
    while (this.recentlyRecorded.size > 1_000) {
      const oldestKey = this.recentlyRecorded.keys().next().value;
      if (!oldestKey) break;
      this.recentlyRecorded.delete(oldestKey);
    }
  }
}
