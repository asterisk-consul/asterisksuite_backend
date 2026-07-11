import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PartnersService {
  constructor(private db: PrismaService) {}
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async create(dto: CreatePartnerDto, userId: string) {
    if (dto.user_id && dto.create_user) {
      throw new BadRequestException('No se puede enviar user_id y create_user al mismo tiempo');
    }

    let finalUserId = dto.user_id;

    // Crear usuario en public.users si se solicita
    if (dto.create_user) {
      const publicPrisma = this.db.getDefaultClient();

      const existing = await publicPrisma.users.findUnique({
        where: { email: dto.create_user.email },
      });
      if (existing) {
        throw new BadRequestException('El email ya está registrado');
      }

      const passwordHash = await bcrypt.hash(dto.create_user.password, 10);
      const newUser = await publicPrisma.users.create({
        data: {
          name: dto.create_user.name,
          email: dto.create_user.email,
          password_hash: passwordHash,
          role: dto.create_user.role ?? 'PLATFORM_USER',
        },
      });

      finalUserId = newUser.id;
    }

    // Crear partner
    const partner = await this.prisma.partners.create({
      data: {
        party_id: dto.party_id,
        user_id: finalUserId,
        first_name: dto.first_name,
        last_name: dto.last_name,
        document_type: dto.document_type,
        document_number: dto.document_number,
        share_percentage: dto.share_percentage,
        capital_contributed: dto.capital_contributed,
        is_active: dto.is_active ?? true,
        created_by: userId,
      },
    });

    // Bidireccional: actualizar users.partner_id en public
    if (finalUserId) {
      const publicPrisma = this.db.getDefaultClient();
      await publicPrisma.users.update({
        where: { id: finalUserId },
        data: { partner_id: partner.id },
      });
    }

    return partner;
  }

  async findAll() {
    return this.prisma.partners.findMany({
      where: { deleted_at: null },
      orderBy: { last_name: 'asc' },
      include: { party: { select: { id: true, name: true } } },
    });
  }

  async findOne(id: string) {
    const partner = await this.prisma.partners.findFirst({
      where: { id, deleted_at: null },
      include: { party: true },
    });
    if (!partner) throw new NotFoundException('Socio no encontrado');

    let user = null;
    if (partner.user_id) {
      user = await this.db.getDefaultClient().users.findUnique({
        where: { id: partner.user_id },
        select: { id: true, name: true, email: true, active: true },
      });
    }

    return { ...partner, user };
  }

  async update(id: string, dto: UpdatePartnerDto, userId: string) {
    await this.findOne(id);
    return this.prisma.partners.update({
      where: { id },
      data: {
        ...dto,
        updated_at: new Date(),
        updated_by: userId,
      },
    });
  }

  /**
   * Vincular partner con user existente
   */
  async linkUser(id: string, userId: string) {
    const partner = await this.findOne(id);

    const publicPrisma = this.db.getDefaultClient();
    const user = await publicPrisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Si el partner ya tiene un user vinculado, desvincularlo primero
    if (partner.user_id && partner.user_id !== userId) {
      await publicPrisma.users.update({
        where: { id: partner.user_id },
        data: { partner_id: null },
      });
    }

    await this.prisma.partners.update({
      where: { id },
      data: { user_id: userId },
    });

    await publicPrisma.users.update({
      where: { id: userId },
      data: { partner_id: id },
    });

    return { message: 'Socio vinculado al usuario', partner_id: id, user_id: userId };
  }

  /**
   * Desvincular partner de su user
   */
  async unlinkUser(id: string) {
    const partner = await this.findOne(id);
    if (!partner.user_id) {
      return { message: 'El socio no tiene usuario vinculado' };
    }

    const publicPrisma = this.db.getDefaultClient();

    await this.prisma.partners.update({
      where: { id },
      data: { user_id: null },
    });

    await publicPrisma.users.update({
      where: { id: partner.user_id },
      data: { partner_id: null },
    });

    return { message: 'Socio desvinculado del usuario', partner_id: id };
  }

  async remove(id: string, userId: string) {
    await this.findOne(id);
    return this.prisma.partners.update({
      where: { id },
      data: { deleted_at: new Date(), deleted_by: userId, is_active: false },
    });
  }
}
