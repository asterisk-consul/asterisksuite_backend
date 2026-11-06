import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { EffectiveCompanyModules, EffectiveModuleState, EffectivePlatformModule } from './platform-modules.types';

type CacheEntry = {
  expiresAt: number;
  value: EffectiveCompanyModules;
};

@Injectable()
export class PlatformModulesService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly cacheTtlMs = this.readBoundedSetting('PLATFORM_MODULE_CACHE_TTL_MS', 60_000, 0, 3_600_000);
  private readonly cacheMaxEntries = this.readBoundedSetting('PLATFORM_MODULE_CACHE_MAX_ENTRIES', 500, 1, 10_000);

  constructor(private readonly db: PrismaService) {}

  async getEffectiveModules(
    companyId: string,
    options: { bypassCache?: boolean; now?: Date } = {},
  ): Promise<EffectiveCompanyModules> {
    const now = options.now ?? new Date();
    const cached = this.cache.get(companyId);
    if (!options.bypassCache && cached && cached.expiresAt > now.getTime()) {
      // Map conserva el orden de inserción; refrescarlo implementa una LRU acotada.
      this.cache.delete(companyId);
      this.cache.set(companyId, cached);
      return cached.value;
    }
    if (cached) this.cache.delete(companyId);

    const prisma = this.db.getDefaultClient();
    const [catalog, subscription, overrides] = await Promise.all([
      prisma.platform_modules.findMany({
        where: { active: true },
        orderBy: [{ sort_order: 'asc' }, { name: 'asc' }],
      }),
      prisma.company_subscriptions.findUnique({
        where: { company_id: companyId },
        include: {
          plan: {
            include: {
              modules: {
                where: { enabled: true },
              },
            },
          },
        },
      }),
      prisma.company_module_overrides.findMany({
        where: {
          company_id: companyId,
          OR: [{ expires_at: null }, { expires_at: { gt: now } }],
        },
      }),
    ]);

    const planModules = new Map(
      subscription?.plan.modules.map((item) => [item.module_code, this.asRecord(item.limits)]) ?? [],
    );
    const overrideByModule = new Map<string, { state: EffectiveModuleState; reason: string | null }>(
      overrides.map((item) => [item.module_code, { state: item.state, reason: item.reason }]),
    );
    const subscriptionAllowsUse =
      subscription?.status === 'ACTIVE' ||
      (subscription?.status === 'TRIAL' && (!subscription.trial_ends_at || subscription.trial_ends_at > now));
    const subscriptionReadOnly = subscription?.status === 'PAST_DUE';

    const modules: EffectivePlatformModule[] = catalog.map((item) => {
      const dependencies = this.asStringArray(item.dependencies);
      const override = overrideByModule.get(item.code);
      let state: EffectiveModuleState = 'DISABLED';
      let source: EffectivePlatformModule['source'] = 'UNAVAILABLE';
      let reason: string | null = null;

      if (item.is_core) {
        state = 'ENABLED';
        source = 'CORE';
      } else if (subscriptionAllowsUse && planModules.has(item.code)) {
        state = 'ENABLED';
        source = 'PLAN';
      } else if (subscriptionReadOnly && planModules.has(item.code)) {
        state = 'READ_ONLY';
        source = 'PLAN';
        reason = 'La suscripción requiere regularización';
      } else if (!subscription) {
        reason = 'La empresa todavía no tiene un plan asignado';
      } else if (subscription.status === 'TRIAL') {
        reason = 'El período de prueba finalizó';
      } else if (!planModules.has(item.code)) {
        reason = 'El módulo no está incluido en el plan';
      } else {
        reason = `La suscripción está en estado ${subscription.status}`;
      }

      // CORE nunca se deshabilita: mantiene disponibles autenticación,
      // selección de empresa y configuración mínima.
      if (override && !item.is_core) {
        state = override.state;
        source = 'OVERRIDE';
        reason = override.reason;
      }

      return {
        code: item.code,
        name: item.name,
        description: item.description,
        icon: item.icon,
        sortOrder: item.sort_order,
        isCore: item.is_core,
        state,
        enabled: state !== 'DISABLED',
        readOnly: state === 'READ_ONLY',
        source,
        reason,
        dependencies,
        limits: planModules.get(item.code) ?? {},
      };
    });

    this.applyDependencyRules(modules);

    const value: EffectiveCompanyModules = {
      companyId,
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            planCode: subscription.plan.code,
            planName: subscription.plan.name,
            startsAt: subscription.starts_at,
            trialEndsAt: subscription.trial_ends_at,
            renewsAt: subscription.renews_at,
          }
        : null,
      modules,
      resolvedAt: now,
    };

    if (this.cacheTtlMs > 0) {
      this.pruneCache(now.getTime());
      this.cache.set(companyId, {
        expiresAt: now.getTime() + this.cacheTtlMs,
        value,
      });
    }

    return value;
  }

  async getModule(companyId: string, moduleCode: string): Promise<EffectivePlatformModule | null> {
    const result = await this.getEffectiveModules(companyId);
    return result.modules.find((item) => item.code === moduleCode) ?? null;
  }

  async hasModule(companyId: string, moduleCode: string): Promise<boolean> {
    const module = await this.getModule(companyId, moduleCode);
    return module?.enabled ?? false;
  }

  async hasModuleOrLegacyAccess(companyId: string, moduleCode: string): Promise<boolean> {
    try {
      return await this.hasModule(companyId, moduleCode);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === 'P2021' || code === 'P2022') return true;
      throw error;
    }
  }

  async hasEveryModule(companyId: string, moduleCodes: string[]): Promise<boolean> {
    const result = await this.getEffectiveModules(companyId);
    const enabled = new Set(result.modules.filter((item) => item.enabled).map((item) => item.code));
    return moduleCodes.every((code) => enabled.has(code));
  }

  async hasEveryModuleOrLegacyAccess(companyId: string, moduleCodes: string[]): Promise<boolean> {
    try {
      return await this.hasEveryModule(companyId, moduleCodes);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === 'P2021' || code === 'P2022') return true;
      throw error;
    }
  }

  async hasAnyModule(companyId: string, moduleCodes: string[]): Promise<boolean> {
    const result = await this.getEffectiveModules(companyId);
    const enabled = new Set(result.modules.filter((item) => item.enabled).map((item) => item.code));
    return moduleCodes.some((code) => enabled.has(code));
  }

  async hasAnyModuleOrLegacyAccess(companyId: string, moduleCodes: string[]): Promise<boolean> {
    try {
      return await this.hasAnyModule(companyId, moduleCodes);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      if (code === 'P2021' || code === 'P2022') return true;
      throw error;
    }
  }

  async getLimit<T = unknown>(companyId: string, moduleCode: string, key: string): Promise<T | null> {
    const module = await this.getModule(companyId, moduleCode);
    return (module?.limits[key] as T | undefined) ?? null;
  }

  invalidate(companyId?: string): void {
    if (companyId) {
      this.cache.delete(companyId);
      return;
    }
    this.cache.clear();
  }

  private applyDependencyRules(modules: EffectivePlatformModule[]): void {
    const byCode = new Map(modules.map((item) => [item.code, item]));
    let changed = true;

    // Se itera hasta estabilizar para cubrir dependencias encadenadas.
    while (changed) {
      changed = false;
      for (const module of modules) {
        if (!module.enabled || module.isCore) continue;

        const unavailable = module.dependencies.find((code) => !byCode.get(code)?.enabled);
        if (unavailable) {
          module.state = 'DISABLED';
          module.enabled = false;
          module.readOnly = false;
          module.source = 'DEPENDENCY';
          module.reason = `Requiere el módulo ${unavailable}`;
          changed = true;
          continue;
        }

        const readOnlyDependency = module.dependencies.find((code) => byCode.get(code)?.readOnly);
        if (readOnlyDependency && !module.readOnly) {
          module.state = 'READ_ONLY';
          module.readOnly = true;
          module.source = 'DEPENDENCY';
          module.reason = `El módulo ${readOnlyDependency} está en modo solo lectura`;
          changed = true;
        }
      }
    }
  }

  private asStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
  }

  private readBoundedSetting(name: string, fallback: number, min: number, max: number): number {
    const value = Number(process.env[name] ?? fallback);
    return Number.isFinite(value) ? Math.min(max, Math.max(min, Math.floor(value))) : fallback;
  }

  private pruneCache(now: number): void {
    for (const [companyId, entry] of this.cache) {
      if (entry.expiresAt <= now) this.cache.delete(companyId);
    }
    while (this.cache.size >= this.cacheMaxEntries) {
      const oldestCompanyId = this.cache.keys().next().value;
      if (!oldestCompanyId) break;
      this.cache.delete(oldestCompanyId);
    }
  }
}
