import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from 'src/access-control/guards/permissions.guard';
import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('master-data/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @RequirePermissions('products.create')
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  @Get()
  @RequirePermissions('products.read')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/root-products')
  @RequirePermissions('products.read')
  getRootProducts(@Param('id') id: string) {
    return this.service.getRootProducts(id);
  }

  @Get(':id')
  @RequirePermissions('products.read')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('products.update')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @RequirePermissions('products.delete')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
