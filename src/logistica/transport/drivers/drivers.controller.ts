import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@Controller('transport/drivers')
@UseGuards(JwtAuthGuard)
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
