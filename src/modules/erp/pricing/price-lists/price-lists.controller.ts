import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { PriceListsService } from './price-lists.service';
import { CreatePriceListDto, UpdatePriceListDto } from './dto/price-list.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pricing/price-lists')
export class PriceListsController {
  constructor(private readonly service: PriceListsService) {}

  @Get()
  findAll(@Query('type') type?: string) {
    return this.service.findAll(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePriceListDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePriceListDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
