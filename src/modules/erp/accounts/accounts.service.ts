import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class AccountsService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(data: CreateAccountDto) {
    const existing = await this.prisma.accounts.findUnique({
      where: {
        code: data.code,
      },
    });

    if (existing) {
      throw new BadRequestException(`Ya existe una cuenta con código ${data.code}`);
    }

    if (data.parent_id) {
      const parent = await this.prisma.accounts.findUnique({
        where: {
          id: data.parent_id,
        },
      });

      if (!parent) {
        throw new NotFoundException('Cuenta padre no encontrada');
      }
    }

    return this.prisma.accounts.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return this.prisma.accounts.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        parent: true,
        children: true,
      },
      orderBy: [
        {
          code: 'asc',
        },
      ],
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.accounts.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    return account;
  }

  async update(id: string, data: UpdateAccountDto) {
    await this.findOne(id);

    if (data.code) {
      const existing = await this.prisma.accounts.findFirst({
        where: {
          code: data.code,
          id: {
            not: id,
          },
        },
      });

      if (existing) {
        throw new BadRequestException(`Ya existe una cuenta con código ${data.code}`);
      }
    }

    if (data.parent_id) {
      if (data.parent_id === id) {
        throw new BadRequestException('Una cuenta no puede ser padre de sí misma');
      }

      const parent = await this.prisma.accounts.findUnique({
        where: {
          id: data.parent_id,
        },
      });

      if (!parent) {
        throw new NotFoundException('Cuenta padre no encontrada');
      }
    }

    return this.prisma.accounts.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const children = await this.prisma.accounts.count({
      where: {
        parent_id: id,
        deleted_at: null,
      },
    });

    if (children > 0) {
      throw new BadRequestException('No se puede eliminar una cuenta con subcuentas');
    }

    return this.prisma.accounts.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async exportToExcel(format: 'xlsx' | 'csv' = 'xlsx') {
    const accounts = await this.findAll();

    const idToAccount = new Map<string, any>(accounts.map(a => [a.id, a]));

    const rows = accounts.map(a => {
      const parentId = (a as any).parent_id;
      const parentCode = parentId ? idToAccount.get(parentId)?.code ?? '' : '';
      return {
        Código: a.code,
        Nombre: a.name,
        Tipo: a.account_type,
        'Cuenta padre': parentCode,
        Activo: a.active ? 'Sí' : 'No',
      };
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 15 }, { wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 8 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Plan de Cuentas');

    if (format === 'csv') {
      return {
        buffer: XLSX.utils.sheet_to_csv(ws),
        contentType: 'text/csv',
        filename: 'plan_de_cuentas.csv',
      };
    }

    return {
      buffer: XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }),
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: 'plan_de_cuentas.xlsx',
    };
  }

  async importFromExcel(buffer: Buffer) {
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws) as any[];

    const typeMap: Record<string, string> = {
      activo: 'ASSET',
      asset: 'ASSET',
      pasivo: 'LIABILITY',
      liability: 'LIABILITY',
      patrimonio: 'EQUITY',
      equity: 'EQUITY',
      ingresos: 'REVENUE',
      revenue: 'REVENUE',
      gastos: 'EXPENSE',
      expense: 'EXPENSE',
    };

    const result = { success: true, total: rows.length, saved: 0, failed: 0, errors: [] as { row: number; message: string }[] };

    // Parse and validate all rows first
    const parsed: { row: number; code: string; name: string; accountType: string; parentCode: string }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2;
      try {
        const code = String(row['Código'] ?? row['code'] ?? '').trim();
        const name = String(row['Nombre'] ?? row['name'] ?? '').trim();
        const rawType = String(row['Tipo'] ?? row['account_type'] ?? '').trim().toLowerCase();
        const parentCode = String(row['Cuenta padre'] ?? row['parent_code'] ?? '').trim();

        if (!code) throw new Error('Código vacío');
        if (!name) throw new Error('Nombre vacío');
        const accountType = typeMap[rawType] ?? rawType.toUpperCase();
        if (!['ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE'].includes(accountType)) {
          throw new Error(`Tipo "${row['Tipo']}" no válido`);
        }

        parsed.push({ row: rowNum, code, name, accountType, parentCode });
      } catch (err: any) {
        result.failed++;
        result.errors.push({ row: rowNum, message: err.message || 'Error desconocido' });
      }
    }

    // Sort by depth (parents before children)
    parsed.sort((a, b) => a.code.split('.').length - b.code.split('.').length || a.code.localeCompare(b.code));

    // Build code → id map from existing accounts
    const existing = await this.prisma.accounts.findMany({ where: { deleted_at: null }, select: { id: true, code: true } });
    const codeToId = new Map(existing.map(a => [a.code, a.id]));

    // Upsert accounts in order
    for (const item of parsed) {
      try {
        const parentId = item.parentCode ? codeToId.get(item.parentCode) ?? null : null;
        if (item.parentCode && !parentId) {
          throw new Error(`Cuenta padre "${item.parentCode}" no encontrada`);
        }

        const existingId = codeToId.get(item.code);
        if (existingId) {
          await this.prisma.accounts.update({
            where: { id: existingId },
            data: { name: item.name, account_type: item.accountType as any, parent_id: parentId },
          });
        } else {
          const created = await this.prisma.accounts.create({
            data: { code: item.code, name: item.name, account_type: item.accountType as any, parent_id: parentId, active: true },
          });
          codeToId.set(item.code, created.id);
        }
        result.saved++;
      } catch (err: any) {
        result.failed++;
        result.errors.push({ row: item.row, message: err.message || 'Error al guardar' });
      }
    }

    if (result.failed > 0) result.success = false;
    return result;
  }
}
