import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PermissionContextBuilder } from './permission-context.builder';

export const TAX_NOTIFICATION_ADMIN_PERMISSIONS = [
  'taxes.create',
  'taxes.update',
  'taxes.delete',
  'fiscal-authorizations.create',
  'fiscal-authorizations.update',
  'fiscal-authorizations.delete',
  'fiscal-authorizations.configure-alerts',
] as const;

@Injectable()
export class TaxNotificationAudienceService {
  constructor(
    private readonly db: PrismaService,
    private readonly permissionContexts: PermissionContextBuilder,
  ) {}

  async resolveTreasuryAlerts(userId: string, companyRole?: string) {
    const context = await this.permissionContexts.build(userId);
    const includeTaxAlerts = await this.canReceiveTaxAlerts(context, companyRole);

    return {
      includeTaxAlerts,
      // OWNER ya podía consultar estas alertas por el bypass existente del guard.
      includeOtherObligationAlerts: context.can('payments.read') || companyRole === 'OWNER',
    };
  }

  async canReceiveTaxNotifications(userId: string, companyRole?: string): Promise<boolean> {
    const context = await this.permissionContexts.build(userId);
    return this.canReceiveTaxAlerts(context, companyRole);
  }

  private async canReceiveTaxAlerts(context: Awaited<ReturnType<PermissionContextBuilder['build']>>, companyRole?: string) {
    if (TAX_NOTIFICATION_ADMIN_PERMISSIONS.some((code) => context.can(code))) return true;
    if (companyRole !== 'ADMIN' && companyRole !== 'OWNER') return false;
    return !(await this.hasAnyEffectiveTaxAdministrator());
  }

  private async hasAnyEffectiveTaxAdministrator(): Promise<boolean> {
    const client: any = this.db.getClientForCurrentContext();
    const roleGrants = await client.business_role_permissions.findMany({
      where: {
        role: { active: true, deleted_at: null },
        permission: {
          code: { in: [...TAX_NOTIFICATION_ADMIN_PERMISSIONS] },
          active: true,
          deleted_at: null,
        },
      },
      select: {
        permission_id: true,
        role: { select: { users: { select: { user_id: true } } } },
      },
    });
    const overrides = await client.user_permission_overrides.findMany({
      where: {
        permission: {
          code: { in: [...TAX_NOTIFICATION_ADMIN_PERMISSIONS] },
          active: true,
          deleted_at: null,
        },
      },
      select: { user_id: true, permission_id: true, effect: true },
    });
    const overrideByUserPermission = new Map(
      overrides.map((override: any) => [`${override.user_id}:${override.permission_id}`, override.effect]),
    );

    for (const grant of roleGrants) {
      for (const user of grant.role.users) {
        if (overrideByUserPermission.get(`${user.user_id}:${grant.permission_id}`) !== 'DENY') return true;
      }
    }

    return overrides.some((override: any) => override.effect === 'ALLOW');
  }
}
