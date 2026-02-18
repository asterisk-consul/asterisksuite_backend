import { Module } from '@nestjs/common';
import { DocumentSequencesService } from './document-sequences.service';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Module({
  providers: [DocumentSequencesService, LogisticaPrismaService],
  exports: [DocumentSequencesService],
})
export class DocumentSequencesModule {}
