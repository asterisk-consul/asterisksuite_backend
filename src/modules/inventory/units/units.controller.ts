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

import { UnitsService } from './units.service';

import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from '@/auth/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('erp/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  // @RequirePermissions('units.create')
  @Post()
  create(@Body() dto: CreateUnitDto) {
    return this.unitsService.create(dto);
  }

  // @RequirePermissions('units.read')
  @Get()
  findAll() {
    return this.unitsService.findAll();
  }

  // @RequirePermissions('units.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unitsService.findOne(id);
  }

  // @RequirePermissions('units.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUnitDto) {
    return this.unitsService.update(id, dto);
  }

  // @RequirePermissions('units.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
