import { Module } from '@nestjs/common';
import { PickingService } from './picking.service';
import { PickingController } from './picking.controller';
import { LogisticaPrismaService } from 'src/prisma/prisma-logistica.service';

@Module({
  controllers: [PickingController],
  providers: [PickingService, LogisticaPrismaService],
  exports: [PickingService],
})
export class PickingModule {}
