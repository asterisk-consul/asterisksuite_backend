import { Module } from '@nestjs/common';
import { TireMovementsService } from './tire-movements.service';
import { TireMovementsController } from './tire-movements.controller';

@Module({
  controllers: [TireMovementsController],
  providers: [TireMovementsService],
  exports: [TireMovementsService],
})
export class TireMovementsModule {}
