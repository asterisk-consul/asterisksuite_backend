import { Module } from '@nestjs/common';
import { LogisticaPrismaModule } from '@/prisma/prisma-logistica.module';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';

@Module({
  imports: [LogisticaPrismaModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
