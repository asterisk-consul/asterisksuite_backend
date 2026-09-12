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

import { AttributesService } from './attributes.service';

import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @RequirePermissions('attributes.create')
  @Post()
  create(@Body() data: CreateAttributeDto) {
    return this.attributesService.create(data);
  }

  @RequirePermissions('attributes.read')
  @Get()
  findAll() {
    return this.attributesService.findAll();
  }

  @RequirePermissions('attributes.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.findOne(id);
  }

  @RequirePermissions('attributes.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateAttributeDto) {
    return this.attributesService.update(id, data);
  }

  @RequirePermissions('attributes.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(id);
  }
}
