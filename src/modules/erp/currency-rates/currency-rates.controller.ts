import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CurrencyRatesService } from './currency-rates.service';

import { CreateCurrencyRateDto } from './dto/create-currency-rate.dto';
import { UpdateCurrencyRateDto } from './dto/update-currency-rate.dto';

@Controller('currency-rates')
export class CurrencyRatesController {
  constructor(private readonly currencyRatesService: CurrencyRatesService) {}

  @Post()
  create(@Body() dto: CreateCurrencyRateDto) {
    return this.currencyRatesService.create(dto);
  }

  @Get()
  findAll() {
    return this.currencyRatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.currencyRatesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCurrencyRateDto) {
    return this.currencyRatesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyRatesService.remove(id);
  }
}
