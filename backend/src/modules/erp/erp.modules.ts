import { Module } from '@nestjs/common';
import { DocumentTypesController } from './documents/documents-types/documents-types.controller';
import { DocumentTypesService } from './documents/documents-types/documents-types.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService, PrismaService],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
