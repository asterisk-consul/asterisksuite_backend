import { Module } from '@nestjs/common';
import { SalesController } from './sales_reports.controller';
import { SalesService } from './sales_reports.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService],
})
export class SalesReportModule {}
