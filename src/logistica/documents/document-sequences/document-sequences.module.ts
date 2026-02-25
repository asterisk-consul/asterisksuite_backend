import { Module } from '@nestjs/common';
import { DocumentSequencesService } from './document-sequences.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  providers: [DocumentSequencesService, PrismaService],
  exports: [DocumentSequencesService],
})
export class DocumentSequencesModule {}
