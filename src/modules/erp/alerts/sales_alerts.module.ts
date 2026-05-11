import { Module } from '@nestjs/common';
import { alertService } from './sales_alerts.service';
@Module({
  providers: [alertService],
  exports: [alertService],
})
export class alarteModule {}
