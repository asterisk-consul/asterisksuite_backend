import { Module } from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { DocumentSequencesModule } from '../document-sequences/document-sequences.module';

@Module({
  imports: [DocumentSequencesModule],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService, LogisticaPrismaService],
})
export class DeliveryNotesModule {}
