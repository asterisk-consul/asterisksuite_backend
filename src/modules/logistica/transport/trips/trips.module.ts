import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { DocumentsSalesModule } from '../../../erp/documents-sales/documents_sales.module';

@Module({
  imports: [DocumentsSalesModule],
  controllers: [TripsController],
  providers: [TripsService],
  exports: [TripsService],
})
export class TripsModule {}
