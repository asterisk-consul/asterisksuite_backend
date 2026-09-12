import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PermissionContext {
  userId: string;
  roles: string[];

  permissions: Set<string>;

  overrides: Map<string, 'ALLOW' | 'DENY'>;

  can: (permission: string) => boolean;
}

@Injectable()
export class PermissionContextBuilder {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async build(userId: string): Promise<PermissionContext> {
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

    const overridesRaw = await this.prisma.user_permission_overrides.findMany({
      where: { user_id: userId },
      include: {
        permission: true,
      },
    });

    const roles: string[] = [];
    const permissions = new Set<string>();
    const overrides = new Map<string, 'ALLOW' | 'DENY'>();

    // 1. roles + permissions
    for (const ur of userRoles) {
      roles.push(ur.role.code);

      for (const rp of ur.role.permissions) {
        permissions.add(rp.permission.code);
      }
    }

    // 2. overrides
    for (const o of overridesRaw) {
      overrides.set(o.permission.code, o.effect);
    }

    // 3. contexto en memoria
    const context: PermissionContext = {
      userId,
      roles,
      permissions,
      overrides,

      can: (permission: string) => {
        // OWNER logic lo dejamos fuera del contexto (se evalúa arriba en guard)

        // DENY override
        if (overrides.get(permission) === 'DENY') {
          return false;
        }

        // ALLOW override
        if (overrides.get(permission) === 'ALLOW') {
          return true;
        }

        // role permissions
        return permissions.has(permission);
      },
    };

    return context;
  }
}
