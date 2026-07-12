import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Guard que verifica el rol del usuario en una caja específica.
 * Requiere que el usuario tenga un rol asignado en cash_box_user_roles.
 * Adjunta el role al request para uso posterior.
 */
@Injectable()
export class CashBoxAccessGuard implements CanActivate {
  constructor(private db: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const cashBoxId = request.params?.id;

    if (!userId || !cashBoxId) return true;

    const prisma = this.db.getClientForCurrentContext();

    const userRole = await prisma.cash_box_user_roles.findUnique({
      where: {
        cash_box_id_user_id: { cash_box_id: cashBoxId, user_id: userId },
      },
    });

    // OWNER del siempre pasa
    if (request.companyUserRole === 'OWNER') {
      request.cashBoxRole = userRole?.role ?? 'VIEWER';
      return true;
    }

    // Sin rol asignado → denegar
    if (!userRole) {
      throw new ForbiddenException('No tienes acceso a esta caja');
    }

    // Adjuntar rol al request
    request.cashBoxRole = userRole.role;

    return true;
  }
}
