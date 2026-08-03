import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { validateDocumentNumber } from '@/common/validators/document.validator';
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

    // Validar formato de documento
    validateDocumentNumber(dto.document_type, dto.document_number);

    // Validar duplicados por document_type + document_number
    if (dto.document_type && dto.document_number) {
      const existing = await this.prisma.partners.findFirst({
        where: {
          document_type: dto.document_type,
          document_number: dto.document_number,
          deleted_at: null,
        },
      });
      if (existing) {
        throw new BadRequestException(`Ya existe un socio con ${dto.document_type} ${dto.document_number}`);
      }
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

    // Auto-crear business_party si no se provee party_id
    let partyId = dto.party_id;
    if (partyId) {
      // Validar que el party exista y sea tipo PARTNER
      const party = await this.prisma.business_parties.findFirst({
        where: { id: partyId, deleted_at: null },
      });
      if (!party) {
        throw new NotFoundException('business_party no encontrado');
      }
      if (party.type !== 'PARTNER') {
        throw new BadRequestException(`El business_party tiene tipo "${party.type}", se esperaba "PARTNER"`);
      }
    } else {
      const party = await this.prisma.business_parties.create({
        data: {
          type: 'PARTNER',
          name: dto.business_name || `${dto.first_name} ${dto.last_name}`,
          email: dto.email,
          tax_id: dto.tax_id || dto.document_number,
          document_type: dto.document_type,
          vat_condition: dto.vat_condition,
          exemption_rate: dto.exemption_rate,
          active: dto.is_active ?? true,
          created_by: userId,
          party_locations: dto.locations
            ? { create: dto.locations.map((l) => ({ location_id: l.location_id, label: l.label })) }
            : undefined,
          party_contacts: dto.contacts
            ? { create: dto.contacts.map((c) => ({ first_name: c.first_name, last_name: c.last_name, role: c.role, phone: c.phone, email: c.email })) }
            : undefined,
          party_bank_accounts: dto.bank_accounts
            ? { create: dto.bank_accounts.map((b) => ({ cbu: b.cbu, alias: b.alias, bank_name: b.bank_name, account_type: b.account_type, currency: b.currency, description: b.description, holder_name: b.holder_name, is_default: b.is_default ?? false })) }
            : undefined,
        },
      });
      partyId = party.id;
    }

    // Crear partner
    const partner = await this.prisma.partners.create({
      data: {
        party_id: partyId,
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
      include: {
        party: {
          include: {
            party_locations: { include: { locations: true } },
            party_contacts: true,
            party_bank_accounts: true,
          },
        },
      },
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
    const partner = await this.findOne(id);

    // Validar duplicados si cambia document_type/document_number
    if (dto.document_type && dto.document_number) {
      const existing = await this.prisma.partners.findFirst({
        where: {
          document_type: dto.document_type,
          document_number: dto.document_number,
          deleted_at: null,
          NOT: { id },
        },
      });
      if (existing) {
        throw new BadRequestException(`Ya existe un socio con ${dto.document_type} ${dto.document_number}`);
      }
    }

    // Extraer campos de business_party del DTO
    const { locations, contacts, bank_accounts, business_name, email, tax_id, vat_condition, exemption_rate, ...partnerData } = dto;

    // Actualizar business_party si hay campos relacionados
    if (partner.party_id && (business_name || email || tax_id || vat_condition || exemption_rate !== undefined || locations || contacts || bank_accounts)) {
      const partyUpdateData: Record<string, any> = {};
      if (business_name !== undefined) partyUpdateData.name = business_name;
      if (email !== undefined) partyUpdateData.email = email;
      if (tax_id !== undefined) partyUpdateData.tax_id = tax_id;
      if (vat_condition !== undefined) partyUpdateData.vat_condition = vat_condition;
      if (exemption_rate !== undefined) partyUpdateData.exemption_rate = exemption_rate;

      await this.prisma.business_parties.update({
        where: { id: partner.party_id },
        data: {
          ...partyUpdateData,
          party_locations: locations
            ? { deleteMany: {}, create: locations.map((l) => ({ location_id: l.location_id, label: l.label })) }
            : undefined,
          party_contacts: contacts
            ? { deleteMany: {}, create: contacts.map((c) => ({ first_name: c.first_name, last_name: c.last_name, role: c.role, phone: c.phone, email: c.email })) }
            : undefined,
          party_bank_accounts: bank_accounts
            ? { deleteMany: {}, create: bank_accounts.map((b) => ({ cbu: b.cbu, alias: b.alias, bank_name: b.bank_name, account_type: b.account_type, currency: b.currency, description: b.description, holder_name: b.holder_name, is_default: b.is_default ?? false })) }
            : undefined,
        },
      });
    }

    return this.prisma.partners.update({
      where: { id },
      data: {
        ...partnerData,
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
