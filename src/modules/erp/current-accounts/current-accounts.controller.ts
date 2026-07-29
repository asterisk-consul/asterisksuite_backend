import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CurrentAccountsService } from './current-accounts.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/current-accounts')
export class CurrentAccountsController {
  constructor(private readonly currentAccountsService: CurrentAccountsService) {}

  @Post('entries')
  // @RequirePermissions('treasury.current_accounts.create')
  addEntry(@Body() dto: CreateCurrentAccountEntryDto, @CurrentUser() user: AuthUser) {
    return this.currentAccountsService.addEntry(dto, user.id);
  }

  @Get('party/:partyId')
  // @RequirePermissions('treasury.current_accounts.read')
  findByParty(@Param('partyId') partyId: string) {
    return this.currentAccountsService.findByParty(partyId);
  }

  @Get('party/:partyId/entries')
  // @RequirePermissions('treasury.current_accounts.read')
  getEntries(
    @Param('partyId') partyId: string,
    @Query('currency_code') currencyCode?: string,
  ) {
    return this.currentAccountsService.getEntries(partyId, currencyCode);
  }

  @Get('party/:partyId/statement')
  // @RequirePermissions('treasury.current_accounts.read')
  getStatement(
    @Param('partyId') partyId: string,
    @Query('currency_code') currencyCode: string,
  ) {
    return this.currentAccountsService.getStatement(partyId, currencyCode);
  }

  @Get('party/:partyId/balance')
  // @RequirePermissions('treasury.current_accounts.read')
  getBalance(
    @Param('partyId') partyId: string,
    @Query('currency_code') currencyCode: string,
  ) {
    return this.currentAccountsService.getBalance(partyId, currencyCode);
  }

  @Get('active')
  // @RequirePermissions('treasury.current_accounts.read')
  findActive() {
    return this.currentAccountsService.findActive();
  }

  @Get()
  // @RequirePermissions('treasury.current_accounts.read')
  findAll(
    @Query('party_type') partyType?: string,
    @Query('currency_code') currencyCode?: string,
    @Query('balance_filter') balanceFilter?: string,
  ) {
    return this.currentAccountsService.findAll({
      party_type: partyType,
      currency_code: currencyCode,
      balance_filter: balanceFilter,
    });
  }
}
