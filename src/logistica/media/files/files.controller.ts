import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('media/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly service: FilesService) {}

  @Post()
  create(@Body() dto: CreateFileDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
