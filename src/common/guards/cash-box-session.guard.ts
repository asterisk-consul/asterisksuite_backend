import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

/**
 * Guard que verifica quién abrió la sesión actual.
 * Para escritura (movimientos, cierre): solo quien abrió puede escribir.
 * Para force-close: solo RESPONSIBLE puede forzar.
 * GET es libre.
 */
@Injectable()
export class CashBoxSessionGuard implements CanActivate {
  constructor(private db: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const userId = request.user?.id;
    const cashBoxId = request.params?.id;

    // GET siempre permitido
    if (method === 'GET') return true;

    if (!userId || !cashBoxId) return true;

    const prisma = this.db.getClientForCurrentContext();

    const box = await prisma.cash_boxes.findUnique({
      where: { id: cashBoxId },
      select: { current_session_id: true },
    });

    if (!box?.current_session_id) return true;

    const session = await prisma.cash_box_sessions.findUnique({
      where: { id: box.current_session_id },
      select: { user_id: true, status: true },
    });

    if (!session || session.status !== 'OPEN') return true;

    // OWNER siempre pasa
    if (request.companyUserRole === 'OWNER') return true;

    // Force-close requiere RESPONSIBLE
    const isForceClose = request.route?.path?.includes('force-close');
    if (isForceClose) {
      const userRole = await prisma.cash_box_user_roles.findUnique({
        where: {
          cash_box_id_user_id: { cash_box_id: cashBoxId, user_id: userId },
        },
      });
      if (userRole?.role !== 'RESPONSIBLE') {
        throw new ForbiddenException('Solo el responsable puede forzar el cierre');
      }
      return true;
    }

    // Escritura normal: solo quien abrió la sesión
    if (session.user_id !== userId) {
      throw new ForbiddenException('Solo quien abrió la sesión puede escribir en ella');
    }

    return true;
  }
}
