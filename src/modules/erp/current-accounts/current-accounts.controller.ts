import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { CurrentAccountsService } from './current-accounts.service';
import { CreateCurrentAccountEntryDto } from './dto/create-current-account-entry.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/current-accounts')
export class CurrentAccountsController {
  constructor(private readonly currentAccountsService: CurrentAccountsService) {}

  @Post('entries')
  addEntry(@Body() dto: CreateCurrentAccountEntryDto, @CurrentUser() user: AuthUser) {
    return this.currentAccountsService.addEntry(dto, user.id);
  }

  @Get('party/:partyId')
  findByParty(@Param('partyId') partyId: string) {
    return this.currentAccountsService.findByParty(partyId);
  }

  @Get('party/:partyId/entries')
  getEntries(
    @Param('partyId') partyId: string,
    @Query('currency_code') currencyCode?: string,
  ) {
    return this.currentAccountsService.getEntries(partyId, currencyCode);
  }

  @Get('party/:partyId/statement')
  getStatement(
    @Param('partyId') partyId: string,
    @Query('currency_code') currencyCode: string,
  ) {
    return this.currentAccountsService.getStatement(partyId, currencyCode);
  }

  @Get('party/:partyId/balance')
  getBalance(
    @Param('partyId') partyId: string,
    @Query('currency_code') currencyCode: string,
  ) {
    return this.currentAccountsService.getBalance(partyId, currencyCode);
  }
}
