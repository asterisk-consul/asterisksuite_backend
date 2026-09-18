import { Module } from '@nestjs/common';
import { MaintenancePartsService } from './maintenance-parts.service';
import { MaintenancePartsController } from './maintenance-parts.controller';

@Module({
  controllers: [MaintenancePartsController],
  providers: [MaintenancePartsService],
  exports: [MaintenancePartsService],
})
export class MaintenancePartsModule {}
