import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: AuthUser) {
    return this.paymentsService.create(dto, user.id);
  }

  @Get()
  findAll(
    @Query('party_id') partyId?: string,
    @Query('type') type?: string,
    @Query('payment_method') paymentMethod?: string,
    @Query('status') status?: number,
  ) {
    return this.paymentsService.findAll({ party_id: partyId, type, payment_method: paymentMethod, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto, @CurrentUser() user: AuthUser) {
    return this.paymentsService.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.remove(id, user.id);
  }

  @Post(':id/reverse')
  reverse(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.reverse(id, user.id);
  }
}
