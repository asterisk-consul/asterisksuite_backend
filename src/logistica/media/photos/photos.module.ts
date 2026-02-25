import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [PhotosController],
  providers: [PhotosService, PrismaService],
})
export class PhotosModule {}
