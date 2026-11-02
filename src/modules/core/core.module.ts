import { Module } from '@nestjs/common';
import { CompaniesModule } from './companies/companies.module';
import { PlatformModulesModule } from './platform-modules/platform-modules.module';
@Module({
  imports: [CompaniesModule, PlatformModulesModule],
  exports: [CompaniesModule, PlatformModulesModule],
})
export class CoreModule {}
