import { Controller, Get, Post, Param, Put, Body, Query, UseGuards, BadRequestException } from '@nestjs/common';

import { RolesService } from '../services/roles.service';
import { PermissionContextBuilder } from '../authorization/permission-context.builder';

import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { RequirePermissions } from '../decorators/require-permissions.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthUser } from 'src/auth/types/auth-user.interface';
import { PrismaService } from '@/prisma/prisma.service';
import { getCurrentCompanyId } from '@/common/context/request-context.helpers';
import * as bcrypt from 'bcrypt';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('access-control/users')
export class UsersController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly contextBuilder: PermissionContextBuilder,
    private readonly prisma: PrismaService,
  ) {}

  private async getCompanyUserIds(): Promise<string[]> {
    const companyId = getCurrentCompanyId();
    if (!companyId) return [];
    const members = await this.prisma.getDefaultClient().company_users.findMany({
      where: { company_id: companyId },
      select: { user_id: true },
    });
    return members.map(m => m.user_id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() body: {
    name: string
    email: string
    password: string
    role?: string
    link_employee_id?: string
    link_partner_id?: string
    create_employee?: {
      first_name: string
      last_name: string
      document_type?: string
      document_number?: string
      position?: string
      department?: string
    }
    create_partner?: {
      first_name: string
      last_name: string
      document_type?: string
      document_number?: string
      share_percentage?: string
    }
  }) {
    if (!body.name || !body.email || !body.password) {
      throw new BadRequestException('name, email y password son requeridos');
    }

    if (body.password.length < 6) {
      throw new BadRequestException('La contraseña debe tener al menos 6 caracteres');
    }

    if (body.link_employee_id && body.link_partner_id) {
      throw new BadRequestException('No se puede vincular a un empleado y un socio al mismo tiempo');
    }

    const publicPrisma = this.prisma.getDefaultClient();
    const tenantPrisma = this.prisma.getClientForCurrentContext();

    // Verificar que el email no esté registrado
    const existing = await publicPrisma.users.findUnique({
      where: { email: body.email },
    });
    if (existing) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Crear usuario
    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await publicPrisma.users.create({
      data: {
        name: body.name,
        email: body.email,
        password_hash: passwordHash,
        role: body.role ?? 'PLATFORM_USER',
      },
      select: { id: true, name: true, email: true, role: true, active: true },
    });

    // Vincular a empleado existente
    if (body.link_employee_id) {
      const employee = await tenantPrisma.employees.findUnique({
        where: { id: body.link_employee_id },
      });
      if (!employee) throw new BadRequestException('Empleado no encontrado');

      await tenantPrisma.employees.update({
        where: { id: body.link_employee_id },
        data: { user_id: user.id },
      });

      await publicPrisma.users.update({
        where: { id: user.id },
        data: { employee_id: body.link_employee_id },
      });
    }

    // Vincular a socio existente
    if (body.link_partner_id) {
      const partner = await tenantPrisma.partners.findUnique({
        where: { id: body.link_partner_id },
      });
      if (!partner) throw new BadRequestException('Socio no encontrado');

      await tenantPrisma.partners.update({
        where: { id: body.link_partner_id },
        data: { user_id: user.id },
      });

      await publicPrisma.users.update({
        where: { id: user.id },
        data: { partner_id: body.link_partner_id },
      });
    }

    // Crear nuevo empleado y vincular
    if (body.create_employee) {
      // Auto-crear business_party
      const party = await tenantPrisma.business_parties.create({
        data: {
          type: 'EMPLOYEE',
          name: `${body.create_employee.first_name} ${body.create_employee.last_name}`,
          active: true,
        },
      });

      const employee = await tenantPrisma.employees.create({
        data: {
          party_id: party.id,
          user_id: user.id,
          first_name: body.create_employee.first_name,
          last_name: body.create_employee.last_name,
          document_type: body.create_employee.document_type,
          document_number: body.create_employee.document_number,
          position: body.create_employee.position,
          department: body.create_employee.department,
          is_active: true,
        },
      });

      await publicPrisma.users.update({
        where: { id: user.id },
        data: { employee_id: employee.id },
      });
    }

    // Crear nuevo socio y vincular
    if (body.create_partner) {
      // Auto-crear business_party
      const party = await tenantPrisma.business_parties.create({
        data: {
          type: 'PARTNER',
          name: `${body.create_partner.first_name} ${body.create_partner.last_name}`,
          active: true,
        },
      });

      const partner = await tenantPrisma.partners.create({
        data: {
          party_id: party.id,
          user_id: user.id,
          first_name: body.create_partner.first_name,
          last_name: body.create_partner.last_name,
          document_type: body.create_partner.document_type,
          document_number: body.create_partner.document_number,
          share_percentage: body.create_partner.share_percentage,
          is_active: true,
        },
      });

      await publicPrisma.users.update({
        where: { id: user.id },
        data: { partner_id: partner.id },
      });
    }

    return user;
  }

  @Get('batch')
  @UseGuards(JwtAuthGuard)
  async findByIds(@Query('ids') idsParam: string) {
    const ids = idsParam.split(',').filter(Boolean);
    if (ids.length === 0) return [];
    const companyUserIds = await this.getCompanyUserIds();
    const validIds = ids.filter(id => companyUserIds.includes(id));
    const users = await this.prisma.getDefaultClient().users.findMany({
      where: { id: { in: validIds } },
      select: { id: true, name: true, email: true },
    });
    return users;
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('q') query: string) {
    const q = query?.trim();
    if (!q || q.length < 2) return [];
    const companyUserIds = await this.getCompanyUserIds();
    if (companyUserIds.length === 0) return [];
    const users = await this.prisma.getDefaultClient().users.findMany({
      where: {
        id: { in: companyUserIds },
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true, email: true },
      take: 20,
    });
    return users;
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAllUsers() {
    const companyUserIds = await this.getCompanyUserIds();
    if (companyUserIds.length === 0) return [];
    const users = await this.prisma.getDefaultClient().users.findMany({
      where: { id: { in: companyUserIds } },
      select: { id: true, name: true, email: true },
      take: 100,
    });
    return users;
  }

  @Get(':userId/roles')
  @RequirePermissions('users.read_roles')
  async getUserRoles(@Param('userId') userId: string) {
    return this.rolesService.getUserRoles(userId);
  }

  @Put(':userId/roles')
  @RequirePermissions('users.assign_roles')
  async assignRolesToUser(@Param('userId') userId: string, @Body() body: { roleIds: string[] }) {
    return this.rolesService.assignRoles(userId, body.roleIds);
  }

  @Get(':userId/permissions')
  @RequirePermissions('users.read_permissions')
  async getEffectivePermissions(@Param('userId') userId: string) {
    const context = await this.contextBuilder.build(userId);

    return {
      userId,
      roles: context.roles,
      permissions: Array.from(context.permissions),
      overrides: Array.from(context.overrides.entries()),
    };
  }

  @Get('me/permissions')
  async myPermissions(@CurrentUser() user: AuthUser) {
    const context = await this.contextBuilder.build(user.id);

    return {
      userId: user.id,
      roles: context.roles,
      permissions: Array.from(context.permissions),
      overrides: Array.from(context.overrides.entries()),
    };
  }
}
