import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Controller('media/photos')
export class PhotosController {
  constructor(private readonly service: PhotosService) {}

  @Post()
  create(@Body() dto: CreatePhotoDto) {
    return this.service.create(dto);
  }

  @Get(':entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.service.findByEntity(entityType, entityId);
  }
}
