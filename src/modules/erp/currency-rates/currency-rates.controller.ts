import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrencyRatesService } from './currency-rates.service';

import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('currency-rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  @RequirePermissions('currency-rates.create')
  @Post()
  create(@Body() dto: CreateCurrencyRateDto) {
    return this.currencyRatesService.create(dto);
  }

  @RequirePermissions('currency-rates.read')
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.currencyRatesService.findAll({
      page: Number(page) || 1,
      pageSize: Number(pageSize) || 25,
    });
  }

  @RequirePermissions('currency-rates.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyRatesService.findOne(id);
  }

  @RequirePermissions('currency-rates.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCurrencyRateDto) {
    return this.currencyRatesService.update(id, dto);
  }

  @RequirePermissions('currency-rates.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyRatesService.remove(id);
  }
}
