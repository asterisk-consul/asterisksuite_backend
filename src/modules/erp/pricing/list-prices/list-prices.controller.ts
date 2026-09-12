import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ListPricesService } from './list-prices.service';
import { CreateListPriceDto, UpdateListPriceDto } from './dto/list-price.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pricing/list-prices')
export class ListPricesController {
  constructor(private readonly service: ListPricesService) {}

  @Get()
  findAll(
    @Query('price_list_id') priceListId?: string,
    @Query('product_id') productId?: string,
  ) {
    return this.service.findAll(priceListId, productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateListPriceDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateListPriceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
