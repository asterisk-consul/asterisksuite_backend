import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';

import { RolesService } from '../services/roles.service';
import { PermissionContextBuilder } from '../authorization/permission-context.builder';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user.interface';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control/users')
export class UsersController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly contextBuilder: PermissionContextBuilder,
  ) {}

  @Get(':userId/roles')
  @RequirePermissions('users.read_roles')
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(userId);
  }

  @Put(':userId/roles')
  @RequirePermissions('users.assign_roles')
  async assignRolesToUser(@Param('userId') userId: string, @Body() body: { roleIds: string[] }) {
    return this.rolesService.assignRoles(userId, body.roleIds);
  }

  @Get(':userId/permissions')
  @RequirePermissions('users.read_permissions')
  async getEffectivePermissions(@Param('userId') userId: string) {
    const context = await this.contextBuilder.build(userId);

    return {
      userId,
      roles: context.roles,
      permissions: Array.from(context.permissions),
      overrides: Array.from(context.overrides.entries()),
    };
  }

  @Get('me/permissions')
  async myPermissions(@CurrentUser() user: AuthUser) {
    const context = await this.contextBuilder.build(user.id);

    return {
      userId: user.id,
      roles: context.roles,
      permissions: Array.from(context.permissions),
      overrides: Array.from(context.overrides.entries()),
    };
  }
}
