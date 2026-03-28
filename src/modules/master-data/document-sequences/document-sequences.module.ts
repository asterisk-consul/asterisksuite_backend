import { Module } from '@nestjs/common';
import { DocumentSequenceController } from './document-sequence.controller';
import { DocumentSequencesService } from './document-sequences.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [DocumentSequenceController],
  providers: [DocumentSequencesService, PrismaService],
  exports: [DocumentSequencesService],
})
export class DocumentSequencesModule {}
