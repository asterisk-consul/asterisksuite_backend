import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '@/prisma/prisma.service';

import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateTagDto) {
    const existing = await this.prisma.tags.findUnique({
      where: {
        name: data.name,
      },
    });

    if (existing) {
      throw new ConflictException('Ya existe un tag con ese nombre');
    }

    return this.prisma.tags.create({
      data: {
        name: data.name.trim(),
        active: data.active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.tags.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tags.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag no encontrado');
    }

    return tag;
  }

  async update(id: string, data: UpdateTagDto) {
    await this.findOne(id);

    if (data.name) {
      const existing = await this.prisma.tags.findFirst({
        where: {
          name: data.name,
          NOT: { id },
        },
      });

      if (existing) {
        throw new ConflictException('Ya existe otro tag con ese nombre');
      }
    }

    return this.prisma.tags.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.tags.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        active: false,
      },
    });
  }
}
