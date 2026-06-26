import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PermissionContextBuilder } from '../authorization/permission-context.builder';
import { REQUIRE_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';
import { AuthUser } from '@/auth/types/auth-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly contextBuilder: PermissionContextBuilder,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // console.log('\n==============================');
    // console.log('PermissionsGuard START');

    const request = context.switchToHttp().getRequest();

    // console.log('URL:', request.url);
    // console.log('METHOD:', request.method);
    // console.log('HEADERS AUTH:', request.headers?.authorization);
    // console.log('REQUEST USER:', request.user);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(REQUIRE_PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // console.log('REQUIRED PERMISSIONS:', requiredPermissions);

    // Si no hay permisos requeridos, deja pasar
    if (!requiredPermissions || requiredPermissions.length === 0) {
      // console.log('No permissions required -> ALLOW');
      return true;
    }

    const user: AuthUser = request.user;

    // console.log('USER PARSED:', user);

    if (!user) {
      // console.log('USER IS UNDEFINED -> JwtAuthGuard issue');
      throw new UnauthorizedException('Usuario no autenticado');
    }

    if (!user.id) {
      // console.log('USER HAS NO ID');
      throw new UnauthorizedException('Usuario inválido');
    }

    // OWNER bypass
    if (request.companyUserRole === 'OWNER') {
      // console.log('OWNER BYPASS -> ALLOW');
      return true;
    }

    // Build permission context
    // console.log('Building permission context for userId:', user.id);

    let permissionContext;
    try {
      permissionContext = await this.contextBuilder.build(user.id);
    } catch (error) {
      // console.error('ERROR building permission context:', error);
      throw error;
    }

    // console.log('Permission context built');

    // Evaluate permissions
    const hasAllPermissions = requiredPermissions.every((permission) => permissionContext.can(permission));

    // console.log('HAS ALL PERMISSIONS:', hasAllPermissions);

    if (!hasAllPermissions) {
      // console.log('FORBIDDEN -> missing permissions');
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    // console.log('ALLOW REQUEST');
    // console.log('==============================\n');

    return true;
  }
}
