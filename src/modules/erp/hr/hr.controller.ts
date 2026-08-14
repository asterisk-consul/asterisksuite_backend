import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards, Request } from '@nestjs/common';
import { HrService } from './hr.service';
import { CreateHrValeDto } from './dto/create-hr-vale.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('hr')
export class HrController {
  constructor(private readonly service: HrService) {}

  // ══════════════════════════════════════════════════════════
  // VALES
  // ══════════════════════════════════════════════════════════

  @Post('vales')
  createVale(@Body() dto: CreateHrValeDto, @Request() req: any) {
    return this.service.createVale(dto, req.user.id);
  }

  @Get('vales')
  findAllVales(
    @Query('party_id') partyId?: string,
    @Query('party_type') partyType?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
  ) {
    return this.service.findAllVales({ party_id: partyId, party_type: partyType, status, type });
  }

  @Get('vales/:id')
  findOneVale(@Param('id') id: string) {
    return this.service.findOneVale(id);
  }

  @Patch('vales/:id/confirm')
  confirmVale(@Param('id') id: string, @Request() req: any) {
    return this.service.confirmVale(id, req.user.id);
  }

  @Patch('vales/:id/cancel')
  cancelVale(@Param('id') id: string, @Request() req: any) {
    return this.service.cancelVale(id, req.user.id);
  }

  // ══════════════════════════════════════════════════════════
  // CUENTAS CORRIENTES RRHH
  // ══════════════════════════════════════════════════════════

  @Get('accounts')
  getHrAccounts(@Query('party_type') partyType?: string) {
    return this.service.getHrAccounts({ party_type: partyType });
  }

  @Get('accounts/:id/entries')
  getHrAccountEntries(@Param('id') id: string) {
    return this.service.getHrAccountEntries(id);
  }

  @Get('accounts/balance/:partyId/:currencyCode')
  getHrBalance(@Param('partyId') partyId: string, @Param('currencyCode') currencyCode: string) {
    return this.service.getHrBalance(partyId, currencyCode);
  }

  // ══════════════════════════════════════════════════════════
  // REPORTE DE COMISIONES
  // ══════════════════════════════════════════════════════════

  @Get('commissions')
  getCommissionsReport(
    @Query('month') month: string,
    @Query('seller_id') sellerId?: string,
  ) {
    return this.service.getCommissionsReport(month, sellerId);
  }

  @Post('commissions/vale')
  generateCommissionVale(
    @Body() body: { seller_id: string; month: string },
    @Request() req: any,
  ) {
    return this.service.generateCommissionVale(body.seller_id, body.month, req.user.id);
  }
}
