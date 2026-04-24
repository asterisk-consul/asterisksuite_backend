import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentsSalesModule } from '../../../erp/documents-sales/documents_sales.module';

@Module({
  imports: [DocumentsSalesModule],
  controllers: [TripsController],
  providers: [TripsService, PrismaService],
  exports: [TripsService],
})
export class TripsModule {}
