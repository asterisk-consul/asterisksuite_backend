import { Module } from '@nestjs/common';
import { CommercialAdjustmentConceptsController } from './commercial-adjustment-concepts.controller';
import { CommercialAdjustmentConceptsService } from './commercial-adjustment-concepts.service';

@Module({
  controllers: [CommercialAdjustmentConceptsController],
  providers: [CommercialAdjustmentConceptsService],
  exports: [CommercialAdjustmentConceptsService],
})
export class CommercialAdjustmentConceptsModule {}
