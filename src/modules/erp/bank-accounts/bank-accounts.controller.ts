import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  @RequirePermissions('treasury.bank_accounts.create')
  create(@Body() dto: CreateBankAccountDto, @CurrentUser() user: AuthUser) {
    return this.bankAccountsService.create(dto, user.id);
  }

  @Get()
  @RequirePermissions('treasury.bank_accounts.read')
  findAll() {
    return this.bankAccountsService.findAll();
  }

  @Get(':id')
  @RequirePermissions('treasury.bank_accounts.read')
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('treasury.bank_accounts.update')
  update(@Param('id') id: string, @Body() dto: UpdateBankAccountDto, @CurrentUser() user: AuthUser) {
    return this.bankAccountsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @RequirePermissions('treasury.bank_accounts.delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.bankAccountsService.remove(id, user.id);
  }

  @Get(':id/movements')
  @RequirePermissions('treasury.bank_accounts.read')
  getMovements(@Param('id') id: string) {
    return this.bankAccountsService.getMovements(id);
  }
}
