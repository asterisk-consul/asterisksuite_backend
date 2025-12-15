import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service.js';
import { CreateCategoriaDto } from './dto/create-categorias.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import { FindCategoriasDto } from './dto/find-categorias.dto.js';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  findAll(@Query() query: FindCategoriasDto) {
    return this.categoriasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(id);
  }

  @Post()
  create(@Body() data: CreateCategoriaDto) {
    return this.categoriasService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.delete(id);
  }
}
