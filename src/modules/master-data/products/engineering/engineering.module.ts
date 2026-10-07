import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductComponentsModule } from '../product-components/product-components.module';

import { EngineeringController } from './engineering.controller';
import { EngineeringService } from './engineering.service';
import { EngineeringTreeService } from './engineering-tree.service';
import { EngineeringCalculationService } from './engineering-calculation.service';
import { EngineeringValidationService } from './engineering-validation.service';
import { ProductStructureVersionService } from './product-structure-version.service';
import { VariantCostsModule } from '../variant-costs/variant-costs.module';

@Module({
  imports: [
    PrismaModule,
    ProductComponentsModule, // ← importar para poder inyectar ProductComponentsService
    VariantCostsModule,
  ],
  controllers: [EngineeringController],
  providers: [
    EngineeringService,
    EngineeringTreeService,
    EngineeringCalculationService,
    ProductStructureVersionService,
    EngineeringValidationService,
  ],
  exports: [EngineeringService, ProductStructureVersionService],
})
export class EngineeringModule {}
