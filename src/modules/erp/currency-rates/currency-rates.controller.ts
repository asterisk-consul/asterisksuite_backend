import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrencyRatesService } from './currency-rates.service';

import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('currency-rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  // @RequirePermissions('currency-rates.create')
  @Post()
  create(@Body() dto: CreateCurrencyRateDto) {
    return this.currencyRatesService.create(dto);
  }

  // @RequirePermissions('currency-rates.read')
  @Get()
  findAll() {
    return this.currencyRatesService.findAll();
  }

  // @RequirePermissions('currency-rates.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyRatesService.findOne(id);
  }

  // @RequirePermissions('currency-rates.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCurrencyRateDto) {
    return this.currencyRatesService.update(id, dto);
  }

  // @RequirePermissions('currency-rates.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyRatesService.remove(id);
  }
}
