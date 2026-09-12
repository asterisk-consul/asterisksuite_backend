import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxAccessGuard } from '@/common/guards/cash-box-access.guard';
import { CashBoxTransfersService } from './cash-box-transfers.service';
import { CreateCashBoxTransferDto } from './dto/create-cash-box-transfer.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-box-transfers')
export class CashBoxTransfersController {
  constructor(private readonly transfersService: CashBoxTransfersService) {}

  @Post()
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_transfers.create')
  create(@Body() dto: CreateCashBoxTransferDto, @CurrentUser() user: AuthUser) {
    return this.transfersService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('treasury.cash_box_transfers.read')
  findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('source_type') sourceType?: string,
    @Query('source_id') sourceId?: string,
    @Query('dest_type') destType?: string,
    @Query('dest_id') destId?: string,
    @Query('status') status?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.transfersService.findAll({
      source_type: sourceType,
      source_id: sourceId,
      dest_type: destType,
      dest_id: destId,
      status,
      user_id: companyRole === 'USER' ? user.id : undefined,
    });
  }

  @Get(':id')
  @RequirePermissions('treasury.cash_box_transfers.read')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Patch(':id/confirm')
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_transfers.confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transfersService.confirm(id, user.id);
  }

  @Patch(':id/cancel')
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_transfers.cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transfersService.cancel(id, user.id);
  }

  @Delete(':id')
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_transfers.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transfersService.remove(id, user.id);
  }
}
