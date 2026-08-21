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
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { AuditService } from '@/modules/erp/audit/audit.service';
import { VariantPricesService } from './variant-prices.service';
import { CreateVariantPriceDto } from './dto/create-variant-price.dto';

@Controller('variant-prices')
@UseGuards(JwtAuthGuard)
export class VariantPricesController {
  constructor(
    private readonly variantPricesService: VariantPricesService,
    private readonly auditService: AuditService,
  ) {}

  @Post()
  create(@Body() dto: CreateVariantPriceDto) {
    return this.variantPricesService.create(dto);
  }

  @Get('by-variant/:variantId')
  findByVariant(@Param('variantId') variantId: string) {
    return this.variantPricesService.findByVariant(variantId);
  }

  @Get('by-product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.variantPricesService.findByProduct(productId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variantPricesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateVariantPriceDto>) {
    return this.variantPricesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variantPricesService.remove(id);
  }

  @Get(':id/history')
  async getHistory(@Param('id') id: string) {
    return this.auditService.findByRecord('product_variant_prices', id);
  }
}
