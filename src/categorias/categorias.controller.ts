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
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categorias.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { FindCategoriasDto } from './dto/find-categorias.dto';

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
