import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxAccessGuard } from '@/common/guards/cash-box-access.guard';
import { CashBoxRenditionsService } from './cash-box-renditions.service';
import { CreateCashBoxRenditionDto } from './dto/create-cash-box-rendition.dto';
import { ApproveRenditionDto } from './dto/approve-rendition.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-box-renditions')
export class CashBoxRenditionsController {
  constructor(private readonly renditionsService: CashBoxRenditionsService) {}

  @Post()
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_renditions.create')
  create(@Body() dto: CreateCashBoxRenditionDto, @CurrentUser() user: AuthUser) {
    return this.renditionsService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('treasury.cash_box_renditions.read')
  findAll(@Query('cash_box_id') cashBoxId?: string) {
    return this.renditionsService.findAll(cashBoxId);
  }

  @Get(':id')
  @RequirePermissions('treasury.cash_box_renditions.read')
  findOne(@Param('id') id: string) {
    return this.renditionsService.findOne(id);
  }

  @Patch(':id/approve')
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_renditions.approve')
  approve(@Param('id') id: string, @Body() dto: ApproveRenditionDto, @CurrentUser() user: AuthUser) {
    return this.renditionsService.approve(id, dto, user.id);
  }

  @Patch(':id/reject')
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_renditions.reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.renditionsService.reject(id, user.id);
  }

  @Delete(':id')
  @UseGuards(CashBoxAccessGuard)
  @RequirePermissions('treasury.cash_box_renditions.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.renditionsService.remove(id, user.id);
  }
}
