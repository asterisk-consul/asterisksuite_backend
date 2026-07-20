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

  // 🔥 Rutas fijas ANTES de @Get(':id') para evitar conflicto
  @Get('export/template')
  downloadTemplate(@Res() res: Response) {
    const headers = [
      'id', 'tipo', 'razon_social', 'nombre_fantasia', 'tipo_documento', 'CUIT', 'email',
      'condicion_iva', 'tasa_exencion', 'contacto_nombre', 'contacto_apellido', 'contacto_cargo',
      'contacto_telefono', 'contacto_email', 'cuenta_bancaria_cbu', 'cuenta_bancaria_alias',
      'cuenta_bancaria_banco', 'cuenta_bancaria_tipo', 'cuenta_bancaria_moneda',
      'cuenta_bancaria_titular', 'cuenta_bancaria_descripcion', 'cuenta_bancaria_principal', 'activo',
    ];

    const exampleRows = [
      ['', 'CUSTOMER', 'Mi Empresa SRL', 'Mi Empresa', 'CUIT', '30-12345678-9', 'info@miempresa.com', 'RI', 0, 'Juan', 'Pérez', 'Gerente', '11-1234-5678', 'juan@miempresa.com', '2850001000000000000001', 'MIEMPRESA', 'Banco Nación', 'CUENTA_CORRIENTE', 'ARS', 'Juan Pérez', 'Cuenta principal', 'Sí', 'Sí'],
      ['', 'SUPPLIER', 'Proveedor XYZ SA', 'XYZ', 'CUIT', '30-98765432-1', 'ventas@xyz.com', 'RI', 0, 'María', 'López', 'Ventas', '11-5678-1234', 'maria@xyz.com', '2850002000000000000002', 'XYZPROV', 'Banco Galicia', 'CUENTA_CORRIENTE', 'ARS', 'María López', 'Cuenta proveedores', 'Sí', 'Sí'],
      ['', 'UTILITY', 'EPEC', '', '', '30-71234567-8', 'info@epec.com', 'EXENTO', 0, '', '', '', '', '', '', '', '', '', '', '', '', 'Sí', 'Sí'],
    ];

    const notes = [
      [],
      ['TIPOS VÁLIDOS:', 'CUSTOMER, SUPPLIER, EMPLOYEE, PARTNER, TAX_AUTHORITY, UTILITY, FINANCIAL, SERVICE_PROVIDER'],
      ['TIPOS DOCUMENTO:', 'CUIT, DNI, CUIL (dejar vacío si no aplica)'],
      ['IVA VÁLIDOS:', 'RI, MONO, CF, EX (o completo)'],
      ['ACTIVO / PRINCIPAL:', 'Sí / No'],
      ['NOTA:', 'Si id está vacío se crea. Si tiene ID se actualiza.'],
      ['NOTA:', 'Múltiples filas con mismo nombre = múltiples contactos/cuentas.'],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows, ...notes]);

    ws['!cols'] = headers.map(() => ({ wch: 18 }));

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

    const rows: any[] = [];
    for (const p of parties) {
      const contacts = (p as any).party_contacts ?? [];
      const bankAccounts = (p as any).party_bank_accounts ?? [];

      const maxRows = Math.max(1, contacts.length, bankAccounts.length);

      for (let i = 0; i < maxRows; i++) {
        const contact = contacts[i];
        const bank = bankAccounts[i];

        rows.push({
          id: i === 0 ? p.id : '',
          tipo: i === 0 ? p.type : '',
          razon_social: i === 0 ? p.name : '',
          nombre_fantasia: i === 0 ? (p as any).business_names ?? '' : '',
          tipo_documento: i === 0 ? (p as any).document_type ?? '' : '',
          CUIT: i === 0 ? (p as any).tax_id ?? '' : '',
          email: i === 0 ? (p as any).email ?? '' : '',
          condicion_iva: i === 0 ? p.vat_condition ?? '' : '',
          tasa_exencion: i === 0 ? Number(p.exemption_rate) ?? 0 : '',
          contacto_nombre: contact?.first_name ?? '',
          contacto_apellido: contact?.last_name ?? '',
          contacto_cargo: contact?.role ?? '',
          contacto_telefono: contact?.phone ?? '',
          contacto_email: contact?.email ?? '',
          cuenta_bancaria_cbu: bank?.cbu ?? '',
          cuenta_bancaria_alias: bank?.alias ?? '',
          cuenta_bancaria_banco: bank?.bank_name ?? '',
          cuenta_bancaria_tipo: bank?.account_type ?? '',
          cuenta_bancaria_moneda: bank?.currency ?? '',
          cuenta_bancaria_titular: bank?.holder_name ?? '',
          cuenta_bancaria_descripcion: bank?.description ?? '',
          cuenta_bancaria_principal: bank?.is_default ? 'Sí' : 'No',
          activo: i === 0 ? (p.active ? 'Sí' : 'No') : '',
        });
      }
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    ws['!cols'] = [
      { wch: 36 }, { wch: 18 }, { wch: 25 }, { wch: 18 }, { wch: 15 },
      { wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 25 },
      { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 10 },
      { wch: 20 }, { wch: 25 }, { wch: 12 }, { wch: 8 },
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
      'responsable inscripto': 'RESPONSABLE_INSCRIPTO',
      monotributo: 'MONOTRIBUTO',
      mono: 'MONOTRIBUTO',
      cf: 'CONSUMIDOR_FINAL',
      'consumidor final': 'CONSUMIDOR_FINAL',
      exento: 'EXENTO',
      ex: 'EXENTO',
    };

    const validTypes = ['CUSTOMER', 'SUPPLIER', 'EMPLOYEE', 'PARTNER', 'TAX_AUTHORITY', 'UTILITY', 'FINANCIAL', 'SERVICE_PROVIDER'];

    const partyMap = new Map<string, any>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as any;
      const id = String(row['id'] ?? '').trim();
      const name = String(row['razon_social'] ?? row['name'] ?? '').trim();
      const key = id || name;

      if (!key) continue;

      if (!partyMap.has(key)) {
        partyMap.set(key, { row, contacts: [], bank_accounts: [] });
      }

      const entry = partyMap.get(key);

      const contactName = String(row['contacto_nombre'] ?? '').trim();
      const contactLast = String(row['contacto_apellido'] ?? '').trim();
      if (contactName || contactLast) {
        entry.contacts.push({
          first_name: contactName,
          last_name: contactLast,
          role: String(row['contacto_cargo'] ?? '').trim() || undefined,
          phone: String(row['contacto_telefono'] ?? '').trim() || undefined,
          email: String(row['contacto_email'] ?? '').trim() || undefined,
        });
      }

      const cbu = String(row['cuenta_bancaria_cbu'] ?? '').trim();
      if (cbu) {
        entry.bank_accounts.push({
          cbu,
          alias: String(row['cuenta_bancaria_alias'] ?? '').trim() || undefined,
          bank_name: String(row['cuenta_bancaria_banco'] ?? '').trim() || undefined,
          account_type: String(row['cuenta_bancaria_tipo'] ?? '').trim() || undefined,
          currency: String(row['cuenta_bancaria_moneda'] ?? '').trim() || undefined,
          holder_name: String(row['cuenta_bancaria_titular'] ?? '').trim() || undefined,
          description: String(row['cuenta_bancaria_descripcion'] ?? '').trim() || undefined,
          is_default: String(row['cuenta_bancaria_principal'] ?? '').trim().toLowerCase() === 'sí' || String(row['cuenta_bancaria_principal'] ?? '').trim().toLowerCase() === 'si',
        });
      }
    }

    let created = 0;
    let updated = 0;
    let skipped = 0;
    const errors: { row: number; message: string }[] = [];

    let rowIndex = 0;
    for (const [key, entry] of partyMap) {
      rowIndex++;
      try {
        const row = entry.row;
        const id = String(row['id'] ?? '').trim();

        const rawType = String(row['tipo'] ?? row['type'] ?? '').trim().toLowerCase();
        const partyType = typeMap[rawType] ?? rawType.toUpperCase();

        if (!validTypes.includes(partyType)) {
          errors.push({ row: rowIndex, message: `Tipo inválido: ${rawType}` });
          skipped++;
          continue;
        }

        const name = String(row['razon_social'] ?? row['name'] ?? '').trim();
        if (!name) {
          errors.push({ row: rowIndex, message: 'Falta razón social' });
          skipped++;
          continue;
        }

        const rawIva = String(row['condicion_iva'] ?? row['vat_condition'] ?? '').trim().toLowerCase();
        const vatCondition = ivaMap[rawIva] ?? (rawIva.toUpperCase() || undefined);

        const rawActive = String(row['activo'] ?? row['active'] ?? 'sí').trim().toLowerCase();
        const isActive = rawActive === 'sí' || rawActive === 'si' || rawActive === 'true' || rawActive === '1';

        const rawData: any = {
          type: partyType as any,
          name,
          business_names: String(row['nombre_fantasia'] ?? row['business_names'] ?? '').trim() || undefined,
          document_type: String(row['tipo_documento'] ?? row['document_type'] ?? '').trim().toUpperCase() || undefined,
          tax_id: String(row['CUIT'] ?? row['tax_id'] ?? '').trim() || undefined,
          email: String(row['email'] ?? '').trim() || undefined,
          vat_condition: vatCondition,
          exemption_rate: Number(row['tasa_exencion'] ?? row['exemption_rate'] ?? 0),
          active: isActive,
        };

        if (entry.contacts.length > 0) {
          rawData.contacts = entry.contacts;
        }
        if (entry.bank_accounts.length > 0) {
          rawData.bank_accounts = entry.bank_accounts;
        }

        if (id) {
          await this.service.update(id, rawData);
          updated++;
        } else {
          await this.service.create(rawData);
          created++;
        }
      } catch (e: any) {
        errors.push({ row: rowIndex, message: e.message ?? 'Error desconocido' });
        skipped++;
      }
    }

    return { created, updated, saved: created + updated, failed: skipped, total: rows.length, errors };
  }

  // 🔥 Rutas con :id DESPUÉS de las rutas fijas
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
}
