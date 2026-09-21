import { Module } from '@nestjs/common';
import { DocumentSequencesModule } from '@/modules/erp/document-sequences/document-sequences.module';
import { InternationalOperationsController } from './international-operations.controller';
import { InternationalOperationsService } from './international-operations.service';
import { ContainersService } from './containers/containers.service';
import { EventsService } from './events/events.service';
import { IntlOpsSettingsController } from './settings/settings.controller';
import { IntlOpsSettingsService } from './settings/settings.service';

@Module({
  imports: [DocumentSequencesModule],
  controllers: [IntlOpsSettingsController, InternationalOperationsController],
  providers: [InternationalOperationsService, ContainersService, EventsService, IntlOpsSettingsService],
  exports: [InternationalOperationsService],
})
export class InternationalOperationsModule {}
