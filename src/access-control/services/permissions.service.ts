import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permissions.findMany({
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
