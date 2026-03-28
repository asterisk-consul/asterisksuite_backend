import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('warehouses')
@UseGuards(JwtAuthGuard)
export class WarehousesController {
  constructor(private readonly service: WarehousesService) {}

  @Post()
  create(@Body() dto: CreateWarehouseDto) {
    return this.service.create(dto);
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
  update(@Param('id') id: string, @Body() dto: UpdateWarehouseDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/desactivate')
  deactivate(@Param('id') id: string) {
    return this.service.desactivate(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.active(id);
  }
}
