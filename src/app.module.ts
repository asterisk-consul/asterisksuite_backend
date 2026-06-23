// src/app.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DataImportModule } from './data-import/data-import.module';
import { ModulesModule } from './modules/modules.module';
import { AccessControlModule } from './access-control/access-control.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    AccessControlModule,
    DataImportModule,
    ModulesModule,
  ],
})
export class AppModule {}
