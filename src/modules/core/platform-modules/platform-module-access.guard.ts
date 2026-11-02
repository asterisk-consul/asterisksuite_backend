import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { requestContext } from '../../../common/context/request-context';
import { PlatformModuleAuditService } from './platform-module-audit.service';
import { SKIP_PLATFORM_MODULE_CHECK } from './platform-module.decorators';
import { resolvePlatformModuleForPath } from './platform-module-routes';
import { PlatformModulesService } from './platform-modules.service';

type ModuleMode = 'disabled' | 'audit' | 'enforce';

type AuditedRequest = {
  method: string;
  originalUrl?: string;
  url: string;
  ip?: string;
  tenantUserId?: string;
};

@Injectable()
export class PlatformModuleAccessGuard implements CanActivate {
  private readonly logger = new Logger(PlatformModuleAccessGuard.name);
  private warnedResolutionFailureAt = 0;

  constructor(
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
    private readonly modules: PlatformModulesService,
    private readonly audit: PlatformModuleAuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const mode = this.resolveMode();
    if (mode === 'disabled') return true;
    const skipped = this.reflector.getAllAndOverride<boolean>(SKIP_PLATFORM_MODULE_CHECK, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (skipped) return true;

    const request = context.switchToHttp().getRequest<AuditedRequest>();
    const method = request.method.toUpperCase();
    const path = request.originalUrl || request.url;
    const moduleCode = resolvePlatformModuleForPath(path);
    const companyId = requestContext.getStore()?.companyId;
    if (!moduleCode || !companyId) return true;

    try {
      const module = await this.modules.getModule(companyId, moduleCode);
      // Durante el despliegue puede existir el esquema pero faltar las filas
      // del catálogo. No bloquear módulos históricos por una configuración incompleta.
      if (!module) return true;
      const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(method);
      const incompatible = !module.enabled || (module.readOnly && isWrite);
      if (!incompatible) return true;

      const event = {
        companyId,
        userId: request.tenantUserId ?? null,
        moduleCode,
        state: module.state,
        method,
        path: path.split('?')[0] ?? path,
        ip: request.ip ?? null,
        reason: module.reason ?? 'Módulo no disponible',
        mode,
      } as const;

      if (mode === 'audit') {
        void this.audit.record(event);
        return true;
      }

      await this.audit.record(event);
      const readOnlyViolation = Boolean(module.readOnly && isWrite);
      throw new ForbiddenException({
        statusCode: 403,
        error: 'Forbidden',
        code: readOnlyViolation ? 'MODULE_READ_ONLY' : 'MODULE_NOT_AVAILABLE',
        message: readOnlyViolation
          ? `El módulo ${moduleCode} está disponible únicamente para consulta`
          : `El módulo ${moduleCode} no está incluido para esta empresa`,
        module: moduleCode,
        moduleState: module.state,
        reason: module.reason,
      });
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      // Fail-open durante el despliegue gradual. Una falla en el sistema de
      // licencias no puede detener la operación actual de las empresas.
      const now = Date.now();
      if (now - this.warnedResolutionFailureAt > 60_000) {
        this.warnedResolutionFailureAt = now;
        this.logger.warn(`No se pudieron resolver módulos efectivos: ${String(error)}`);
      }
      return true;
    }
  }

  private resolveMode(): ModuleMode {
    const configured = this.config.get<string>('MODULE_ENFORCEMENT_MODE', 'audit').toLowerCase();
    return configured === 'disabled' || configured === 'enforce' ? configured : 'audit';
  }
}
