import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

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
