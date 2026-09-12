import { Module } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentSequencesModule } from '@/modules/erp/document-sequences/document-sequences.module';
import { InternationalOperationsController } from './international-operations.controller';
import { InternationalOperationsService } from './international-operations.service';
import { ContainersService } from './containers/containers.service';
import { EventsService } from './events/events.service';

@Module({
  imports: [DocumentSequencesModule],
  controllers: [InternationalOperationsController],
  providers: [InternationalOperationsService, ContainersService, EventsService, PrismaService],
  exports: [InternationalOperationsService],
})
export class InternationalOperationsModule {}
