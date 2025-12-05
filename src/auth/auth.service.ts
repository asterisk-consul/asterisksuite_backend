import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  /**
   * Remueve el prefijo "{bcrypt}" si existe
   */
  private normalizeHash(hash: string): string {
    if (hash.startsWith('{bcrypt}')) {
      return hash.replace('{bcrypt}', '');
    }
    return hash;
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.usuarios.findFirst({
      where: { username },
    });

    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    // Normalizar hash antes de comparar
    const storedHash = this.normalizeHash(user.password);

    const valid = await bcrypt.compare(password, storedHash);

    if (!valid) throw new UnauthorizedException('Credenciales incorrectas');

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    console.log(user);

    const payload = {
      sub: user.id.toString(), // convertir BigInt a string
      username: user.username,
    };

    const token = this.jwt.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id.toString(),
        perfilid: user.perfilid?.toString(),
        username: user.username,
      },
    };
  }

  async register(data: { username: string; password: string }) {
    // Hash normal con bcrypt
    const rawHashed = await bcrypt.hash(data.password, 10);

    // Agregar prefijo requerido por el backend Java
    const hashedWithPrefix = `{bcrypt}${rawHashed}`;

    const user = await this.prisma.usuarios.create({
      data: {
        username: data.username,
        password: hashedWithPrefix,
      },
    });

    return user;
  }
}
