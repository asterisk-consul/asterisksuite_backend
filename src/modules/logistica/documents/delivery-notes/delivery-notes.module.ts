import { Module } from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentSequencesModule } from '../../../master-data/document-sequences/document-sequences.module';

@Module({
  imports: [DocumentSequencesModule],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService, PrismaService],
})
export class DeliveryNotesModule {}
