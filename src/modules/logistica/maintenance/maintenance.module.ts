import { Module } from '@nestjs/common';
import { MaintenanceOrdersModule } from './orders/maintenance-orders.module';
import { MaintenanceTasksModule } from './tasks/maintenance-tasks.module';
import { MaintenancePartsModule } from './parts/maintenance-parts.module';
import { MaintenanceLaborModule } from './labor/maintenance-labor.module';
import { MaintenanceServicesModule } from './services/maintenance-services.module';
import { TiresModule } from './tires/tires.module';
import { VehicleTirePositionsModule } from './positions/vehicle-tire-positions.module';
import { TireMovementsModule } from './movements/tire-movements.module';
import { MaintenancePlansModule } from './plans/maintenance-plans.module';
import { MaintenanceHistoryModule } from './history/maintenance-history.module';
import { MaintenanceDashboardModule } from './dashboard/maintenance-dashboard.module';
import { MaintenanceReportsModule } from './reports/maintenance-reports.module';

@Module({
  imports: [
    MaintenanceOrdersModule,
    MaintenanceTasksModule,
    MaintenancePartsModule,
    MaintenanceLaborModule,
    MaintenanceServicesModule,
    TiresModule,
    VehicleTirePositionsModule,
    TireMovementsModule,
    MaintenancePlansModule,
    MaintenanceHistoryModule,
    MaintenanceDashboardModule,
    MaintenanceReportsModule,
  ],
  exports: [
    MaintenanceOrdersModule,
    MaintenanceTasksModule,
    MaintenancePartsModule,
    MaintenanceLaborModule,
    MaintenanceServicesModule,
    TiresModule,
    VehicleTirePositionsModule,
    TireMovementsModule,
    MaintenancePlansModule,
    MaintenanceHistoryModule,
    MaintenanceDashboardModule,
    MaintenanceReportsModule,
  ],
})
export class MaintenanceModule {}