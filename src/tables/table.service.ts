import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { SaveTablePreferenceDto } from './dto/save-table-preference.dto';

@Injectable()
export class TableService {
  constructor(private readonly prisma: PrismaService) {}

  async savePreference(userId: bigint, dto: SaveTablePreferenceDto) {
    return this.prisma.userTablePreference.upsert({
      where: {
        userId_tableKey: {
          userId,
          tableKey: dto.tableKey,
        },
      },
      update: {
        visibleColumns: dto.visibleColumns,
        columnsOrder: dto.columnsOrder,
        pageSize: dto.pageSize,
        sort: dto.sort,
      },
      create: {
        userId,
        tableKey: dto.tableKey,
        visibleColumns: dto.visibleColumns,
        columnsOrder: dto.columnsOrder,
        pageSize: dto.pageSize ?? 25,
        sort: dto.sort,
      },
    });
  }

  async getPreference(userId: bigint, tableKey: string) {
    return this.prisma.userTablePreference.findUnique({
      where: {
        userId_tableKey: {
          userId,
          tableKey,
        },
      },
    });
  }
}
