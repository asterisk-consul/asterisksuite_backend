import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';

@Controller('transport/drivers')
export class DriversController {
  constructor(private readonly service: DriversService) {}

  @Post()
  create(@Body() dto: CreateDriverDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('companyId') companyId: string) {
    return this.service.findAll(companyId);
  }
}
