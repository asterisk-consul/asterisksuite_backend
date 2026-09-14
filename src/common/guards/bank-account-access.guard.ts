import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Guard que verifica el rol del usuario en una cuenta bancaria específica.
 * Requiere que el usuario tenga un rol asignado en bank_account_user_roles.
 * Adjunta el role al request para uso posterior.
 */
@Injectable()
export class BankAccountAccessGuard implements CanActivate {
  constructor(private db: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const bankAccountId = request.params?.id;

    if (!userId || !bankAccountId) return true;

    const prisma = this.db.getClientForCurrentContext();

    const userRole = await prisma.bank_account_user_roles.findUnique({
      where: {
        bank_account_id_user_id: { bank_account_id: bankAccountId, user_id: userId },
      },
    });

    // OWNER y ADMIN administran todas las cuentas sin asociación individual.
    if (request.companyUserRole === 'OWNER' || request.companyUserRole === 'ADMIN') {
      request.bankAccountRole = userRole?.role ?? 'RESPONSIBLE';
      return true;
    }

    // Los usuarios comunes solo acceden a cuentas asociadas y activas para ellos.
    if (!userRole || userRole.deleted_at) {
      throw new ForbiddenException('No tienes acceso a esta cuenta bancaria');
    }

    // Adjuntar rol al request
    request.bankAccountRole = userRole.role;

    return true;
  }
}
