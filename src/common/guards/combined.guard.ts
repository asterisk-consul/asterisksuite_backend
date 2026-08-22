import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { TenantAccessGuard } from './tenant-access.guard';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';

/**
 * Guard combinado que ejecuta TenantAccessGuard + PermissionsGuard en orden.
 * Reemplaza el uso de dos APP_GUARD separados (NestJS solo permite uno por app).
 *
 * Flujo:
 * 1. TenantAccessGuard: valida JWT, resuelve tenant, setea companyUserRole
 * 2. PermissionsGuard: evalúa @RequirePermissions ( OWNER bypass incluido)
 */
@Injectable()
export class CombinedGuard implements CanActivate {
  constructor(
    private readonly tenantGuard: TenantAccessGuard,
    private readonly permissionsGuard: PermissionsGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Tenant access (JWT + tenant + companyUserRole)
    const tenantOk = await this.tenantGuard.canActivate(context);
    if (!tenantOk) return false;

    // 2. Permissions check (ya tiene OWNER bypass y maneja user undefined)
    const permissionsOk = await this.permissionsGuard.canActivate(context);
    if (!permissionsOk) return false;

    return true;
  }
}
