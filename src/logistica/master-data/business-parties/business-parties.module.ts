import { Module } from '@nestjs/common';
import { BusinessPartiesService } from './business-parties.service';
import { BusinessPartiesController } from './business-parties.controller';
import { LogisticaPrismaModule } from '@/prisma/prisma-logistica.module';

@Module({
  imports: [LogisticaPrismaModule],
  controllers: [BusinessPartiesController],
  providers: [BusinessPartiesService],
})
export class BusinessPartiesModule {}
