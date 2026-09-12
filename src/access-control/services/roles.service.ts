import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async findAll() {
    return this.prisma.business_roles.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.business_roles.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async create(dto: CreateRoleDto) {
    const exists = await this.prisma.business_roles.findFirst({
      where: {
        OR: [
          {
            code: dto.code,
          },
          {
            name: dto.name,
          },
        ],
        deleted_at: null,
      },
    });

    if (exists) {
      throw new ConflictException('Ya existe un rol con ese nombre o código.');
    }

    return this.prisma.business_roles.create({
      data: {
        code: dto.code,
        name: dto.name,
        description: dto.description,
        is_system: false,
      },
    });
  }

  async update(id: string, dto: UpdateRoleDto) {
    await this.findOne(id);

    return this.prisma.business_roles.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        active: dto.active,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.business_roles.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }

  async updatePermissions(roleId: string, permissionCodes: string[]) {
    await this.findOne(roleId);

    return this.prisma.$transaction(async (tx) => {
      const permissions = await tx.permissions.findMany({
        where: {
          code: {
            in: permissionCodes,
          },
          active: true,
        },
      });

      await tx.business_role_permissions.deleteMany({
        where: {
          role_id: roleId,
        },
      });

      if (permissions.length) {
        await tx.business_role_permissions.createMany({
          data: permissions.map((permission) => ({
            role_id: roleId,
            permission_id: permission.id,
          })),
        });
      }

      return tx.business_roles.findUnique({
        where: {
          id: roleId,
        },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });
    });
  }

  async assignRoles(userId: string, roleIds: string[]) {
    await this.prisma.business_user_roles.deleteMany({
      where: { user_id: userId },
    });

    if (!roleIds.length) return [];

    await this.prisma.business_user_roles.createMany({
      data: roleIds.map((roleId) => ({
        user_id: userId,
        role_id: roleId,
      })),
    });

    return this.prisma.business_user_roles.findMany({
      where: { user_id: userId },
      include: {
        role: true,
      },
    });
  }

  async getUserRoles(userId: string) {
    return this.prisma.business_user_roles.findMany({
      where: { user_id: userId },
      include: {
        role: true,
      },
    });
  }
}
