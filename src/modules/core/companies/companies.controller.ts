import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AddCompanyUserDto } from './dto/add-company-user.dto';
import { CreateCompanyUserDto } from './dto/create-company-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
// import { RequirePermissions } from 'src/access-control/decorators/require-permissions.decorator';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // @RequirePermissions('companies.create')
  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto, userId);
  }

  // @RequirePermissions('companies.read')
  @Get()
  findAll() {
    return this.companiesService.findAll();
  }

  // @RequirePermissions('companies.read')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  // @RequirePermissions('companies.update')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  // @RequirePermissions('companies.read')
  @Get(':id/users')
  listUsers(@Param('id') companyId: string, @CurrentUser('id') userId: string) {
    return this.companiesService.listUsers(companyId, userId);
  }

  // @RequirePermissions('companies.create')
  @Post(':id/users')
  addUser(
    @Param('id') companyId: string,
    @Body() dto: AddCompanyUserDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.companiesService.addUser(companyId, dto.email, dto.role, userId);
  }

  // @RequirePermissions('companies.create')
  @Post(':id/users/create')
  createUserInCompany(
    @Param('id') companyId: string,
    @Body() dto: CreateCompanyUserDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.companiesService.createUserInCompany(companyId, dto, userId);
  }

  // @RequirePermissions('companies.delete')
  @Delete(':id/users/:userId')
  removeUser(
    @Param('id') companyId: string,
    @Param('userId') userIdToRemove: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.companiesService.removeUser(companyId, userIdToRemove, userId);
  }

  // @RequirePermissions('companies.delete')
  @Delete(':id')
  deactivate() {
    return this.companiesService.deactivate();
  }
}
