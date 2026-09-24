import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import type { Request } from 'express';
import { BankAccountsService } from './bank-accounts.service';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { UpdateBankAccountDto } from './dto/update-bank-account.dto';
import { BankAccountAccessGuard } from '@/common/guards/bank-account-access.guard';
import { DeleteBankAccountDto } from './dto/delete-bank-account.dto';

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
  findAll(@Req() req: Request, @CurrentUser() user: AuthUser) {
    const companyRole = req['companyUserRole'] as string | undefined;
    return this.bankAccountsService.findAll(
      companyRole === 'USER' ? user.id : undefined
    );
  }

  @Get(':id')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.read')
  findOne(@Param('id') id: string) {
    return this.bankAccountsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.update')
  update(@Param('id') id: string, @Body() dto: UpdateBankAccountDto, @CurrentUser() user: AuthUser) {
    return this.bankAccountsService.update(id, dto, user.id);
  }

  @Delete(':id')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.delete')
  remove(@Param('id') id: string, @Body() dto: DeleteBankAccountDto, @CurrentUser() user: AuthUser) {
    return this.bankAccountsService.remove(id, dto, user.id);
  }

  @Get(':id/movements')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.read')
  getMovements(@Param('id') id: string) {
    return this.bankAccountsService.getMovements(id);
  }

  // ═══════════════════════════════════════════
  // USER ROLES
  // ═══════════════════════════════════════════

  @Get(':id/user-roles')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.read')
  getUserRoles(@Param('id') id: string) {
    return this.bankAccountsService.getUserRoles(id);
  }

  @Post(':id/user-roles')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.update')
  addUserRole(
    @Param('id') id: string,
    @Body() body: { user_id: string; role: string },
  ) {
    return this.bankAccountsService.addUserRole(id, body.user_id, body.role);
  }

  @Delete(':id/user-roles/:userId')
  @UseGuards(BankAccountAccessGuard)
  @RequirePermissions('treasury.bank_accounts.update')
  removeUserRole(@Param('id') id: string, @Param('userId') userId: string) {
    return this.bankAccountsService.removeUserRole(id, userId);
  }
}
