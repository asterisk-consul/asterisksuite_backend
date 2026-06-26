import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrenciesService } from './currencies.service';

import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

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
