import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { IntakeRecordsController } from './intake-records.controller';
import { IntakeRecordsService } from './intake-records.service';
import { AccessControlModule } from '@/access-control/access-control.module';

@Module({
  imports: [
    PrismaModule,
    AccessControlModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  ],
  controllers: [FilesController, IntakeRecordsController],
  providers: [FilesService, IntakeRecordsService],
  exports: [FilesService],
})
export class FilesModule {}
