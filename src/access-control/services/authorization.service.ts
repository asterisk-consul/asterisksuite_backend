import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /**
   * Verifica si un usuario tiene un permiso efectivo dentro de un tenant
   */
  async can(userId: string, permissionCode: string): Promise<boolean> {
    const permission = await this.prisma.permissions.findUnique({
      where: { code: permissionCode },
    });

    if (!permission || !permission.active) {
      return false;
    }

    const userRoles = await this.prisma.business_user_roles.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const overrides = await this.prisma.user_permission_overrides.findUnique({
      where: {
        user_id_permission_id: {
          user_id: userId,
          permission_id: permission.id,
        },
      },
    });

    // 1. DENY override (si existe, siempre gana)
    if (overrides?.effect === 'DENY') {
      return false;
    }

    // 2. ALLOW override (gana sobre roles)
    if (overrides?.effect === 'ALLOW') {
      return true;
    }

    // 3. Resolver permisos por roles
    for (const userRole of userRoles) {
      for (const rp of userRole.role.permissions) {
        if (rp.permission.code === permissionCode) {
          return true;
        }
      }
    }

    // 4. Default deny
    return false;
  }

  /**
   * Versión optimizada para múltiples permisos (útil para guards)
   */
  async canAll(userId: string, permissionCodes: string[]): Promise<boolean> {
    for (const code of permissionCodes) {
      const allowed = await this.can(userId, code);
      if (!allowed) return false;
    }

    return true;
  }
}
