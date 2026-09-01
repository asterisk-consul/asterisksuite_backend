import { Module } from '@nestjs/common'
import { PrismaModule } from '@/prisma/prisma.module'
import { WithholdingCalculationService } from './withholding-calculation.service'
import { FiscalController } from './fiscal.controller'

@Module({
  imports: [PrismaModule],
  controllers: [FiscalController],
  providers: [WithholdingCalculationService],
  exports: [WithholdingCalculationService],
})
export class FiscalModule {}
