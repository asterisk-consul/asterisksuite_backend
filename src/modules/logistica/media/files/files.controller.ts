import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('media/files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly service: FilesService) {}

  // @RequirePermissions('media.upload')
  @Post()
  create(@Body() dto: CreateFileDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('media.read')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // @RequirePermissions('media.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
