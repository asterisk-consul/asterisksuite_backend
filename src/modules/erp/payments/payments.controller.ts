import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as XLSX from 'xlsx';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApplyAdvanceDto } from './dto/apply-advance.dto';
import { ReversePaymentDto } from './dto/reverse-payment.dto';
import type { Request } from 'express';
import { ForbiddenException } from '@nestjs/common';
import { PermissionContextBuilder } from '@/access-control/authorization/permission-context.builder';

@UseGuards(JwtAuthGuard)
@Controller('erp/payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly permissionContextBuilder: PermissionContextBuilder,
  ) {}

  @Post()
  @RequirePermissions('treasury.payments.create')
  async create(@Body() dto: CreatePaymentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    console.log('[payments-controller] create called, dto:', JSON.stringify(dto, null, 2))
    console.log('[payments-controller] user.id:', user.id)
    await this.assertCardPermission(dto.payment_method, dto.type, user.id, req['companyUserRole'] as string | undefined);
    return this.paymentsService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('treasury.payments.read')
  findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('party_id') partyId?: string,
    @Query('type') type?: string,
    @Query('payment_method') paymentMethod?: string,
    @Query('status') status?: string,
    @Query('account_id') accountId?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.paymentsService.findAll({
      party_id: partyId,
      type,
      payment_method: paymentMethod,
      status,
      account_id: accountId,
      user_id: partyId ? undefined : (companyRole === 'USER' ? user.id : undefined),
    });
  }

  @Get(':id')
  @RequirePermissions('treasury.payments.read')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('treasury.payments.update')
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const payment = await this.paymentsService.findOne(id);
    await this.assertCardPermission(dto.payment_method ?? payment.payment_method, payment.type, user.id, req['companyUserRole'] as string | undefined, 'create');
    return this.paymentsService.update(id, dto, user.id);
  }

  @Post(':id/confirm')
  @RequirePermissions('treasury.payments.confirm')
  async confirm(@Param('id') id: string, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const payment = await this.paymentsService.findOne(id);
    await this.assertCardPermission(payment.payment_method, payment.type, user.id, req['companyUserRole'] as string | undefined, 'confirm');
    return this.paymentsService.confirm(id, user.id);
  }

  @Post(':id/pay')
  @RequirePermissions('treasury.payments.mark_as_paid')
  markAsPaid(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.markAsPaid(id, user.id);
  }

  @Post(':id/reject')
  @RequirePermissions('treasury.payments.reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.reject(id, user.id);
  }

  @Post(':id/reverse')
  @RequirePermissions('treasury.payments.reverse')
  async reverse(@Param('id') id: string, @Body() dto: ReversePaymentDto, @CurrentUser() user: AuthUser, @Req() req: Request) {
    const payment = await this.paymentsService.findOne(id);
    await this.assertCardPermission(payment.payment_method, payment.type, user.id, req['companyUserRole'] as string | undefined, 'reverse');
    return this.paymentsService.reverse(id, user.id, dto.check_action);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.remove(id, user.id);
  }

  private async assertCardPermission(method: string, type: string, userId: string, companyRole?: string, action: 'create' | 'confirm' | 'reverse' = 'create') {
    if (method !== 'CREDIT_CARD' || companyRole === 'OWNER') return;
    const context = await this.permissionContextBuilder.build(userId);
    const permission = type === 'COLLECTION'
      ? `card_collections.${action}`
      : action === 'reverse' ? 'credit_cards.company.reverse' : 'credit_cards.company.use';
    if (!context.can(permission)) throw new ForbiddenException('No tenés permisos para operar con este tipo de tarjeta');
  }

  // ═══════════════════════════════════════════
  // ADVANCE PAYMENTS
  // ═══════════════════════════════════════════

  @Get('advance-available')
  findAdvanceAvailable(@Query('party_id') partyId?: string) {
    return this.paymentsService.findAdvanceAvailable(partyId);
  }

  @Post(':id/apply-advance')
  applyAdvance(
    @Param('id') id: string,
    @Body() dto: ApplyAdvanceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.applyAdvance(id, dto, user.id);
  }

  @Delete(':id/apply-advance/:documentId')
  removeAdvanceApplication(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.paymentsService.removeAdvanceApplication(id, documentId, user.id);
  }

  @Get('export')
  @RequirePermissions('treasury.payments.export')
  async exportPayments(
    @Query('type') type?: string,
    @Query('status') status?: string,
    @Query('format') format: string = 'xlsx',
    @Res() res?: Response,
    @CurrentUser() user?: AuthUser,
    @Req() req?: Request,
  ) {
    const companyRole = req?.['companyUserRole'] as string | undefined;
    const payments = await this.paymentsService.findAll({
      type,
      status,
      user_id: companyRole === 'USER' ? user?.id : undefined,
    });

    const typeLabels: Record<string, string> = { PAYMENT: 'Pago', COLLECTION: 'Cobro' };
    const statusLabels: Record<string, string> = {
      DRAFT: 'Borrador', CONFIRMED: 'Confirmado', PAID: 'Pagado',
      REVERSED: 'Rechazado', CANCELLED: 'Anulado'
    };
    const methodLabels: Record<string, string> = {
      CASH: 'Efectivo', CHECK: 'Cheque', BANK_TRANSFER: 'Transferencia',
      CREDIT_CARD: 'Tarjeta crédito', DEBIT_CARD: 'Tarjeta débito', VIRTUAL_WALLET: 'Billetera virtual'
    };

    const rows = payments.map((p: any) => ({
      id: p.id,
      numero: p.number,
      fecha: p.date?.toISOString?.()?.slice(0, 10) ?? p.date,
      tipo: typeLabels[p.type] ?? p.type,
      metodo: methodLabels[p.payment_method] ?? p.payment_method,
      monto: Number(p.amount),
      moneda: p.currency_code,
      tercero: p.party?.name ?? '',
      descripcion: p.description ?? '',
      estado: statusLabels[p.status] ?? p.status,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);

    ws['!cols'] = [
      { wch: 36 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
      { wch: 18 }, { wch: 15 }, { wch: 10 }, { wch: 25 },
      { wch: 30 }, { wch: 12 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');

    if (format === 'csv') {
      const csv = XLSX.utils.sheet_to_csv(ws);
      res?.set({ 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename=pagos.csv' });
      return res?.send(csv);
    }

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res?.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=pagos.xlsx',
    });
    res?.send(buffer);
  }

  @Get('export/template')
  @RequirePermissions('treasury.payments.import')
  downloadTemplate(@Res() res: Response) {
    const headers = [
      'fecha', 'tipo', 'tercero_nombre', 'tercero_cuit',
      'metodo', 'monto', 'moneda', 'descripcion'
    ];

    const exampleRows = [
      ['2026-07-19', 'PAYMENT', 'Proveedor ABC SRL', '30-98765432-1', 'BANK_TRANSFER', 150000, 'ARS', 'Pago factura A-0001'],
      ['2026-07-19', 'COLLECTION', 'Cliente de Prueba SA', '30-12345678-9', 'CASH', 85000, 'ARS', 'Cobro factura V-0001'],
    ];

    const notes = [
      [],
      ['TIPOS:', 'PAYMENT = Pago a proveedor, COLLECTION = Cobro de cliente'],
      ['MÉTODOS:', 'CASH, CHECK, BANK_TRANSFER, CREDIT_CARD, DEBIT_CARD, VIRTUAL_WALLET'],
      ['MONEDA:', 'ARS, USD'],
      ['NOTA:', 'El tercero se resuelve por nombre o CUIT. Si no existe, se omite la fila.'],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...exampleRows, ...notes]);
    ws['!cols'] = [
      { wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 15 },
      { wch: 18 }, { wch: 15 }, { wch: 8 }, { wch: 30 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=template_pagos.xlsx',
    });
    res.send(buffer);
  }

  @Post('import')
  @RequirePermissions('treasury.payments.import')
  @UseInterceptors(FileInterceptor('file'))
  async importPayments(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    const wb = XLSX.read(file.buffer, { type: 'buffer' });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws);

    const typeMap: Record<string, string> = {
      pago: 'PAYMENT', payment: 'PAYMENT',
      cobro: 'COLLECTION', collection: 'COLLECTION',
    };

    const methodMap: Record<string, string> = {
      efectivo: 'CASH', cash: 'CASH',
      cheque: 'CHECK', check: 'CHECK',
      transferencia: 'BANK_TRANSFER', transfer: 'BANK_TRANSFER', bank_transfer: 'BANK_TRANSFER',
      'tarjeta crédito': 'CREDIT_CARD', 'tarjeta credito': 'CREDIT_CARD', credit_card: 'CREDIT_CARD',
      'tarjeta débito': 'DEBIT_CARD', 'tarjeta debito': 'DEBIT_CARD', debit_card: 'DEBIT_CARD',
      billetera: 'VIRTUAL_WALLET', wallet: 'VIRTUAL_WALLET', virtual_wallet: 'VIRTUAL_WALLET',
    };

    let created = 0;
    let skipped = 0;
    const errors: { row: number; message: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] as any;
      try {
        const rawType = String(row['tipo'] ?? row['type'] ?? '').trim().toLowerCase();
        const paymentType = typeMap[rawType] ?? rawType.toUpperCase();
        if (!['PAYMENT', 'COLLECTION'].includes(paymentType)) {
          errors.push({ row: i + 2, message: `Tipo inválido: ${rawType}` });
          skipped++;
          continue;
        }

        const amount = Number(row['monto'] ?? row['amount'] ?? 0);
        if (!amount || amount <= 0) {
          errors.push({ row: i + 2, message: 'Monto inválido' });
          skipped++;
          continue;
        }

        const rawMethod = String(row['metodo'] ?? row['payment_method'] ?? '').trim().toLowerCase();
        const paymentMethod = methodMap[rawMethod] ?? rawMethod.toUpperCase();
        if (!['CASH', 'CHECK', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'VIRTUAL_WALLET'].includes(paymentMethod)) {
          errors.push({ row: i + 2, message: `Método inválido: ${rawMethod}` });
          skipped++;
          continue;
        }

        const dateStr = String(row['fecha'] ?? row['date'] ?? '').trim();
        const date = dateStr ? new Date(dateStr) : new Date();
        if (isNaN(date.getTime())) {
          errors.push({ row: i + 2, message: `Fecha inválida: ${dateStr}` });
          skipped++;
          continue;
        }

        const currency = String(row['moneda'] ?? row['currency'] ?? 'ARS').trim().toUpperCase();

        let partyId: string | null = null;
        const partyName = String(row['tercero_nombre'] ?? row['party_name'] ?? '').trim();
        const partyCuit = String(row['tercero_cuit'] ?? row['party_tax_id'] ?? '').trim();

        if (partyName || partyCuit) {
          const party = await this.paymentsService.findPartyByNameOrTaxId(partyName, partyCuit);
          if (party) partyId = party.id;
          else {
            errors.push({ row: i + 2, message: `Tercero no encontrado: ${partyName || partyCuit}` });
            skipped++;
            continue;
          }
        }

        await this.paymentsService.create({
          type: paymentType as any,
          payment_method: paymentMethod as any,
          amount,
          currency_code: currency,
          party_id: partyId,
          date: date.toISOString().split('T')[0],
          description: String(row['descripcion'] ?? row['description'] ?? '').trim() || undefined,
          status: 'DRAFT',
        } as any, user.id);

        created++;
      } catch (e: any) {
        errors.push({ row: i + 2, message: e.message ?? 'Error desconocido' });
        skipped++;
      }
    }

    return { created, saved: created, skipped, total: rows.length, errors };
  }
}
