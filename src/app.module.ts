// src/app.module.ts
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DataImportModule } from './data-import/data-import.module';
import { ModulesModule } from './modules/modules.module';
import { AccessControlModule } from './access-control/access-control.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { TenantAccessGuard } from './common/guards/tenant-access.guard';

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
  providers: [
    {
      provide: 'APP_GUARD',
      useClass: TenantAccessGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
