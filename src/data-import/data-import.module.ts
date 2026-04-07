import { Module } from '@nestjs/common';
import { DataImportController } from './data-import.controller';
import { DataImportService } from './data-import.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [DataImportController],
  providers: [DataImportService, PrismaService],
})
export class DataImportModule {}
