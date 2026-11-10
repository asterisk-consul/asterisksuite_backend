import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CompaniesService } from '../companies/companies.service';
import {
  CreatePlatformCompanyDto,
  CreatePlatformPlanDto,
  SetCompanyModuleOverrideDto,
  SetCompanySubscriptionDto,
  SetPlatformPlanModulesDto,
  UpdatePlatformPlanDto,
} from './dto/platform-plans.dto';
import { PlatformModulesService } from './platform-modules.service';

type PlatformRole = 'PLATFORM_OWNER' | 'PLATFORM_ADMIN';

@Injectable()
export class PlatformPlansService {
  constructor(
    private readonly db: PrismaService,
    private readonly modules: PlatformModulesService,
    private readonly companies: CompaniesService,
  ) {}

  async assertPlatformAdmin(userId: string): Promise<PlatformRole> {
    const user = await this.db.getDefaultClient().users.findUnique({
      where: { id: userId },
      select: { role: true, active: true, deleted_at: true },
    });
    if (
      !user?.active ||
      user.deleted_at ||
      (user.role !== 'PLATFORM_OWNER' && user.role !== 'PLATFORM_ADMIN')
    ) {
      throw new ForbiddenException('Sólo administradores de la plataforma pueden gestionar planes');
    }
    if (user.role === 'PLATFORM_ADMIN') {
      const assignment = await this.db.getDefaultClient().platform_admin_assignments.findUnique({
        where: { user_id: userId },
        select: { user_id: true },
      });
      if (!assignment) {
        throw new ForbiddenException('Tu cuenta no tiene un alcance de administración de plataforma asignado');
      }
    }
    return user.role;
  }

  async assertPlatformOwner(userId: string): Promise<void> {
    if ((await this.assertPlatformAdmin(userId)) !== 'PLATFORM_OWNER') {
      throw new ForbiddenException('Sólo el propietario de la plataforma puede gestionar planes globales y altas de empresas');
    }
  }

  async listCatalog(userId: string) {
    await this.assertPlatformAdmin(userId);
    return this.db.getDefaultClient().platform_modules.findMany({ orderBy: [{ sort_order: 'asc' }, { name: 'asc' }] });
  }

  async listPlans(userId: string) {
    const role = await this.assertPlatformAdmin(userId);
    return this.db.getDefaultClient().subscription_plans.findMany({
      include: {
        modules: true,
        ...(role === 'PLATFORM_OWNER' ? { _count: { select: { subscriptions: true } } } : {}),
      },
      orderBy: [{ is_legacy: 'desc' }, { name: 'asc' }],
    });
  }

  async createPlan(userId: string, dto: CreatePlatformPlanDto) {
    await this.assertPlatformOwner(userId);
    return this.db.getDefaultClient().subscription_plans.create({
      data: {
        code: dto.code.trim().toUpperCase(),
        name: dto.name.trim(),
        description: dto.description?.trim() || null,
        active: dto.active ?? true,
      },
    });
  }

