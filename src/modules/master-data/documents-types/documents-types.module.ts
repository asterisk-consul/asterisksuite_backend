import { Module } from '@nestjs/common';
import { DocumentsTypesService } from './documents-types.service';
import { DocumentsTypesController } from './documents-types.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DocumentsTypesController],
  providers: [DocumentsTypesService, PrismaService],
  exports: [DocumentsTypesService],
})
export class DocumentsTypesModule {}
