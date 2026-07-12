import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxesService } from './cash-boxes.service';
import { CreateCashBoxDto } from './dto/create-cash-box.dto';
import { UpdateCashBoxDto } from './dto/update-cash-box.dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { CloseSessionDto } from './dto/close-session.dto';
import { ForceCloseSessionDto } from './dto/force-close-session.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-boxes')
export class CashBoxesController {
  constructor(private readonly cashBoxesService: CashBoxesService) {}

  @Post()
  create(@Body() dto: CreateCashBoxDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.cashBoxesService.findAll();
  }

  @Get('main')
  findMain() {
    return this.cashBoxesService.findMain();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cashBoxesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCashBoxDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.remove(id, user.id);
  }

  @Get(':id/balances')
  getBalances(@Param('id') id: string) {
    return this.cashBoxesService.getBalances(id);
  }

  @Post(':id/open')
  openSession(@Param('id') id: string, @Body() dto: OpenSessionDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.openSession(id, dto, user.id);
  }

  @Post(':id/close')
  closeSession(@Param('id') id: string, @Body() dto: CloseSessionDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.closeSession(id, dto, user.id);
  }

  @Post(':id/force-close')
  forceCloseSession(@Param('id') id: string, @Body() dto: ForceCloseSessionDto, @CurrentUser() user: AuthUser) {
    return this.cashBoxesService.forceCloseSession(id, dto, user.id);
  }

  @Get(':id/session')
  getCurrentSession(@Param('id') id: string) {
    return this.cashBoxesService.getCurrentSession(id);
  }

  @Get(':id/sessions')
  getSessionHistory(@Param('id') id: string) {
    return this.cashBoxesService.getSessionHistory(id);
  }
}
