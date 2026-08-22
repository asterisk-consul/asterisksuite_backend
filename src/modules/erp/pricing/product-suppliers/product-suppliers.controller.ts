import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ProductSuppliersService } from './product-suppliers.service';
import { CreateProductSupplierDto, UpdateProductSupplierDto } from './dto/product-supplier.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pricing/product-suppliers')
export class ProductSuppliersController {
  constructor(private readonly service: ProductSuppliersService) {}

  @Get()
  findAll(@Query('product_id') productId?: string) {
    return this.service.findAll(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductSupplierDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductSupplierDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
