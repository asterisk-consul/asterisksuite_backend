import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CashBoxMovementsService } from './cash-box-movements.service';
import { CreateCashBoxMovementDto } from './dto/create-cash-box-movement.dto';
import { UpdateCashBoxMovementDto } from './dto/update-cash-box-movement.dto';
import { FilterCashBoxMovementDto } from './dto/filter-cash-box-movement.dto';

@UseGuards(JwtAuthGuard)
@Controller('logistica/cash-box-movements')
export class CashBoxMovementsController {
  constructor(private readonly movementsService: CashBoxMovementsService) {}

  @Post()
  create(@Body() dto: CreateCashBoxMovementDto, @CurrentUser() user: AuthUser) {
    return this.movementsService.create(dto, user.id);
  }

  @Get()
  findAll(@Query() filters: FilterCashBoxMovementDto) {
    return this.movementsService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCashBoxMovementDto, @CurrentUser() user: AuthUser) {
    return this.movementsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.movementsService.remove(id, user.id);
  }
}
