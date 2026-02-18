import { Injectable } from '@nestjs/common';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private prisma: LogisticaPrismaService) {}

  create(dto: CreateFileDto) {
    return this.prisma.files.create({
      data: dto,
    });
  }

  findById(id: string) {
    return this.prisma.files.findUnique({
      where: { id },
    });
  }

  findAll() {
    return this.prisma.files.findMany({
      orderBy: { created_at: 'desc' },
    });
  }
}
