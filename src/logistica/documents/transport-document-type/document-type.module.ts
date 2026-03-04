import { Module } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService, PrismaService],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
