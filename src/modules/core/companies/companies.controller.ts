import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AddCompanyUserDto } from './dto/add-company-user.dto';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UpdateCompanyUserDto, ChangeUserPasswordDto } from './dto/update-company-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('check-subdomain')
  checkSubdomain(@Query('subdomain') subdomain: string) {
    return this.companiesService.checkSubdomain(subdomain);
  }

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto, userId);
  }

  @RequirePermissions('companies.read')
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  @RequirePermissions('companies.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @RequirePermissions('companies.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @RequirePermissions('companies.read')
  @Get(':id/users')
  listUsers(@Param('id') companyId: string, @CurrentUser('id') userId: string) {
    return this.companiesService.listUsers(companyId, userId);
  }

  @RequirePermissions('companies.create')
  @Post(':id/users')
  addUser(
    @Param('id') companyId: string,
    @Body() dto: AddCompanyUserDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.companiesService.addUser(companyId, dto.email, dto.role, userId);
  }

  @RequirePermissions('companies.create')
  @Post(':id/users/create')
  createUserInCompany(
    @Param('id') companyId: string,
    @Body() dto: CreateCompanyUserDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.companiesService.createUserInCompany(companyId, dto, userId);
  }

  @RequirePermissions('companies.update')
  @Patch(':id/users/:userId')
  updateUser(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
    @Body() dto: UpdateCompanyUserDto,
    @CurrentUser('id') requestUserId: string,
  ) {
    return this.companiesService.updateUser(companyId, userId, dto, requestUserId);
  }

  @RequirePermissions('companies.update')
  @Patch(':id/users/:userId/password')
  changeUserPassword(
    @Param('id') companyId: string,
    @Param('userId') userId: string,
    @Body() dto: ChangeUserPasswordDto,
    @CurrentUser('id') requestUserId: string,
  ) {
    return this.companiesService.changeUserPassword(companyId, userId, dto.newPassword, requestUserId);
  }

  @RequirePermissions('companies.delete')
  @Delete(':id/users/:userId')
  removeUser(
    @Param('id') companyId: string,
    @Param('userId') userIdToRemove: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.companiesService.removeUser(companyId, userIdToRemove, userId);
  }

  @RequirePermissions('companies.delete')
  @Delete(':id')
  deactivate() {
    return this.companiesService.deactivate();
  }
}
