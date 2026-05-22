import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('master-data/products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  // ─────────────────────────────
  // CREATE
  // ─────────────────────────────

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }

  // ─────────────────────────────
  // FIND ALL
  // ─────────────────────────────

  @Get()
  findAll() {
    return this.service.findAll();
  }

  // ─────────────────────────────
  // ROOT PRODUCTS
  // ─────────────────────────────

  @Get(':id/root-products')
  getRootProducts(@Param('id') id: string) {
    return this.service.getRootProducts(id);
  }

  // ─────────────────────────────
  // FIND ONE
  // ─────────────────────────────

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // ─────────────────────────────
  // UPDATE
  // ─────────────────────────────

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.service.update(id, dto);
  }

  // ─────────────────────────────
  // REMOVE
  // ─────────────────────────────

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
