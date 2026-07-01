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
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';
@Controller('corridors')
@UseGuards(JwtAuthGuard)
export class CorridorsController {
  constructor(private readonly service: CorridorsService) {}

  // @RequirePermissions('corridors.create')
  @Post()
  create(@Body() dto: CreateCorridorDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('corridors.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('corridors.read')
  @Get('templates')
  findTemplates() {
    return this.service.findTemplates();
  }

  // @RequirePermissions('corridors.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
  // @RequirePermissions('corridors.read')
  @Get(':id/route')
  getRoute(@Param('id') id: string) {
    return this.service.getCorridorRoute(id);
  }

  // @RequirePermissions('corridors.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCorridorDto) {
    return this.service.update(id, dto);
  }

  // @RequirePermissions('corridors.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
