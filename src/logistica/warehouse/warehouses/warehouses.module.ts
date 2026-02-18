import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses.service';
import { WarehousesController } from './warehouses.controller';
import { LogisticaPrismaModule } from '@/prisma/prisma-logistica.module';

@Module({
  imports: [LogisticaPrismaModule],
  controllers: [WarehousesController],
  providers: [WarehousesService],
  exports: [WarehousesService],
})
export class WarehousesModule {}
