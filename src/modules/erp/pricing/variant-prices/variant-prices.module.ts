import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { AuditModule } from '../../audit/audit.module';
import { VariantPricesController } from './variant-prices.controller';
import { VariantPricesService } from './variant-prices.service';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [VariantPricesController],
  providers: [VariantPricesService],
  exports: [VariantPricesService],
})
export class VariantPricesModule {}
