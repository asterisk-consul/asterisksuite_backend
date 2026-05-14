import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAttributeDto) {
    const exists = await this.prisma.attributes.findUnique({
      where: {
        code: data.code,
      },
    });

    if (exists) {
      throw new ConflictException(
        `Ya existe un atributo con código ${data.code}`,
      );
    }

    return this.prisma.attributes.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.attributes.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const attribute = await this.prisma.attributes.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!attribute) {
      throw new NotFoundException('Atributo no encontrado');
    }

    return attribute;
  }

  async update(id: string, data: UpdateAttributeDto) {
    await this.findOne(id);

    if (data.code) {
      const exists = await this.prisma.attributes.findFirst({
        where: {
          code: data.code,
          NOT: {
            id,
          },
        },
      });

      if (exists) {
        throw new ConflictException(
          `Ya existe un atributo con código ${data.code}`,
        );
      }
    }

    return this.prisma.attributes.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.attributes.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
        active: false,
      },
    });
  }
}
