import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as XLSX from 'xlsx';
import { BusinessPartiesService } from './business-parties.service';
import { CreateBusinessPartyDto } from './dto/create-business-party.dto';
import { UpdateBusinessPartyDto } from './dto/update-business-party.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('master-data/business-parties')
@UseGuards(JwtAuthGuard)
export class BusinessPartiesController {
  constructor(private readonly service: BusinessPartiesService) {}

  @Post()
  create(@Body() dto: CreateBusinessPartyDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('type') type?: string) {
    return this.service.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBusinessPartyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get('export/template')
  downloadTemplate(@Res() res: Response) {
    const headers = [
      'id',
      'tipo',
      'razon_social',
      'CUIT',
      'condicion_iva',
      'provincia',
      'tasa_exencion',
      'activo',
    ];

    const exampleRows = [
      ['', 'CUSTOMER', 'Mi Empresa SRL', '30-12345678-9', 'RESPONSABLE_INSCRIPTO', 'Córdoba', 0, 'Sí'],
      ['', 'SUPPLIER', 'Proveedor XYZ SA', '30-98765432-1', 'RESPONSABLE_INSCRIPTO', 'Buenos Aires', 0, 'Sí'],
      ['', 'UTILITY', 'EPEC', '30-71234567-8', 'EXENTO', 'Córdoba', 0, 'Sí'],
      ['', 'TAX_AUTHORITY', 'ARCA', '30-71111111-1', 'EXENTO', 'Nacional', 0, 'Sí'],
    ];

    const notes = [
      [],
      ['TIPOS VÁLIDOS:', 'CUSTOMER, SUPPLIER, EMPLOYEE, PARTNER, TAX_AUTHORITY, UTILITY, FINANCIAL, SERVICE_PROVIDER'],
      ['IVA VÁLIDOS:', 'RESPONSABLE_INSCRIPTO, MONOTRIBUTO, CONSUMIDOR_FINAL, EXENTO'],
      ['ACTIVO:', 'Sí / No'],
      ['NOTA:', 'Si la columna id está vacía se crea un nuevo registro. Si tiene un ID se actualiza el existente.'],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows, ...notes]);

    ws['!cols'] = [
      { wch: 36 }, { wch: 18 }, { wch: 25 }, { wch: 15 },
      { wch: 25 }, { wch: 18 }, { wch: 15 }, { wch: 8 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Partes Interesadas');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=template_partes_interesadas.xlsx',
    });

    res.send(buffer);
  }

  @Get('export')
  async exportParties(
    @Query('type') type?: string,
    @Query('format') format: string = 'xlsx',
    @Res() res?: Response,
  ) {
    const parties = await this.service.findAll(type);

    const rows = parties.map((p: any) => ({
      id: p.id,
      tipo: p.type,
      razon_social: p.name,
      CUIT: p.tax_id ?? '',
      condicion_iva: p.vat_condition ?? '',
      provincia: p.province ?? '',
      tasa_exencion: Number(p.exemption_rate) ?? 0,
      activo: p.active ? 'Sí' : 'No',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    ws['!cols'] = [
      { wch: 36 },
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 8 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Partes Interesadas');

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws);
      res?.set({
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=partes_interesadas.csv',
      });
      return res?.send(csv);
    }

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res?.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=partes_interesadas.xlsx',
    });
    res?.send(buffer);
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importParties(@UploadedFile() file: Express.Multer.File) {
    const wb = XLSX.read(file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);

    const typeMap: Record<string, string> = {
      cliente: 'CUSTOMER',
      proveedor: 'SUPPLIER',
      empleado: 'EMPLOYEE',
      socio: 'PARTNER',
      'ente impositivo': 'TAX_AUTHORITY',
      servicio: 'UTILITY',
      financiero: 'FINANCIAL',
      'proveedor de servicios': 'SERVICE_PROVIDER',
    };

    const ivaMap: Record<string, string> = {
      ri: 'RESPONSABLE_INSCRIPTO',
      monotributo: 'MONOTRIBUTO',
      cf: 'CONSUMIDOR_FINAL',
      exento: 'EXENTO',
    };

    const validTypes = ['CUSTOMER', 'SUPPLIER', 'EMPLOYEE', 'PARTNER', 'TAX_AUTHORITY', 'UTILITY', 'FINANCIAL', 'SERVICE_PROVIDER'];

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as any;
      try {
        const id = String(row['id'] ?? '').trim();

        const rawType = String(row['tipo'] ?? row['type'] ?? '').trim().toLowerCase();
        const partyType = typeMap[rawType] ?? rawType.toUpperCase();

        if (!validTypes.includes(partyType)) {
          errors.push({ row: i + 2, message: `Tipo inválido: ${rawType}` });
          skipped++;
          continue;
        }

        const name = String(row['razon_social'] ?? row['name'] ?? '').trim();
        if (!name) {
          errors.push({ row: i + 2, message: 'Falta razón social' });
          skipped++;
          continue;
        }

        const rawIva = String(row['condicion_iva'] ?? row['vat_condition'] ?? '').trim().toLowerCase();
        const vatCondition = ivaMap[rawIva] ?? (rawIva.toUpperCase() || undefined);

        const rawActive = String(row['activo'] ?? row['active'] ?? 'sí').trim().toLowerCase();
        const isActive = rawActive === 'sí' || rawActive === 'si' || rawActive === 'true' || rawActive === '1';

        const rawData = {
          type: partyType as any,
          name,
          tax_id: String(row['CUIT'] ?? row['tax_id'] ?? '').trim() || undefined,
          vat_condition: vatCondition,
          province: String(row['provincia'] ?? row['province'] ?? '').trim() || undefined,
          exemption_rate: Number(row['tasa_exencion'] ?? row['exemption_rate'] ?? 0),
          active: isActive,
        };

        if (id) {
          await this.service.update(id, rawData);
          updated++;
        } else {
          await this.service.create(rawData);
          created++;
        }
      } catch (e: any) {
        errors.push({ row: i + 2, message: e.message ?? 'Error desconocido' });
        skipped++;
      }
    }

    return { created, updated, saved: created + updated, skipped, total: rows.length, errors };
  }
}
