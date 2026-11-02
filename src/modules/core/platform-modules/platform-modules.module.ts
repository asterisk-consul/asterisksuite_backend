import { Global, Module } from '@nestjs/common';
import { CompaniesModule } from '../companies/companies.module';
import { PlatformAdministratorsController } from './platform-administrators.controller';
import { PlatformAdministratorsService } from './platform-administrators.service';
import { PlatformModulesController } from './platform-modules.controller';
import { PlatformPlansController } from './platform-plans.controller';
import { PlatformModuleAccessGuard } from './platform-module-access.guard';
import { PlatformModuleAuditService } from './platform-module-audit.service';
import { PlatformModulesService } from './platform-modules.service';
import { PlatformPlansService } from './platform-plans.service';

@Global()
@Module({
  imports: [CompaniesModule],
  controllers: [PlatformModulesController, PlatformPlansController, PlatformAdministratorsController],
  providers: [
    PlatformModulesService,
    PlatformModuleAuditService,
    PlatformModuleAccessGuard,
    PlatformPlansService,
    PlatformAdministratorsService,
  ],
  exports: [PlatformModulesService, PlatformModuleAccessGuard],
})
export class PlatformModulesModule {}
