import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('media/photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private readonly service: PhotosService) {}

  // @RequirePermissions('media.upload')
  @Post()
  create(@Body() dto: CreatePhotoDto) {
    return this.service.create(dto);
  }

  // @RequirePermissions('media.read')
  @Get(':entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.service.findByEntity(entityType, entityId);
  }
}
