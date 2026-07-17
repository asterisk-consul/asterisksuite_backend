import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import type { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('erp/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  // @RequirePermissions('treasury.payments.create')
  create(@Body() dto: CreatePaymentDto, @CurrentUser() user: AuthUser) {
    return this.paymentsService.create(dto, user.id);
  }

  @Get()
  // @RequirePermissions('treasury.payments.read')
  findAll(
    @Req() req: Request,
    @CurrentUser() user: AuthUser,
    @Query('party_id') partyId?: string,
    @Query('type') type?: string,
    @Query('payment_method') paymentMethod?: string,
    @Query('status') status?: string,
  ) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.paymentsService.findAll({
      party_id: partyId,
      type,
      payment_method: paymentMethod,
      status,
      user_id: companyRole === 'USER' ? user.id : undefined,
    });
  }

  @Get(':id')
  // @RequirePermissions('treasury.payments.read')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  // @RequirePermissions('treasury.payments.update')
  update(@Param('id') id: string, @Body() dto: UpdatePaymentDto, @CurrentUser() user: AuthUser) {
    return this.paymentsService.update(id, dto, user.id);
  }

  @Post(':id/confirm')
  // @RequirePermissions('treasury.payments.confirm')
  confirm(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.confirm(id, user.id);
  }

  @Post(':id/pay')
  // @RequirePermissions('treasury.payments.update')
  markAsPaid(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.markAsPaid(id, user.id);
  }

  @Post(':id/reject')
  // @RequirePermissions('treasury.payments.reverse')
  reject(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.reject(id, user.id);
  }

  @Post(':id/reverse')
  // @RequirePermissions('treasury.payments.reverse')
  reverse(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.reverse(id, user.id);
  }

  @Delete(':id')
  // @RequirePermissions('treasury.payments.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.paymentsService.remove(id, user.id);
  }
}
