import { Module } from '@nestjs/common';
import { CompaniesModule } from './core/companies/companies.module';
@Module({
  imports: [CompaniesModule],
})
export class LogisticaModule {}
