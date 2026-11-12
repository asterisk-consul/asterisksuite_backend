import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequireAnyPermission, RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { IntercompanyTreasuryService } from './intercompany-treasury.service';
import { UpdateIntercompanySharesDto } from './dto/update-intercompany-shares.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/treasury/intercompany')
export class IntercompanyTreasuryController {
  constructor(private readonly service: IntercompanyTreasuryService) {}

  @Get('cash-boxes/companies')
  @RequirePermissions('treasury.cash_boxes.update')
  @AllowCompanyAdmins()
  cashBoxCompanies() { return this.service.listCompanies(); }

  @Get('bank-accounts/companies')
  @RequirePermissions('treasury.bank_accounts.update')
  @AllowCompanyAdmins()
  bankAccountCompanies() { return this.service.listCompanies(); }

  @Get('cash-boxes/:id/shares')
  @RequirePermissions('treasury.cash_boxes.update')
  @AllowCompanyAdmins()
  getCashBoxSharing(@Param('id') id: string) { return this.service.getSharing('CASH_BOX', id); }

  @Post('cash-boxes/:id/shares')
  @RequirePermissions('treasury.cash_boxes.update')
  @AllowCompanyAdmins()
  updateCashBoxSharing(@Param('id') id: string, @Body() body: UpdateIntercompanySharesDto, @CurrentUser() user: AuthUser) {
    return this.service.updateSharing('CASH_BOX', id, body, user.id);
  }

  @Get('bank-accounts/:id/shares')
  @RequirePermissions('treasury.bank_accounts.update')
  @AllowCompanyAdmins()
  getBankAccountSharing(@Param('id') id: string) { return this.service.getSharing('BANK_ACCOUNT', id); }

  @Post('bank-accounts/:id/shares')
  @RequirePermissions('treasury.bank_accounts.update')
  @AllowCompanyAdmins()
  updateBankAccountSharing(@Param('id') id: string, @Body() body: UpdateIntercompanySharesDto, @CurrentUser() user: AuthUser) {
    return this.service.updateSharing('BANK_ACCOUNT', id, body, user.id);
  }

  @Get('available/payments')
  @RequireAnyPermission('payments.create', 'payments.update', 'payments.read')
  paymentFunds(@Query('use') use: 'PAYMENT' | 'COLLECTION', @Query('currency_code') currency?: string) {
    return this.service.listAvailable(use === 'COLLECTION' ? 'COLLECTION' : 'PAYMENT', currency?.toUpperCase());
  }

  @Get('available/hr')
  @RequirePermissions('vales.create')
  hrFunds(@Query('currency_code') currency?: string) {
    return this.service.listAvailable('HR', currency?.toUpperCase());
  }
}
