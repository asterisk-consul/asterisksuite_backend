import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import type { AuthUser } from './types/auth-user.interface';

import { Prisma } from '@/generated/prisma/client';

type RefreshTokenWithUser = Prisma.refresh_tokensGetPayload<{
  include: { users: true };
}>;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private async generateTokens(user: AuthUser) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');

    await this.prisma.refresh_tokens.create({
      data: {
        user_id: user.id,
        token_hash: this.hashToken(refreshToken),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // 🔎 Sanitizar usuario
    const safeUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    };

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  }

  // =========================
  // REGISTER
  // =========================
  async register(dto: RegisterDto) {
    const existing = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new BadRequestException('Email ya registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.users.create({
      data: {
        name: dto.name,
        email: dto.email,
        password_hash: passwordHash,
        role: dto.role ?? 'user',
        company_id: dto.companyId ?? null,
      },
    });

    return this.generateTokens({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.company_id,
    });
  }

  // =========================
  // LOGIN
  // =========================
  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException();

    return this.generateTokens({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: user.company_id,
    });
  }

  // =========================
  // REFRESH (ROTATION)
  // =========================
  async refresh(refreshToken: string) {
    const hashed = this.hashToken(refreshToken);
    const now = new Date();

    const GRACE_WINDOW_MS = 60000;

    const stored: RefreshTokenWithUser | null =
      await this.prisma.refresh_tokens.findFirst({
        where: {
          token_hash: hashed,
          expires_at: { gt: now },
          OR: [
            { revoked: false },
            {
              revoked: true,
              revoked_at: {
                gte: new Date(now.getTime() - GRACE_WINDOW_MS),
              },
            },
          ],
        },
        include: { users: true },
      });

    if (!stored) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!stored.revoked) {
      await this.prisma.refresh_tokens.update({
        where: { id: stored.id },
        data: {
          revoked: true,
          revoked_at: now,
        },
      });
    }

    const user: AuthUser = {
      id: stored.users.id,
      name: stored.users.name,
      email: stored.users.email,
      role: stored.users.role,
      companyId: stored.users.company_id,
      active: stored.users.active,
    };

    return this.generateTokens(user);
  }

  // =========================
  // LOGOUT
  // =========================
  async logout(refreshToken: string) {
    const hashed = this.hashToken(refreshToken);

    await this.prisma.refresh_tokens.updateMany({
      where: { token_hash: hashed },
      data: { revoked: true },
    });

    return { message: 'Logout exitoso' };
  }

  // =========================
  // LOGOUT ALL DEVICES
  // =========================
  async logoutAll(userId: string) {
    await this.prisma.refresh_tokens.updateMany({
      where: { user_id: userId },
      data: { revoked: true },
    });

    return { message: 'Todas las sesiones cerradas' };
  }

  // =========================
  // CHANGE PASSWORD
  // =========================
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password_hash) {
      throw new UnauthorizedException();
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Password Incorrecto');
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { id: userId },
      data: { password_hash: newHash },
    });

    // 🔐 Revocar TODAS las sesiones por seguridad
    await this.prisma.refresh_tokens.updateMany({
      where: { user_id: userId },
      data: { revoked: true },
    });

    return { message: 'Password actualizado. Todas las sesiones cerradas' };
  }
}
