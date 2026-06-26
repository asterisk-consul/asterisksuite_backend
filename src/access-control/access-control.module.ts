import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { RolesController } from './controllers/roles.controller';
import { PermissionsController } from './controllers/permissions.controller';
import { UsersController } from './controllers/users.controller';
import { RbacTestController } from './controllers/rbac-test.controller';

import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { AuthorizationService } from './services/authorization.service';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionContextBuilder } from './authorization/permission-context.builder';
import { PermissionsGuard } from './guards/permissions.guard';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController, PermissionsController, UsersController, RbacTestController],
  providers: [RolesService, PermissionsService, AuthorizationService, PermissionContextBuilder, PermissionsGuard],
  exports: [AuthorizationService, PermissionContextBuilder],
})
export class AccessControlModule {}
