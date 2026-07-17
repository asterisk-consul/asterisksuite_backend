import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxAccessGuard } from '@/common/guards/cash-box-access.guard';
import { CashBoxSessionGuard } from '@/common/guards/cash-box-session.guard';
import { CashBoxesService } from './cash-boxes.service';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { ForceCloseSessionDto } from './dto/force-close-session.dto';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-boxes')
export class CashBoxesController {
  constructor(private readonly cashBoxesService: CashBoxesService) {}

  @Post()
  @UseGuards(CashBoxAccessGuard)
  // @RequirePermissions('treasury.cash_boxes.create')
  create(@Body() dto: CreateCashBoxDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.create(dto, user.id);
  }

  @Get()
  // @RequirePermissions('treasury.cash_boxes.read')
  findAll(@Req() req: Request, @CurrentUser() user: AuthUser) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.cashBoxesService.findAll(
      companyRole === 'USER' ? user.id : undefined
    );
  }

  @Get('main')
  // @RequirePermissions('treasury.cash_boxes.read')
  findMain() {
    return this.cashBoxesService.findMain();
  }

  @Get(':id')
  // @RequirePermissions('treasury.cash_boxes.read')
  findOne(@Param('id') id: string) {
    return this.cashBoxesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CashBoxAccessGuard)
  // @RequirePermissions('treasury.cash_boxes.update')
  update(@Param('id') id: string, @Body() dto: UpdateCashBoxDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(CashBoxAccessGuard)
  // @RequirePermissions('treasury.cash_boxes.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.remove(id, user.id);
  }

  // ═══════════════════════════════════════════
  // USER ROLES
  // ═══════════════════════════════════════════

  @Get(':id/user-roles')
  getUserRoles(@Param('id') id: string) {
    return this.cashBoxesService.getUserRoles(id);
  }

  @Post(':id/user-roles')
  addUserRole(
    @Param('id') id: string,
    @Body() body: { user_id: string; role: string },
    @CurrentUser() user: AuthUser,
  ) {
    return this.cashBoxesService.addUserRole(id, body.user_id, body.role);
  }

  @Delete(':id/user-roles/:userId')
  @UseGuards(CashBoxAccessGuard)
  removeUserRole(@Param('id') id: string, @Param('userId') userId: string) {
    return this.cashBoxesService.removeUserRole(id, userId);
  }

  // ═══════════════════════════════════════════
  // BALANCES & SESSIONS
  // ═══════════════════════════════════════════

  @Get(':id/balances')
  // @RequirePermissions('treasury.cash_boxes.read')
  getBalances(@Param('id') id: string) {
    return this.cashBoxesService.getBalances(id);
  }

  @Post(':id/open')
  @UseGuards(CashBoxAccessGuard)
  // @RequirePermissions('treasury.cash_boxes.open')
  openSession(@Param('id') id: string, @Body() dto: OpenSessionDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.openSession(id, dto, user.id);
  }

  @Post(':id/close')
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  // @RequirePermissions('treasury.cash_boxes.close')
  closeSession(@Param('id') id: string, @Body() dto: CloseSessionDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.closeSession(id, dto, user.id);
  }

  @Post(':id/force-close')
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  // @RequirePermissions('treasury.cash_boxes.force_close')
  forceCloseSession(@Param('id') id: string, @Body() dto: ForceCloseSessionDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.forceCloseSession(id, dto, user.id);
  }

  @Get(':id/session')
  // @RequirePermissions('treasury.cash_boxes.read')
  getCurrentSession(@Param('id') id: string) {
    return this.cashBoxesService.getCurrentSession(id);
  }

  @Get(':id/sessions')
  // @RequirePermissions('treasury.cash_boxes.read')
  getSessionHistory(@Param('id') id: string) {
    return this.cashBoxesService.getSessionHistory(id);
  }
}
