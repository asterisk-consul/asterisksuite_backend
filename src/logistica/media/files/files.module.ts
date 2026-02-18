import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, LogisticaPrismaService],
  exports: [FilesService],
})
export class FilesModule {}
