import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { FiscalValidationService } from './services/fiscal-validation.service';

@Module({
  imports: [PrismaModule],
  providers: [FiscalValidationService],
  exports: [FiscalValidationService],
})
export class CommonErpModule {}
