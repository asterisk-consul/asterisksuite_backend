import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentSequencesController } from './document-sequences.controller';
import { DocumentSequencesService } from './document-sequences.service';

@Module({
  controllers: [DocumentSequencesController],
  providers: [DocumentSequencesService, PrismaService],
  exports: [DocumentSequencesService],
})
export class DocumentSequencesModule {}
