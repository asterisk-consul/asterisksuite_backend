import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { PaymentReportsController } from './payment-reports.controller';
import { PaymentReportsService } from './payment-reports.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentReportsController],
  providers: [PaymentReportsService, PrismaService],
  exports: [PaymentReportsService],
})
export class PaymentReportsModule {}
