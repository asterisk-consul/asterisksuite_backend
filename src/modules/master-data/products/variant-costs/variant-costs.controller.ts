import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { VariantCostsService } from './variant-costs.service';

import { CreateVariantCostDto } from './dto/create-variant-cost.dto';

import { UpdateVariantCostDto } from './dto/update-variant-cost.dto';

@Controller('erp/variant-costs')
export class VariantCostsController {
  constructor(private readonly service: VariantCostsService) {}

  @Post()
  create(@Body() data: CreateVariantCostDto) {
    return this.service.create(data);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateVariantCostDto) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
