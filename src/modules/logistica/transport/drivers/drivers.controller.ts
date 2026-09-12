import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('transport/drivers')
@UseGuards(JwtAuthGuard)
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @RequirePermissions('drivers.create')
  @Post()
  create(@Body() dto: CreateDriverDto) {
    return this.driversService.create(dto);
  }

  @RequirePermissions('drivers.read')
  @Get()
  findAll() {
    return this.driversService.findAll();
  }

  @RequirePermissions('drivers.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @RequirePermissions('drivers.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
    return this.driversService.update(id, dto);
  }

  @RequirePermissions('drivers.update')
  @Patch(':id/desacivate')
  desactive(@Param('id') id: string) {
    return this.driversService.desactivate(id);
  }

  @RequirePermissions('drivers.update')
  @Patch(':id/activate')
  active(@Param('id') id: string) {
    return this.driversService.activate(id);
  }
}
