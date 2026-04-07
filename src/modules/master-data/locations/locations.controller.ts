import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('locations')
@UseGuards(JwtAuthGuard)
export class LocationsController {
  constructor(private readonly service: LocationsService) {}

  @Post()
  create(@Body() dto: CreateLocationDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateLocationDto) {
    return this.service.update(id, dto);
  }

  // @Patch(':id/activate')
  // activate(@Param('id') id: string) {
  //   return this.service.activate(id);
  // }

  // @Patch(':id/desactivate')
  // deactivate(@Param('id') id: string) {
  //   return this.service.deactivate(id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
