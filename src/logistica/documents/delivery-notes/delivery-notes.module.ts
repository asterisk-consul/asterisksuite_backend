import { Module } from '@nestjs/common';
import { DeliveryNotesService } from './delivery-notes.service';
import { DeliveryNotesController } from './delivery-notes.controller';
import { PrismaModule } from '@/prisma/prisma.module';
import { LogisticaPrismaModule } from '@/prisma/prisma-logistica.module';

@Module({
  imports: [PrismaModule, LogisticaPrismaModule],
  controllers: [DeliveryNotesController],
  providers: [DeliveryNotesService],
  exports: [DeliveryNotesService],
})
export class DeliveryNotesModule {}
