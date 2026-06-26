import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class TenantAccessGuard implements CanActivate {
  private readonly logger = new Logger(TenantAccessGuard.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return true;
    }

    const token = authHeader.substring(7);

    let userId: string;
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.getOrThrow<string>('JWT_SECRET'),
      });
      userId = payload.sub;
    } catch {
      return true;
    }

    const tenantHeader =
      (req.headers['x-tenant'] as string) ??
      (req.headers['x-subdomain'] as string);

    if (!tenantHeader) {
      return true;
    }

    const subdomain = tenantHeader.toLowerCase().trim();

    const company = await this.prisma.getDefaultClient().companies.findFirst({
      where: {
        subdomain,
        deleted_at: null,
      },
      select: {
        id: true,
      },
    });

    if (!company) {
      throw new ForbiddenException('Empresa no encontrada');
    }

    const membership =
      await this.prisma.getDefaultClient().company_users.findUnique({
        where: {
          company_id_user_id: {
            company_id: company.id,
            user_id: userId,
          },
        },
      });

    if (!membership) {
      this.logger.warn(
        `User ${userId} denied access to tenant "${subdomain}" (company ${company.id})`,
      );
      throw new ForbiddenException(
        'No tienes acceso a esta empresa',
      );
    }

    return true;
  }
}
