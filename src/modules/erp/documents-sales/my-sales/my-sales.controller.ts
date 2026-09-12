import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MySalesService } from './my-sales.service';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('sales/my-sales')
export class MySalesController {
  constructor(private readonly service: MySalesService) {}

  @Get('summary')
  getSummary(@Query('period') period?: string) {
    return this.service.getSummary(period);
  }

  @Get('orders')
  getOrders(
    @Query('period') period?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.service.getOrders(period, page ? parseInt(page) : 1, pageSize ? parseInt(pageSize) : 20);
  }

  @Get('pending')
  getPending() {
    return this.service.getPending();
  }

  @Get('by-client')
  getByClient(@Query('period') period?: string) {
    return this.service.getByClient(period);
  }

  @Get('analysis')
  getAnalysis() {
    return this.service.getAnalysis();
  }
}
