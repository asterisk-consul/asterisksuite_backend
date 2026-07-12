import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxTransfersService } from './cash-box-transfers.service';
import { CreateCashBoxTransferDto } from './dto/create-cash-box-transfer.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-box-transfers')
export class CashBoxTransfersController {
  constructor(private readonly transfersService: CashBoxTransfersService) {}

  @Post()
  create(@Body() dto: CreateCashBoxTransferDto, @CurrentUser() user: AuthUser) {
    return this.transfersService.create(dto, user.id);
  }

  @Get()
  findAll(
    @Query('source_type') sourceType?: string,
    @Query('source_id') sourceId?: string,
    @Query('dest_type') destType?: string,
    @Query('dest_id') destId?: string,
    @Query('status') status?: string,
  ) {
    return this.transfersService.findAll({ source_type: sourceType, source_id: sourceId, dest_type: destType, dest_id: destId, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transfersService.findOne(id);
  }

  @Patch(':id/confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transfersService.confirm(id, user.id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transfersService.cancel(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.transfersService.remove(id, user.id);
  }
}
