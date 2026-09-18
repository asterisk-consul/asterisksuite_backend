import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';
import { PaymentReportsController } from './payment-reports.controller';
import { PaymentReportsService } from './payment-reports.service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentReportsController],
  providers: [PaymentReportsService],
  exports: [PaymentReportsService],
})
export class PaymentReportsModule {}
