import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/jwt/jwt-auth.guard';
import {
  CreatePlatformCompanyDto,
  CreatePlatformPlanDto,
  SetCompanyModuleOverrideDto,
  SetCompanySubscriptionDto,
  SetPlatformPlanModulesDto,
  UpdatePlatformPlanDto,
} from './dto/platform-plans.dto';
import { SkipPlatformModuleCheck } from './platform-module.decorators';
import { PlatformPlansService } from './platform-plans.service';

@Controller('platform-admin/modules')
@UseGuards(JwtAuthGuard)
@SkipPlatformModuleCheck()
export class PlatformPlansController {
  constructor(private readonly plans: PlatformPlansService) {}

  @Get('catalog')
  listCatalog(@CurrentUser('id') userId: string) {
    return this.plans.listCatalog(userId);
  }

  @Get('plans')
  listPlans(@CurrentUser('id') userId: string) {
    return this.plans.listPlans(userId);
  }

  @Post('plans')
  createPlan(@CurrentUser('id') userId: string, @Body() dto: CreatePlatformPlanDto) {
    return this.plans.createPlan(userId, dto);
  }

  @Patch('plans/:id')
  updatePlan(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePlatformPlanDto,
  ) {
    return this.plans.updatePlan(userId, id, dto);
  }

  @Put('plans/:id/modules')
  setPlanModules(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: SetPlatformPlanModulesDto,
  ) {
    return this.plans.setPlanModules(userId, id, dto);
  }

  @Get('companies')
  listCompanies(@CurrentUser('id') userId: string) {
    return this.plans.listCompanySubscriptions(userId);
  }

  @Get('companies/owner-account')
  findOwnerAccount(@CurrentUser('id') userId: string, @Query('email') email: string) {
    return this.plans.findOwnerAccount(userId, email);
  }

  @Post('companies')
  createCompany(@CurrentUser('id') userId: string, @Body() dto: CreatePlatformCompanyDto) {
    return this.plans.createCompany(userId, dto);
  }

  @Get('metrics')
  metrics(@CurrentUser('id') userId: string) {
    return this.plans.metrics(userId);
  }

  @Put('companies/:companyId/subscription')
  setCompanySubscription(
    @CurrentUser('id') userId: string,
    @Param('companyId') companyId: string,
    @Body() dto: SetCompanySubscriptionDto,
  ) {
    return this.plans.setCompanySubscription(userId, companyId, dto);
  }

  @Put('companies/:companyId/overrides/:moduleCode')
  setCompanyOverride(
    @CurrentUser('id') userId: string,
    @Param('companyId') companyId: string,
    @Param('moduleCode') moduleCode: string,
    @Body() dto: SetCompanyModuleOverrideDto,
  ) {
    return this.plans.setCompanyOverride(userId, companyId, moduleCode, dto);
  }

  @Delete('companies/:companyId/overrides/:moduleCode')
  removeCompanyOverride(
    @CurrentUser('id') userId: string,
    @Param('companyId') companyId: string,
    @Param('moduleCode') moduleCode: string,
  ) {
    return this.plans.removeCompanyOverride(userId, companyId, moduleCode);
  }
}
