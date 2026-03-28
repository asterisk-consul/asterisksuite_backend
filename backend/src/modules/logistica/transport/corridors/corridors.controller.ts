import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { CorridorsService } from './corridors.service';
import { CreateCorridorDto } from './dto/create-corridor.dto';
import { UpdateCorridorDto } from './dto/update-corridor.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
@Controller('corridors')
@UseGuards(JwtAuthGuard)
export class CorridorsController {
  constructor(private readonly service: CorridorsService) {}

  @Post()
  create(@Body() dto: CreateCorridorDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('templates')
  findTemplates() {
    return this.service.findTemplates();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  @Get(':id/route')
  getRoute(@Param('id') id: string) {
    return this.service.getCorridorRoute(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCorridorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
