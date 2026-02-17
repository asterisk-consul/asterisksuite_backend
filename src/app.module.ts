// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/config.module.js';
// Assuming you have a module that provides PrismaService
import { PrismaModule } from './prisma/prisma.module'; // <-- Add/identify this
import { LogisticaPrismaModule } from './prisma/prisma-logistica.module';
import { SshModule } from './ssh/ssh.module';
// import { BootstrapModule } from './bootstrap/bootstrap.module';
import { AuthModule } from './auth/auth.module';
import { ArticulosModule } from './articulos/articulos.module';
import { CategoriasModule } from './categorias/categorias.module';
import { TableModule } from './tables/table.module';
import { DataImportModule } from './data-import/data-import.module.js';
import { CompaniesModule } from './logistica/core/companies/companies.module';
import { UsersModule } from './logistica/core/users/users.module';
import { ProductsModule } from './logistica/master-data/products/products.module';
import { BusinessPartiesModule } from './logistica/master-data/business-parties/business-parties.module';
import { WarehousesModule } from './logistica/warehouse/warehouses/warehouses.module';
import { LocationsModule } from './logistica/master-data/locations/locations.module';
import { PalletsModule } from './logistica/warehouse/pallets/pallets.module';
import { StockModule } from './logistica/warehouse/stock/stock.module';
import { PickingModule } from './logistica/warehouse/picking/picking.module';
import { VehiclesModule } from './logistica/transport/vehicles/vehicles.module';
import { DriversModule } from './logistica/transport/drivers/drivers.module';
import { TripsModule } from './logistica/transport/trips/trips.module';
import { TransfersModule } from './logistica/transport/transfers/transfers.module';
import { DeliveryNotesModule } from './logistica/documents/delivery-notes/delivery-notes.module';
import { FilesModule } from './logistica/media/files/files.module';
import { PhotosModule } from './logistica/media/photos/photos.module';
import { LogisticaModule } from './logistica/logistica.module.js';

@Module({
  imports: [
    // 1. Load the configuration FIRST.
    AppConfigModule,
    SshModule,
    PrismaModule,
    LogisticaPrismaModule,
    // BootstrapModule,
    AuthModule,
    TableModule,
    ArticulosModule,
    CategoriasModule,
    DataImportModule,

    LogisticaModule,
  ],
})
export class AppModule {}
