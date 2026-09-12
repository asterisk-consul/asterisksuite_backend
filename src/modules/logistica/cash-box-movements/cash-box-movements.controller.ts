import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxAccessGuard } from '@/common/guards/cash-box-access.guard';
import { CashBoxSessionGuard } from '@/common/guards/cash-box-session.guard';
import { CashBoxMovementsService } from './cash-box-movements.service';
import { CreateCashBoxMovementDto } from './dto/create-cash-box-movement.dto';
import { UpdateCashBoxMovementDto } from './dto/update-cash-box-movement.dto';
import { FilterCashBoxMovementDto } from './dto/filter-cash-box-movement.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-box-movements')
export class CashBoxMovementsController {
  constructor(private readonly movementsService: CashBoxMovementsService) {}

  @Post()
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  @RequirePermissions('treasury.cash_box_movements.create')
  create(@Body() dto: CreateCashBoxMovementDto, @CurrentUser() user: AuthUser) {
    return this.movementsService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('treasury.cash_box_movements.read')
  findAll(@Query() filters: FilterCashBoxMovementDto) {
    return this.movementsService.findAll(filters);
  }

  @Get(':id')
  @RequirePermissions('treasury.cash_box_movements.read')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  @RequirePermissions('treasury.cash_box_movements.update')
  update(@Param('id') id: string, @Body() dto: UpdateCashBoxMovementDto, @CurrentUser() user: AuthUser) {
    return this.movementsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(CashBoxAccessGuard, CashBoxSessionGuard)
  @RequirePermissions('treasury.cash_box_movements.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.movementsService.remove(id, user.id);
  }
}
