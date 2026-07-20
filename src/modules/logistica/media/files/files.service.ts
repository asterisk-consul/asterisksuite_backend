import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateFileDto } from './dto/create-file.dto';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

function uuid(): string {
  return crypto.randomUUID();
}

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const ENTITY_CONFIG: Record<string, { maxImages: number; maxWidth: number; subfolder: string }> = {
  product: { maxImages: 5, maxWidth: 1200, subfolder: 'products' },
  company: { maxImages: 1, maxWidth: 800, subfolder: 'companies' },
  document: { maxImages: 3, maxWidth: 1200, subfolder: 'documents' },
  payment: { maxImages: 3, maxWidth: 1200, subfolder: 'payments' },
};

@Injectable()
export class FilesService {
  constructor(private db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

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

  async upload(
    file: Express.Multer.File,
    entityType: string,
    entityId: string,
    photoType?: string,
    userId?: string,
  ) {
    // Validate file
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(`El archivo excede el tamaño máximo de ${MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    if (!ALLOWED_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(`Tipo de archivo no permitido: ${file.mimetype}`);
    }

    const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.document;

    // Check max images per entity
    const existingCount = await this.prisma.entity_photos.count({
      where: {
        entity_type: entityType,
        entity_id: entityId,
        deleted_at: null,
      },
    });

    if (existingCount >= config.maxImages) {
      throw new BadRequestException(
        `Máximo ${config.maxImages} imágenes permitidas para ${entityType}`
      );
    }

    // Create directory
    const subDir = path.join(UPLOAD_DIR, config.subfolder);
    if (!fs.existsSync(subDir)) {
      fs.mkdirSync(subDir, { recursive: true });
    }

    // Create file record first to get the Prisma-generated ID
    const fileData: any = {
      storage_provider: 'local',
      file_path: '', // will update after saving
      public_url: '',
      file_name: file.originalname,
      mime_type: 'image/webp',
      file_size: 0,
    };

    if (userId) {
      fileData.uploaded_by = userId;
    }

    const fileRecord = await this.prisma.files.create({
      data: fileData,
    });

    // Use the Prisma-generated ID as the filename
    const baseName = fileRecord.id;

    // Convert to WebP and create variants
    const fullBuffer = await sharp(file.buffer)
      .resize(config.maxWidth, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const mediumBuffer = await sharp(file.buffer)
      .resize(600, null, { withoutEnlargement: true })
      .webp({ quality: 75 })
      .toBuffer();

    const thumbBuffer = await sharp(file.buffer)
      .resize(200, null, { withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();

    // Save files
    const fullPath = path.join(subDir, `${baseName}_full.webp`);
    const mediumPath = path.join(subDir, `${baseName}_medium.webp`);
    const thumbPath = path.join(subDir, `${baseName}_thumb.webp`);

    fs.writeFileSync(fullPath, fullBuffer);
    fs.writeFileSync(mediumPath, mediumBuffer);
    fs.writeFileSync(thumbPath, thumbBuffer);

    // Update file record with correct path
    await this.prisma.files.update({
      where: { id: fileRecord.id },
      data: {
        file_path: fullPath,
        public_url: `/api/media/files/${fileRecord.id}/download`,
        file_size: fullBuffer.length,
      },
    });

    // Create entity_photo record
    const photoData: any = {
      entity_type: entityType,
      entity_id: entityId,
      file_id: fileRecord.id,
      photo_type: photoType || 'default',
    };

    if (userId) {
      photoData.created_by = userId;
    }

    const photo = await this.prisma.entity_photos.create({
      data: photoData,
    });

    return {
      id: fileRecord.id,
      photo_id: photo.id,
      file_uuid: fileRecord.id,
      url: `/uploads/${config.subfolder}/${baseName}_full.webp`,
      thumb_url: `/uploads/${config.subfolder}/${baseName}_thumb.webp`,
      medium_url: `/uploads/${config.subfolder}/${baseName}_medium.webp`,
      file_name: file.originalname,
      file_size: fullBuffer.length,
    };
  }

  getFilePath(fileUuid: string, variant: string = 'full'): string | null {
    // Search in all subfolders
    const subfolders = ['products', 'companies', 'documents', 'payments'];
    for (const subfolder of subfolders) {
      // Try new format: {uuid}_{variant}.webp
      const filePath = path.join(UPLOAD_DIR, subfolder, `${fileUuid}_${variant}.webp`);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
      // Try old format: {entityType}_{uuid}_{variant}.webp
      for (const entity of subfolders) {
        const oldPath = path.join(UPLOAD_DIR, subfolder, `${entity}_${fileUuid}_${variant}.webp`);
        if (fs.existsSync(oldPath)) {
          return oldPath;
        }
      }
    }
    return null;
  }

  async findByEntity(entityType: string, entityId: string) {
    const config = ENTITY_CONFIG[entityType] || ENTITY_CONFIG.document;

    console.log('[findByEntity] entityType:', entityType, 'entityId:', entityId, 'config:', config);

    const photos = await this.prisma.entity_photos.findMany({
      where: {
        entity_type: entityType,
        entity_id: entityId,
      },
      include: {
        files: true,
      },
      orderBy: { created_at: 'asc' },
    });

    console.log('[findByEntity] raw count:', photos.length);

    // Filtrar eliminados en JS
    const active = photos.filter((p) => !p.deleted_at);

    console.log('[findByEntity] active count:', active.length);

    return active.map((p) => ({
      id: p.id,
      photo_type: p.photo_type,
      file_id: p.file_id,
      url: `/uploads/${config.subfolder}/${p.file_id}_full.webp`,
      thumb_url: `/uploads/${config.subfolder}/${p.file_id}_thumb.webp`,
      medium_url: `/uploads/${config.subfolder}/${p.file_id}_medium.webp`,
      file_name: p.files?.file_name,
      file_size: p.files?.file_size,
    }));
  }

  async deletePhoto(photoId: string, userId?: string) {
    const photo = await this.prisma.entity_photos.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new BadRequestException('Foto no encontrada');
    }

    // Soft delete - registra quién y cuándo
    await this.prisma.entity_photos.update({
      where: { id: photoId },
      data: {
        deleted_at: new Date(),
        deleted_by: userId || null,
      },
    });

    return { success: true };
  }
}
