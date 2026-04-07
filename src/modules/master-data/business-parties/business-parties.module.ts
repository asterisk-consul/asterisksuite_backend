import { Module } from '@nestjs/common';
import { BusinessPartiesService } from './business-parties.service';
import { BusinessPartiesController } from './business-parties.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BusinessPartiesController],
  providers: [BusinessPartiesService],
})
export class BusinessPartiesModule {}
