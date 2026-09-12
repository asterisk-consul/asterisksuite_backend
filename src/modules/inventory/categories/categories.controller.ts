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

import { CategoriesService } from './categories.service';

import { CreateCategoryDto } from './dto/create-category.dto';

import { UpdateCategoryDto } from './dto/update-category.dto';

import { ReorderCategoryDto } from './dto/reorder-category.dto';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @RequirePermissions('categories.create')
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @RequirePermissions('categories.read')
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @RequirePermissions('categories.read')
  @Get('tree')
  findTree() {
    return this.categoriesService.findTree();
  }

  @RequirePermissions('categories.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @RequirePermissions('categories.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @RequirePermissions('categories.update')
  @Patch(':id/reorder')
  reorder(@Param('id') id: string, @Body() dto: ReorderCategoryDto) {
    return this.categoriesService.reorder(id, dto);
  }

  @RequirePermissions('categories.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
