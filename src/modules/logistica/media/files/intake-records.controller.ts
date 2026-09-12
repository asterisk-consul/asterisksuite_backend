import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PermissionsGuard } from '@/access-control/guards/permissions.guard';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { IntakeRecordsService } from './intake-records.service';

@Controller('intake-records')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class IntakeRecordsController {
  constructor(private service: IntakeRecordsService) {}

  @Post() @RequirePermissions('intake.create') create(@Body() body: any, @CurrentUser() user: AuthUser) { return this.service.create(body, user.id); }
  @Get() @RequirePermissions('intake.read') findAll(@CurrentUser() user: AuthUser, @Query('scope') scope?: string) { return this.service.findAll(user.id, scope); }
  @Get(':id') @RequirePermissions('intake.read') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Patch(':id') @RequirePermissions('intake.create') update(@Param('id') id: string, @Body() body: any, @CurrentUser() user: AuthUser) { return this.service.update(id, body, user.id); }
  @Post(':id/send') @RequirePermissions('intake.send') send(@Param('id') id: string, @Body('assigned_to') assignedTo: string, @CurrentUser() user: AuthUser) { return this.service.send(id, assignedTo, user.id); }
  @Post(':id/start') @RequirePermissions('intake.process') start(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.start(id, user.id); }
  @Post(':id/complete') @RequirePermissions('intake.process') complete(@Param('id') id: string, @Body() body: any, @CurrentUser() user: AuthUser) { return this.service.complete(id, body, user.id); }
  @Delete(':id') @RequirePermissions('intake.delete') remove(@Param('id') id: string, @CurrentUser() user: AuthUser) { return this.service.remove(id, user.id); }
}
