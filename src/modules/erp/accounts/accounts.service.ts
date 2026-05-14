import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAccountDto) {
    const existing = await this.prisma.accounts.findUnique({
      where: {
        code: data.code,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Ya existe una cuenta con código ${data.code}`,
      );
    }

    if (data.parent_id) {
      const parent = await this.prisma.accounts.findUnique({
        where: {
          id: data.parent_id,
        },
      });

      if (!parent) {
        throw new NotFoundException('Cuenta padre no encontrada');
      }
    }

    return this.prisma.accounts.create({
      data: {
        ...data,
      },
    });
  }

  async findAll() {
    return this.prisma.accounts.findMany({
      where: {
        deleted_at: null,
      },
      include: {
        parent: true,
        children: true,
      },
      orderBy: [
        {
          code: 'asc',
        },
      ],
    });
  }

  async findOne(id: string) {
    const account = await this.prisma.accounts.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        parent: true,
        children: true,
      },
    });

    if (!account) {
      throw new NotFoundException('Cuenta no encontrada');
    }

    return account;
  }

  async update(id: string, data: UpdateAccountDto) {
    await this.findOne(id);

    if (data.code) {
      const existing = await this.prisma.accounts.findFirst({
        where: {
          code: data.code,
          id: {
            not: id,
          },
        },
      });

      if (existing) {
        throw new BadRequestException(
          `Ya existe una cuenta con código ${data.code}`,
        );
      }
    }

    if (data.parent_id) {
      if (data.parent_id === id) {
        throw new BadRequestException(
          'Una cuenta no puede ser padre de sí misma',
        );
      }

      const parent = await this.prisma.accounts.findUnique({
        where: {
          id: data.parent_id,
        },
      });

      if (!parent) {
        throw new NotFoundException('Cuenta padre no encontrada');
      }
    }

    return this.prisma.accounts.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const children = await this.prisma.accounts.count({
      where: {
        parent_id: id,
        deleted_at: null,
      },
    });

    if (children > 0) {
      throw new BadRequestException(
        'No se puede eliminar una cuenta con subcuentas',
      );
    }

    return this.prisma.accounts.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}
