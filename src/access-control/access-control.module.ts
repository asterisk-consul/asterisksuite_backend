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
import { DocumentAccessService } from './services/document-access.service';
import { TaxNotificationAudienceService } from './authorization/tax-notification-audience.service';

@Module({
  imports: [PrismaModule],
  controllers: [RolesController, PermissionsController, UsersController, RbacTestController],
  providers: [
    RolesService,
    PermissionsService,
    AuthorizationService,
    PermissionContextBuilder,
    PermissionsGuard,
    DocumentAccessService,
    TaxNotificationAudienceService,
    // { provide: APP_GUARD, useClass: PermissionsGuard },  // ← Usar CombinedGuard en AppModule
  ],
  exports: [AuthorizationService, PermissionContextBuilder, PermissionsGuard, DocumentAccessService, TaxNotificationAudienceService],
})
export class AccessControlModule {}
