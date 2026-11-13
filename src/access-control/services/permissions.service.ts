import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';
import { MANAGEMENT_REPORT_PERMISSIONS } from '../management-report-permissions';

@Injectable()
export class PermissionsService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll() {
    const prisma = this.prisma;
    // Older tenant databases may only have management_reports.read. Add the
    // individual report switches lazily when an admin opens role permissions.
    const existingReportPermissions = await prisma.permissions.findMany({
      where: { code: { in: MANAGEMENT_REPORT_PERMISSIONS.map(({ code }) => code) } },
      select: { code: true },
    });
    const existingCodes = new Set(existingReportPermissions.map(({ code }) => code));
    const missingReportPermissions = MANAGEMENT_REPORT_PERMISSIONS
      .filter(({ code }) => !existingCodes.has(code))
      .map(({ code, description }) => ({ code, description }));
    if (missingReportPermissions.length) {
      await prisma.permissions.createMany({ data: missingReportPermissions, skipDuplicates: true });
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
