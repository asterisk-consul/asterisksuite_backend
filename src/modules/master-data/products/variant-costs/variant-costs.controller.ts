import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { VariantCostsService } from './variant-costs.service';

import { CreateVariantCostDto } from './dto/create-variant-cost.dto';

import { UpdateVariantCostDto } from './dto/update-variant-cost.dto';

@Controller('erp/variant-costs')
export class VariantCostsController {
  constructor(private readonly service: VariantCostsService) {}

  // @RequirePermissions('variant_costs.create')
  @Post()
  create(@Body() data: CreateVariantCostDto) {
    return this.service.create(data);
  }

  // @RequirePermissions('variant_costs.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('variant_costs.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('variant_costs.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateVariantCostDto) {
    return this.service.update(id, data);
  }

  // @RequirePermissions('variant_costs.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
