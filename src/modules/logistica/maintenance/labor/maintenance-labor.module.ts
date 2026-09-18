import { Module } from '@nestjs/common';
import { MaintenanceLaborService } from './maintenance-labor.service';
import { MaintenanceLaborController } from './maintenance-labor.controller';

@Module({
  controllers: [MaintenanceLaborController],
  providers: [MaintenanceLaborService],
  exports: [MaintenanceLaborService],
})
export class MaintenanceLaborModule {}
