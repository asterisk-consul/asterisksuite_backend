import { SetMetadata } from '@nestjs/common';

export const ALLOW_COMPANY_ADMINS_KEY = 'allow_company_admins';

/** Permite OWNER/ADMIN de la empresa además de los permisos RBAC requeridos. */
export const AllowCompanyAdmins = () => SetMetadata(ALLOW_COMPANY_ADMINS_KEY, true);
