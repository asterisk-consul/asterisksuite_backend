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
import { ProductComponentsService } from './product-components.service';

import { CreateProductComponentDto } from './dto/create-product-component.dto';
import { UpdateProductComponentDto } from './dto/update-product-component.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('product-components')
export class ProductComponentsController {
  constructor(private readonly service: ProductComponentsService) {}

  // @RequirePermissions('product_components.create')
  @Post()
  create(
    @Body()
    data: CreateProductComponentDto,
  ) {
    return this.service.create(data);
  }

  // @RequirePermissions('product_components.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('product_components.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  // @RequirePermissions('product_components.update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    data: UpdateProductComponentDto,
  ) {
    return this.service.update(id, data);
  }

  // @RequirePermissions('product_components.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
