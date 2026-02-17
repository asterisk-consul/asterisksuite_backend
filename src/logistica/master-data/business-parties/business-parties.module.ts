import { Module } from '@nestjs/common';
import { BusinessPartiesService } from './business-parties.service';
import { BusinessPartiesController } from './business-parties.controller';

@Module({
  controllers: [BusinessPartiesController],
  providers: [BusinessPartiesService],
})
export class BusinessPartiesModule {}
