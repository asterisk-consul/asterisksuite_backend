import { Module } from '@nestjs/common';
import { PickingService } from './picking.service';
import { PickingController } from './picking.controller';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  controllers: [PickingController],
  providers: [PickingService, PrismaService],
  exports: [PickingService],
})
export class PickingModule {}
