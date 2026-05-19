import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { EngineeringController } from './engineering.controller';
import { EngineeringService } from './engineering.service';
import { EngineeringTreeService } from './engineering-tree.service';
import { EngineeringCalculationService } from './engineering-calculation.service';
import { EngineeringValidationService } from './engineering-validation.service';

@Module({
  imports: [PrismaModule],
  controllers: [EngineeringController],
  providers: [
    EngineeringService,
    EngineeringTreeService,
    EngineeringCalculationService,
    EngineeringValidationService,
  ],
  exports: [EngineeringService],
})
export class EngineeringModule {}
