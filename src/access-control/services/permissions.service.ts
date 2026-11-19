import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { MANAGEMENT_REPORT_PERMISSIONS } from '../management-report-permissions';

const AUDIT_PERMISSION = { code: 'audit.read', description: 'Ver la auditoría de cambios de la empresa' };

@Injectable()
export class PermissionsService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll() {
    const prisma = this.prisma;
    // Older tenant databases may predate individual report and audit switches.
    // Add those permission definitions lazily when an admin opens role permissions.
    const permissionDefinitions = [...MANAGEMENT_REPORT_PERMISSIONS, AUDIT_PERMISSION];
    const existingPermissions = await prisma.permissions.findMany({
      where: { code: { in: permissionDefinitions.map(({ code }) => code) } },
      select: { code: true },
    });
    const existingCodes = new Set(existingPermissions.map(({ code }) => code));
    const missingPermissions = permissionDefinitions
      .filter(({ code }) => !existingCodes.has(code))
      .map(({ code, description }) => ({ code, description }));
    if (missingPermissions.length) {
      await prisma.permissions.createMany({ data: missingPermissions, skipDuplicates: true });
    }

    return prisma.permissions.findMany({
      where: {
        active: true,
        deleted_at: null,
      },
      orderBy: {
        code: 'asc',
      },
    });
  }

  async findByCode(code: string) {
    return this.prisma.permissions.findUnique({
      where: {
        code,
      },
    });
  }
}
