import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';

import { CurrenciesService } from './currencies.service';

import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @RequirePermissions('currencies.create')
  create(@Body() dto: CreateCurrencyDto) {
    return this.currenciesService.create(dto);
  }

  @Get()
  @RequirePermissions('currencies.read')
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get('base')
  @RequirePermissions('currencies.read')
  getBaseCurrency() {
    return this.currenciesService.getBaseCurrency();
  }

  @Get('latest')
  @RequirePermissions('currencies.read')
  getLatestRate(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('rateType') rateType?: string,
  ) {
    return this.currenciesService.getLatestRate(from, to, rateType as any);
  }

  @Get(':id')
  @RequirePermissions('currencies.read')
  findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('currencies.update')
  update(@Param('id') id: string, @Body() dto: UpdateCurrencyDto) {
    return this.currenciesService.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('currencies.delete')
  remove(@Param('id') id: string) {
    return this.currenciesService.remove(id);
  }
}
