import { Module } from '@nestjs/common';
import { DocumentSequenceController } from './document-sequence.controller';
import { DocumentSequencesService } from './document-sequences.service';

@Module({
  controllers: [DocumentSequenceController],
  providers: [DocumentSequencesService],
  exports: [DocumentSequencesService],
})
export class DocumentSequencesModule {}
