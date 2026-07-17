import { Controller, Get, Param, Put, Body, Query, UseGuards } from '@nestjs/common';

import { RolesService } from '../services/roles.service';
import { PermissionContextBuilder } from '../authorization/permission-context.builder';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control/users')
export class UsersController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly contextBuilder: PermissionContextBuilder,
    private readonly prisma: PrismaService,
  ) {}

  private async getCompanyUserIds(): Promise<string[]> {
    const companyId = getCurrentCompanyId();
    if (!companyId) return [];
    const members = await this.prisma.getDefaultClient().company_users.findMany({
      where: { company_id: companyId },
      select: { user_id: true },
    });
    return members.map(m => m.user_id);
  }

  @Get('batch')
  @UseGuards(JwtAuthGuard)
  async findByIds(@Query('ids') idsParam: string) {
    const ids = idsParam.split(',').filter(Boolean);
    if (ids.length === 0) return [];
    const companyUserIds = await this.getCompanyUserIds();
    const validIds = ids.filter(id => companyUserIds.includes(id));
    const users = await this.prisma.getDefaultClient().users.findMany({
      where: { id: { in: validIds } },
      select: { id: true, name: true, email: true },
    });
    return users;
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('q') query: string) {
    const q = query?.trim();
    if (!q || q.length < 2) return [];
    const companyUserIds = await this.getCompanyUserIds();
    if (companyUserIds.length === 0) return [];
    const users = await this.prisma.getDefaultClient().users.findMany({
      where: {
        id: { in: companyUserIds },
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, email: true },
      take: 20,
    });
    return users;
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAllUsers() {
    const companyUserIds = await this.getCompanyUserIds();
    if (companyUserIds.length === 0) return [];
    const users = await this.prisma.getDefaultClient().users.findMany({
      where: { id: { in: companyUserIds } },
      select: { id: true, name: true, email: true },
      take: 100,
    });
    return users;
  }

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
