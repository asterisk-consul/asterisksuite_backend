import { Module } from '@nestjs/common';
import { MaintenanceOrdersService } from './maintenance-orders.service';
import { MaintenanceOrdersController } from './maintenance-orders.controller';
import { NotificationsModule } from '@/modules/notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [MaintenanceOrdersController],
  providers: [MaintenanceOrdersService],
  exports: [MaintenanceOrdersService],
})
export class MaintenanceOrdersModule {}