  async updatePlan(userId: string, id: string, dto: UpdatePlatformPlanDto) {
    await this.assertPlatformOwner(userId);
    await this.requirePlan(id);
    return this.db.getDefaultClient().subscription_plans.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.description !== undefined && { description: dto.description.trim() || null }),
        ...(dto.active !== undefined && { active: dto.active }),
      },
    });
  }

  async setPlanModules(userId: string, id: string, dto: SetPlatformPlanModulesDto) {
    await this.assertPlatformOwner(userId);
    await this.requirePlan(id);
    const prisma = this.db.getDefaultClient();
    const catalogCodes = new Set(
      (await prisma.platform_modules.findMany({ select: { code: true } })).map((item) => item.code),
    );
    const unknown = dto.modules.find((item) => !catalogCodes.has(item.moduleCode));
    if (unknown) throw new NotFoundException(`Módulo desconocido: ${unknown.moduleCode}`);
    await prisma.$transaction(async (tx) => {
      await tx.subscription_plan_modules.deleteMany({ where: { plan_id: id } });
      if (dto.modules.length)
        await tx.subscription_plan_modules.createMany({
          data: dto.modules.map((item) => ({
            plan_id: id,
            module_code: item.moduleCode,
            enabled: item.enabled,
            limits: item.limits ?? {},
          })),
        });
    });
    this.modules.invalidate();
    return this.requirePlan(id);
  }

  async listCompanySubscriptions(userId: string) {
    const role = await this.assertPlatformAdmin(userId);
    return this.db.getDefaultClient().companies.findMany({
      where: {
        deleted_at: null,
        ...(role === 'PLATFORM_ADMIN' ? { platformAdminScopes: { some: { user_id: userId } } } : {}),
      },
      select: {
        id: true,
        name: true,
        subdomain: true,
        subscription: { include: { plan: true } },
        moduleOverrides: { orderBy: { module_code: 'asc' } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOwnerAccount(userId: string, email: string) {
    await this.assertPlatformOwner(userId);
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) throw new BadRequestException('Ingresá el email de la cuenta titular.');
    const user = await this.db.getDefaultClient().users.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, active: true, deleted_at: true },
    });
    if (!user || !user.active || user.deleted_at) {
      throw new NotFoundException('No hay una cuenta activa registrada con ese email. La persona debe registrarse primero.');
    }
    return { id: user.id, name: user.name, email: user.email };
  }

  async createCompany(userId: string, dto: CreatePlatformCompanyDto) {
    await this.assertPlatformOwner(userId);
    const prisma = this.db.getDefaultClient();
    const [owner, plan] = await Promise.all([
      prisma.users.findUnique({
        where: { email: dto.ownerEmail.trim().toLowerCase() },
        select: { id: true, name: true, email: true, active: true, deleted_at: true },
      }),
      this.requirePlan(dto.planId),
    ]);
    if (!owner || !owner.active || owner.deleted_at) {
      throw new NotFoundException('La cuenta titular no está registrada o no está activa.');
    }
    if (!plan.active) throw new BadRequestException('Elegí un plan activo para dar de alta la empresa.');

    const status = dto.status ?? 'ACTIVE';
    if (status === 'TRIAL' && !dto.trialEndsAt) {
      throw new BadRequestException('Indicá la fecha de fin de prueba para una empresa en período de prueba.');
    }
    const company = await this.companies.createForPlatform(dto, owner.id, {
      planId: plan.id,
      status,
      trialEndsAt: dto.trialEndsAt,
    });
    this.modules.invalidate(company.id);
    return { company, owner: { id: owner.id, name: owner.name, email: owner.email }, plan };
  }

  async deleteCompany(userId: string, companyId: string, confirmSubdomain: string) {
    await this.assertPlatformOwner(userId);
    return this.companies.deletePermanently(companyId, confirmSubdomain, userId);
  }

  async metrics(userId: string) {
    await this.assertPlatformOwner(userId);
    const prisma = this.db.getDefaultClient();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [plans, statuses, recentEvents] = await Promise.all([
      prisma.subscription_plans.findMany({
        select: { id: true, code: true, name: true, _count: { select: { subscriptions: true } } },
        orderBy: { name: 'asc' },
      }),
      prisma.company_subscriptions.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.audit_logs_public.findMany({
        where: { table_name: 'platform_module_access', changed_at: { gte: since } },
        select: { new_data: true },
        take: 5000,
        orderBy: { changed_at: 'desc' },
      }),
    ]);
    const violationsByModule: Record<string, number> = {};
    for (const event of recentEvents) {
      const data = event.new_data as Record<string, unknown> | null;
      const code = typeof data?.moduleCode === 'string' ? data.moduleCode : 'UNKNOWN';
      violationsByModule[code] = (violationsByModule[code] ?? 0) + 1;
    }
    return { plans, statuses, auditWindowDays: 30, auditedViolations: recentEvents.length, violationsByModule };
  }

  async setCompanySubscription(userId: string, companyId: string, dto: SetCompanySubscriptionDto) {
    await this.requireManagedCompany(userId, companyId);
    await this.requirePlan(dto.planId);
    const subscription = await this.db.getDefaultClient().company_subscriptions.upsert({
      where: { company_id: companyId },
      create: {
        company_id: companyId,
        plan_id: dto.planId,
        status: dto.status ?? 'ACTIVE',
        trial_ends_at: dto.trialEndsAt ? new Date(dto.trialEndsAt) : null,
        renews_at: dto.renewsAt ? new Date(dto.renewsAt) : null,
      },
      update: {
        plan_id: dto.planId,
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.trialEndsAt !== undefined && { trial_ends_at: dto.trialEndsAt ? new Date(dto.trialEndsAt) : null }),
        ...(dto.renewsAt !== undefined && { renews_at: dto.renewsAt ? new Date(dto.renewsAt) : null }),
      },
      include: { plan: true },
    });
    this.modules.invalidate(companyId);
    return subscription;
  }

  async setCompanyOverride(
    userId: string,
    companyId: string,
    moduleCode: string,
    dto: SetCompanyModuleOverrideDto,
  ) {
    await this.requireManagedCompany(userId, companyId);
    const module = await this.db.getDefaultClient().platform_modules.findUnique({ where: { code: moduleCode } });
    if (!module) throw new NotFoundException('Módulo no encontrado');
    if (module.is_core) throw new ForbiddenException('Los módulos esenciales no admiten excepciones');
    const override = await this.db.getDefaultClient().company_module_overrides.upsert({
      where: { company_id_module_code: { company_id: companyId, module_code: moduleCode } },
      create: {
        company_id: companyId,
        module_code: moduleCode,
        state: dto.state,
        reason: dto.reason?.trim() || null,
        expires_at: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
      update: {
        state: dto.state,
        reason: dto.reason?.trim() || null,
        expires_at: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
    this.modules.invalidate(companyId);
    return override;
  }

  async removeCompanyOverride(userId: string, companyId: string, moduleCode: string) {
    await this.requireManagedCompany(userId, companyId);
    await this.db
      .getDefaultClient()
      .company_module_overrides.deleteMany({ where: { company_id: companyId, module_code: moduleCode } });
    this.modules.invalidate(companyId);
    return { success: true };
  }

  private async requirePlan(id: string) {
    const plan = await this.db
      .getDefaultClient()
      .subscription_plans.findUnique({ where: { id }, include: { modules: true } });
    if (!plan) throw new NotFoundException('Plan no encontrado');
    return plan;
  }

  private async requireManagedCompany(userId: string, companyId: string) {
    const role = await this.assertPlatformAdmin(userId);
    const prisma = this.db.getDefaultClient();
    const company = await prisma.companies.findFirst({
      where: { id: companyId, deleted_at: null },
      select: { id: true },
    });
    if (!company) throw new NotFoundException('Empresa no encontrada');

    if (role === 'PLATFORM_ADMIN') {
      const scope = await prisma.platform_admin_company_scopes.findUnique({
        where: { user_id_company_id: { user_id: userId, company_id: companyId } },
        select: { user_id: true },
      });
      if (!scope) {
        throw new ForbiddenException('Tu usuario no tiene asignado el alcance para gestionar esta empresa');
      }
    }

    return company;
  }
}
