import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { PermissionContextBuilder } from '../authorization/permission-context.builder';

import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control/test')
export class RbacTestController {
  constructor(private readonly contextBuilder: PermissionContextBuilder) {}

  @Post('can')
  @RequirePermissions('roles.test')
  async can(
    @Body()
    body: {
      userId: string;
      permission: string;
    },
  ) {
    const context = await this.contextBuilder.build(body.userId);

    const allowed = context.can(body.permission);

    return {
      userId: body.userId,
      permission: body.permission,
      allowed,
      roles: context.roles,
      permissions: Array.from(context.permissions),
      overrides: Array.from(context.overrides.entries()),
    };
  }
}
