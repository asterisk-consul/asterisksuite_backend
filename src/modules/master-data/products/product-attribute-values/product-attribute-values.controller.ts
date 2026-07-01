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

// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ProductAttributeValuesService } from './product-attribute-values.service';

import { CreateProductAttributeValueDto } from './dto/create-product-attribute-value.dto';
import { UpdateProductAttributeValueDto } from './dto/update-product-attribute-value.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('product-attribute-values')
export class ProductAttributeValuesController {
  constructor(private readonly service: ProductAttributeValuesService) {}

  // @RequirePermissions('product_attribute_values.create')
  @Post()
  create(
    @Body()
    data: CreateProductAttributeValueDto,
  ) {
    return this.service.create(data);
  }

  // @RequirePermissions('product_attribute_values.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('product_attribute_values.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('product_attribute_values.update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: UpdateProductAttributeValueDto,
  ) {
    return this.service.update(id, data);
  }

  // @RequirePermissions('product_attribute_values.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
