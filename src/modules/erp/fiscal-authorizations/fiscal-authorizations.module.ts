import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { FiscalAuthorizationsController } from './fiscal-authorizations.controller';
import { FiscalAuthorizationsService } from './fiscal-authorizations.service';
import { FiscalAuthorizationsScheduler } from './fiscal-authorizations.scheduler';

@Module({
  imports: [PrismaModule],
  controllers: [FiscalAuthorizationsController],
  providers: [FiscalAuthorizationsService, FiscalAuthorizationsScheduler],
  exports: [FiscalAuthorizationsService],
})
export class FiscalAuthorizationsModule {}
