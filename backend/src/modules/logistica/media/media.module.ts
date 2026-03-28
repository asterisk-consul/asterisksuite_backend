import { Module } from '@nestjs/common';
import { PhotosModule } from './photos/photos.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [PhotosModule, FilesModule],
  exports: [PhotosModule, FilesModule],
})
export class MediaModule {}
