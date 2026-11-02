import { SetMetadata } from '@nestjs/common';

export const SKIP_PLATFORM_MODULE_CHECK = 'skipPlatformModuleCheck';

/** Excluye una ruta técnica del control comercial, no de los permisos RBAC. */
export const SkipPlatformModuleCheck = () => SetMetadata(SKIP_PLATFORM_MODULE_CHECK, true);
