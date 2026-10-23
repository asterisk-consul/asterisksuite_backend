import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { requestContext } from '@/common/context/request-context';
import { PrismaService } from '@/prisma/prisma.service';
import { SaveTablePreferencesDto } from './dto/save-table-preferences.dto';

const MAX_COLUMNS = 250;

@Injectable()
export class UserPreferencesService {
  constructor(private readonly db: PrismaService) {}

  private get companyId(): string {
    const companyId = requestContext.getStore()?.companyId;
    if (!companyId) throw new BadRequestException('No se pudo resolver la empresa activa.');
    return companyId;
  }

  private validateTableKey(tableKey: string): string {
    const normalized = tableKey?.trim();
    if (!normalized || normalized.length > 200) {
      throw new BadRequestException('La clave de la tabla es inválida.');
    }
    return normalized;
  }

  private async assertCompanyMembership(userId: string, companyId: string) {
    const membership = await this.db.getDefaultClient().company_users.findUnique({
      where: {
        company_id_user_id: { company_id: companyId, user_id: userId },
      },
      select: { user_id: true },
    });
    if (!membership) throw new ForbiddenException('No tenés acceso a las preferencias de esta empresa.');
  }

  async getTablePreferences(userId: string, tableKey: string) {
    const companyId = this.companyId;
    await this.assertCompanyMembership(userId, companyId);
    const preference = await this.db.getDefaultClient().user_table_preferences.findUnique({
      where: {
        user_id_company_id_table_key: {
          user_id: userId,
          company_id: companyId,
          table_key: this.validateTableKey(tableKey),
        },
      },
      select: {
        column_order: true,
        column_visibility: true,
        updated_at: true,
      },
    });

    if (!preference) return null;

    return {
      columnOrder: preference.column_order,
      columnVisibility: preference.column_visibility,
      updatedAt: preference.updated_at,
    };
  }

  async saveTablePreferences(userId: string, dto: SaveTablePreferencesDto) {
    const tableKey = this.validateTableKey(dto.tableKey);
    if (dto.columnOrder.some((columnId) => columnId.length > 200)) {
      throw new BadRequestException('El identificador de una columna es demasiado largo.');
    }
    if (new Set(dto.columnOrder).size !== dto.columnOrder.length) {
      throw new BadRequestException('El orden contiene columnas duplicadas.');
    }
    if (Object.keys(dto.columnVisibility).length > MAX_COLUMNS) {
      throw new BadRequestException(`No se pueden guardar más de ${MAX_COLUMNS} columnas.`);
    }
    for (const [columnId, visible] of Object.entries(dto.columnVisibility)) {
      if (!columnId || columnId.length > 200 || typeof visible !== 'boolean') {
        throw new BadRequestException('La visibilidad de columnas es inválida.');
      }
    }

    const companyId = this.companyId;
    await this.assertCompanyMembership(userId, companyId);
    const preference = await this.db.getDefaultClient().user_table_preferences.upsert({
      where: {
        user_id_company_id_table_key: {
          user_id: userId,
          company_id: companyId,
          table_key: tableKey,
        },
      },
      create: {
        user_id: userId,
        company_id: companyId,
        table_key: tableKey,
        column_order: dto.columnOrder as Prisma.InputJsonValue,
        column_visibility: dto.columnVisibility as Prisma.InputJsonValue,
      },
      update: {
        column_order: dto.columnOrder as Prisma.InputJsonValue,
        column_visibility: dto.columnVisibility as Prisma.InputJsonValue,
      },
      select: {
        column_order: true,
        column_visibility: true,
        updated_at: true,
      },
    });

    return {
      columnOrder: preference.column_order,
      columnVisibility: preference.column_visibility,
      updatedAt: preference.updated_at,
    };
  }
}
