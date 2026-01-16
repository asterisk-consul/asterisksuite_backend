import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categorias.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  findAll(filters: { grupo?: string[]; parentid?: number }) {
    return this.prisma.categorias.findMany({
      where: {
        ...(filters.grupo && {
          grupo: { in: filters.grupo },
        }),
        ...(filters.parentid && {
          parentid: filters.parentid,
        }),
      },
      orderBy: { orden: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.categorias.findUnique({
      where: { id: BigInt(id) },
    });
  }

  create(data: CreateCategoriaDto) {
    return this.prisma.categorias.create({ data });
  }

  update(id: number, data: UpdateCategoriaDto) {
    return this.prisma.categorias.update({ where: { id }, data });
  }

  delete(id: number) {
    return this.prisma.categorias.delete({ where: { id } });
  }
}
