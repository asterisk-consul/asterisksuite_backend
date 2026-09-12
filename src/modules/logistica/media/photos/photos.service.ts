import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreatePhotoDto } from './dto/create-photo.dto';

@Injectable()
export class PhotosService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  create(dto: CreatePhotoDto) {
    return this.prisma.entity_photos.create({
      data: dto,
      include: {
        files: true,
      },
    });
  }

  findByEntity(entityType: string, entityId: string) {
    return this.prisma.entity_photos.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: {
        files: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
