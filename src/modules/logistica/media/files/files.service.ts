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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_TYPES = [...IMAGE_TYPES, 'application/pdf'];
const MIME_BY_EXTENSION: Record<string, string> = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.webp': 'image/webp', '.gif': 'image/gif', '.pdf': 'application/pdf',
};

const ENTITY_CONFIG: Record<string, { maxImages: number; maxWidth: number; subfolder: string }> = {
  product: { maxImages: 5, maxWidth: 1200, subfolder: 'products' },
  company: { maxImages: 1, maxWidth: 800, subfolder: 'companies' },
  document: { maxImages: 10, maxWidth: 1600, subfolder: 'documents' },
  payment: { maxImages: 10, maxWidth: 1600, subfolder: 'payments' },
  check: { maxImages: 5, maxWidth: 1600, subfolder: 'checks' },
  check_deposit: { maxImages: 5, maxWidth: 1600, subfolder: 'check-deposits' },
  intake: { maxImages: 10, maxWidth: 1600, subfolder: 'intake' },
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

    const maxFileSize = file.mimetype === 'application/pdf' ? MAX_DOCUMENT_SIZE : MAX_IMAGE_SIZE;
    if (file.size > maxFileSize) {
      throw new BadRequestException(`El archivo excede el tamaño máximo de ${maxFileSize / 1024 / 1024} MB`);
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

    const isImage = IMAGE_TYPES.includes(file.mimetype);

    // Create file record first to get the Prisma-generated ID
    const fileData: any = {
      storage_provider: 'local',
      file_path: '', // will update after saving
      public_url: '',
      file_name: file.originalname,
      mime_type: file.mimetype,
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

    const safeExtension = path.extname(file.originalname).toLowerCase() || (isImage ? '.img' : '.pdf');
    const originalPath = path.join(subDir, `${baseName}_original${safeExtension}`);
    fs.writeFileSync(originalPath, file.buffer);

    if (isImage) {
      const fullBuffer = await sharp(file.buffer).rotate()
        .resize(config.maxWidth, null, { withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      const mediumBuffer = await sharp(file.buffer).rotate()
        .resize(800, null, { withoutEnlargement: true }).webp({ quality: 78 }).toBuffer();
      const thumbBuffer = await sharp(file.buffer).rotate()
        .resize(240, null, { withoutEnlargement: true }).webp({ quality: 72 }).toBuffer();
      fs.writeFileSync(path.join(subDir, `${baseName}_full.webp`), fullBuffer);
      fs.writeFileSync(path.join(subDir, `${baseName}_medium.webp`), mediumBuffer);
      fs.writeFileSync(path.join(subDir, `${baseName}_thumb.webp`), thumbBuffer);
    }

    // Update file record with correct path
    await this.prisma.files.update({
      where: { id: fileRecord.id },
      data: {
        file_path: originalPath,
        public_url: `/api/media/files/${fileRecord.id}/download`,
        file_size: file.size,
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
      url: `/api/media/files/${baseName}/view`,
      thumb_url: isImage ? `/api/media/files/${baseName}/thumb` : null,
      medium_url: isImage ? `/api/media/files/${baseName}/medium` : null,
      file_name: file.originalname,
      file_size: file.size,
      mime_type: file.mimetype,
    };
  }

  getFilePath(fileUuid: string, variant: string = 'full'): string | null {
    // Search in all subfolders
    const subfolders = ['products', 'companies', 'documents', 'payments', 'checks', 'check-deposits', 'intake'];
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

  private getOriginalFilePath(fileUuid: string): string | null {
    const subfolders = ['products', 'companies', 'documents', 'payments', 'checks', 'check-deposits', 'intake'];
    for (const subfolder of subfolders) {
      const directory = path.join(UPLOAD_DIR, subfolder);
      if (!fs.existsSync(directory)) continue;
      const match = fs.readdirSync(directory).find((name) => name.startsWith(`${fileUuid}_original.`));
      if (match) return path.join(directory, match);
    }
    return null;
  }

  private getPhysicalFileMetadata(fileUuid: string) {
    const filePath = this.getOriginalFilePath(fileUuid) || this.getFilePath(fileUuid, 'full');
    if (!filePath || !fs.existsSync(filePath)) return null;
    const extension = path.extname(filePath).toLowerCase();
    return {
      filePath,
      fileName: `Comprobante${extension || ''}`,
      mimeType: MIME_BY_EXTENSION[extension] || 'application/octet-stream',
      fileSize: fs.statSync(filePath).size,
    };
  }

  async getStoredFile(fileUuid: string, variant: 'original' | 'full' | 'medium' | 'thumb' = 'original') {
    const record = await this.prisma.files.findFirst({ where: { id: fileUuid, deleted_at: null } });
    if (!record) {
      const physical = this.getPhysicalFileMetadata(fileUuid);
      if (!physical) return null;
      const requestedPath = variant === 'original' ? physical.filePath : this.getFilePath(fileUuid, variant) || physical.filePath;
      return {
        record: { mime_type: physical.mimeType, file_name: physical.fileName },
        filePath: requestedPath,
      };
    }
    if (variant === 'original') return { record, filePath: record.file_path };
    const variantPath = this.getFilePath(fileUuid, variant);
    return { record, filePath: variantPath || record.file_path };
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
    const fileRecords = active.length
      ? await this.prisma.files.findMany({ where: { id: { in: active.map((p) => p.file_id) } } })
      : [];
    const fileMap = new Map(fileRecords.map((file) => [file.id, file]));

    console.log('[findByEntity] active count:', active.length);

    return active.map((p) => {
      const storedFile = fileMap.get(p.file_id) || p.files;
      const physical = this.getPhysicalFileMetadata(p.file_id);
      let fileSize = Number(storedFile?.file_size) || physical?.fileSize || 0;
      if (!fileSize && storedFile?.file_path) {
        try {
          fileSize = fs.statSync(storedFile.file_path).size;
        } catch {
          // El archivo puede pertenecer a un almacenamiento externo o ya no existir.
        }
      }

      return {
        id: p.id,
        photo_type: p.photo_type,
        file_id: p.file_id,
        url: `/api/media/files/${p.file_id}/view`,
        download_url: `/api/media/files/${p.file_id}/download`,
        thumb_url: (storedFile?.mime_type || physical?.mimeType)?.startsWith('image/') ? `/api/media/files/${p.file_id}/thumb` : null,
        medium_url: (storedFile?.mime_type || physical?.mimeType)?.startsWith('image/') ? `/api/media/files/${p.file_id}/medium` : null,
        file_name: storedFile?.file_name || physical?.fileName || 'Comprobante adjunto',
        file_size: fileSize,
        mime_type: storedFile?.mime_type || physical?.mimeType || 'application/octet-stream',
      };
    });
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
