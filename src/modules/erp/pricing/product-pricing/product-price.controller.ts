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

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';

import { ProductPriceService } from './product-pricing.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AuditService } from '@/modules/erp/audit/audit.service';

import { CreateProductPriceDto } from './dto/create-product-price.dto';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('product-prices')
@UseGuards(JwtAuthGuard)
export class ProductPriceController {
  constructor(
    private readonly productPriceService: ProductPriceService,
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  // =========================================================
  // CREATE
  // =========================================================

  @RequirePermissions('product-prices.create')
  @Post()
  create(
    @Body()
    dto: CreateProductPriceDto,

    @CurrentUser()
    user: AuthUser,
  ) {
    return this.productPriceService.create(dto, user.id);
  }

  // =========================================================
  // FIND BY PRODUCT
  // =========================================================

  @RequirePermissions('product-prices.read')
  @Get('product/:productId')
  findByProduct(
    @Param('productId')
    productId: string,
  ) {
    return this.productPriceService.findByProduct(productId);
  }

  // =========================================================
  // FIND ONE
  // =========================================================

  @RequirePermissions('product-prices.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPriceService.findOne(id);
  }

  // =========================================================
  // UPDATE
  // =========================================================

  @RequirePermissions('product-prices.update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductPriceDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.productPriceService.update(id, dto, user.id);
  }

  // =========================================================
  // DELETE
  // =========================================================

  @RequirePermissions('product-prices.delete')
  @Delete(':id')
  remove(
    @Param('id') id: string,

    @CurrentUser() user: AuthUser,
  ) {
    return this.productPriceService.remove(id, user.id);
  }

  // =========================================================
  // HISTORY (audit log)
  // =========================================================

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.auditService.findByRecord('product_price', id);
  }
}
