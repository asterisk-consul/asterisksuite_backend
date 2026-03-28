import { Module } from '@nestjs/common';
import { DocumentTypesService } from './documents-types.service';
import { DocumentTypesController } from './documents-types.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService, PrismaService],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
