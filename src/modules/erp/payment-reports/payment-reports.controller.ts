import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { PaymentReportsService } from './payment-reports.service';
import { QueryPaymentReportDto } from './dto/query-payment-report.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/payment-reports')
export class PaymentReportsController {
  constructor(private readonly reportsService: PaymentReportsService) {}

  @Get('by-user')
  findByUser(@Query() dto: QueryPaymentReportDto) {
    return this.reportsService.findByUser(dto);
  }

  @Get('cash-box-daily')
  cashBoxDaily(@Query() dto: QueryPaymentReportDto) {
    return this.reportsService.cashBoxDaily(dto);
  }

  @Get('bank-daily')
  bankDaily(@Query() dto: QueryPaymentReportDto) {
    return this.reportsService.bankDaily(dto);
  }

  @Get('daily-summary')
  dailySummary(@Query() dto: QueryPaymentReportDto) {
    return this.reportsService.dailySummary(dto);
  }
}
