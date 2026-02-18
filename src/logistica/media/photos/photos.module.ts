import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [PhotosController],
  providers: [PhotosService, LogisticaPrismaService],
})
export class PhotosModule {}
