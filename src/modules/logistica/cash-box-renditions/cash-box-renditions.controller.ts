import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxRenditionsService } from './cash-box-renditions.service';
import { CreateCashBoxRenditionDto } from './dto/create-cash-box-rendition.dto';
import { ApproveRenditionDto } from './dto/approve-rendition.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-box-renditions')
export class CashBoxRenditionsController {
  constructor(private readonly renditionsService: CashBoxRenditionsService) {}

  @Post()
  create(@Body() dto: CreateCashBoxRenditionDto, @CurrentUser() user: AuthUser) {
    return this.renditionsService.create(dto, user.id);
  }

  @Get()
  findAll(@Query('cash_box_id') cashBoxId?: string) {
    return this.renditionsService.findAll(cashBoxId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.renditionsService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body() dto: ApproveRenditionDto, @CurrentUser() user: AuthUser) {
    return this.renditionsService.approve(id, dto, user.id);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.renditionsService.reject(id, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.renditionsService.remove(id, user.id);
  }
}
