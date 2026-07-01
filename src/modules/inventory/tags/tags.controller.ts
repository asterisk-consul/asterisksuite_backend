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

import { TagsService } from './tags.service';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from '@/auth/decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard)
@Controller('erp/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // @RequirePermissions('tags.create')
  @Post()
  create(@Body() dto: CreateTagDto) {
    return this.tagsService.create(dto);
  }

  // @RequirePermissions('tags.read')
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  // @RequirePermissions('tags.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  // @RequirePermissions('tags.update')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.tagsService.update(id, dto, user.id);
  }

  // @RequirePermissions('tags.delete')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
