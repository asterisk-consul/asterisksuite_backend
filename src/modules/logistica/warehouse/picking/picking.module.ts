import { Module } from '@nestjs/common';
import { PickingService } from './picking.service';
import { PickingController } from './picking.controller';

@Module({
  controllers: [PickingController],
  providers: [PickingService],
  exports: [PickingService],
})
export class PickingModule {}
