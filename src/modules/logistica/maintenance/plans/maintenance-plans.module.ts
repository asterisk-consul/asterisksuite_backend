import { Module } from '@nestjs/common';
import { MaintenancePlansService } from './maintenance-plans.service';
import { MaintenancePlansController } from './maintenance-plans.controller';

@Module({
  controllers: [MaintenancePlansController],
  providers: [MaintenancePlansService],
  exports: [MaintenancePlansService],
})
export class MaintenancePlansModule {}
