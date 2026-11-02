import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PlatformPlansService } from './platform-plans.service';
import { SetPlatformAdminScopesDto } from './dto/platform-plans.dto';

@Injectable()
export class PlatformAdministratorsService {
  constructor(
    private readonly db: PrismaService,
    private readonly plans: PlatformPlansService,
  ) {}

  async list(actorId: string) {
    await this.plans.assertPlatformOwner(actorId);
    const assignments = await this.db.getDefaultClient().platform_admin_assignments.findMany({
      where: { user: { role: 'PLATFORM_ADMIN', active: true, deleted_at: null } },
      include: {
        user: { select: { id: true, name: true, email: true, active: true } },
        companies: {
          include: { company: { select: { id: true, name: true, subdomain: true } } },
        },
      },
    });

    return assignments
      .map(({ user, companies }) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        companies: companies.map(({ company }) => company).sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async findExistingUser(actorId: string, email: string) {
    await this.plans.assertPlatformOwner(actorId);
    const normalizedEmail = email?.trim().toLowerCase();
    if (!normalizedEmail) throw new BadRequestException('Ingresá el email de la cuenta existente.');

    const user = await this.db.getDefaultClient().users.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, name: true, email: true, role: true, active: true, deleted_at: true },
    });
    if (!user || !user.active || user.deleted_at) {
      throw new NotFoundException('No hay una cuenta activa registrada con ese email. La persona debe registrarse primero.');
    }
    if (user.role === 'PLATFORM_OWNER' || user.role === 'SUPPORT') {
      throw new ForbiddenException('Esta cuenta tiene un rol global protegido y no se puede asignar como administrador.');
    }
    if (user.role === 'PLATFORM_ADMIN') {
      const assignment = await this.db.getDefaultClient().platform_admin_assignments.findUnique({
        where: { user_id: user.id },
        select: { user_id: true },
      });
      if (!assignment) {
        throw new ConflictException('La cuenta ya tiene el rol PLATFORM_ADMIN, pero le falta su asignación. Revisá la migración de alcances.');
      }
    } else if (user.role && user.role !== 'PLATFORM_USER') {
      throw new ForbiddenException('La cuenta tiene un rol global que no se puede reemplazar desde esta pantalla.');
    }

    return { id: user.id, name: user.name, email: user.email, alreadyPlatformAdmin: user.role === 'PLATFORM_ADMIN' };
  }

  async setScopes(actorId: string, userId: string, dto: SetPlatformAdminScopesDto) {
    await this.plans.assertPlatformOwner(actorId);
    const companyIds = [...new Set(dto.companyIds)];

    return this.db.getDefaultClient().$transaction(async (tx) => {
      const user = await tx.users.findFirst({
        where: { id: userId, active: true, deleted_at: null },
        select: { id: true, name: true, email: true, role: true },
      });
      if (!user) throw new NotFoundException('La cuenta no existe o está inactiva.');
      if (user.role === 'PLATFORM_OWNER' || user.role === 'SUPPORT') {
        throw new ForbiddenException('Esta cuenta tiene un rol global protegido y no se puede asignar como administrador.');
      }
      if (user.role && user.role !== 'PLATFORM_USER' && user.role !== 'PLATFORM_ADMIN') {
        throw new ForbiddenException('La cuenta tiene un rol global que no se puede reemplazar desde esta pantalla.');
      }

      const existing = await tx.platform_admin_assignments.findUnique({
        where: { user_id: user.id },
        include: { companies: { select: { company_id: true } } },
      });
      if (user.role === 'PLATFORM_ADMIN' && !existing) {
        throw new ConflictException('La cuenta PLATFORM_ADMIN todavía no tiene asignación de plataforma. Aplicá la migración y volvé a cargar.');
      }

      const activeCompanies = await tx.companies.findMany({
        where: { id: { in: companyIds }, deleted_at: null },
        select: { id: true, name: true, subdomain: true },
      });
      if (activeCompanies.length !== companyIds.length) {
        throw new BadRequestException('Una o más empresas no existen o están eliminadas. Actualizá la pantalla e intentá nuevamente.');
      }

      const previousCompanyIds = existing?.companies.map(({ company_id }) => company_id) ?? [];
      const action = existing ? 'UPDATE' : 'CREATE';
      await tx.users.update({ where: { id: user.id }, data: { role: 'PLATFORM_ADMIN' } });
      await tx.platform_admin_assignments.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          previous_role: user.role,
          granted_by: actorId,
          updated_by: actorId,
        },
        update: { updated_by: actorId },
      });
      await tx.platform_admin_company_scopes.deleteMany({ where: { user_id: user.id } });
      await tx.platform_admin_company_scopes.createMany({
        data: companyIds.map((companyId) => ({ user_id: user.id, company_id: companyId })),
      });
      await tx.audit_logs_public.create({
        data: {
          table_name: 'platform_admin_assignments',
          record_id: user.id,
          action,
          changed_by: actorId,
          ...(existing ? { old_data: { companyIds: previousCompanyIds } } : {}),
          new_data: { role: 'PLATFORM_ADMIN', companyIds },
        },
      });

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        companies: activeCompanies,
      };
    });
  }

  async revoke(actorId: string, userId: string) {
    await this.plans.assertPlatformOwner(actorId);
    return this.db.getDefaultClient().$transaction(async (tx) => {
      const assignment = await tx.platform_admin_assignments.findUnique({
        where: { user_id: userId },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } },
          companies: { select: { company_id: true } },
        },
      });
      if (!assignment || assignment.user.role !== 'PLATFORM_ADMIN') {
        throw new NotFoundException('No se encontró una asignación activa de administrador de plataforma.');
      }

      await tx.users.update({ where: { id: userId }, data: { role: assignment.previous_role } });
      await tx.platform_admin_assignments.delete({ where: { user_id: userId } });
      await tx.audit_logs_public.create({
        data: {
          table_name: 'platform_admin_assignments',
          record_id: userId,
          action: 'DELETE',
          changed_by: actorId,
          old_data: {
            role: 'PLATFORM_ADMIN',
            companyIds: assignment.companies.map(({ company_id }) => company_id),
          },
          new_data: { role: assignment.previous_role },
        },
      });

      return { success: true, user: assignment.user };
    });
  }
}
