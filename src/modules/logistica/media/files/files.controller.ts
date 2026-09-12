import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import type { Response, Request } from 'express';
import * as fs from 'fs';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PermissionContextBuilder } from '@/access-control/authorization/permission-context.builder';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

@Controller('media')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly permissionContextBuilder: PermissionContextBuilder,
  ) {}

  // ─── Upload ──────────────────────────────────────────
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (ALLOWED_TYPES.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
        }
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('entity_type') entityType: string,
    @Body('entity_id') entityId: string,
    @Body('photo_type') photoType?: string,
    @CurrentUser() user?: AuthUser,
    @Req() req?: Request,
  ) {
    if (entityType === 'intake' && (req as any)?.companyUserRole !== 'OWNER') {
      if (!user?.id) throw new ForbiddenException('No tienes permisos para adjuntar archivos');
      const permissionContext = await this.permissionContextBuilder.build(user.id);
      if (!permissionContext.can('intake.upload')) {
        throw new ForbiddenException('No tienes permisos para adjuntar archivos a capturas');
      }
    }
    return this.filesService.upload(file, entityType, entityId, photoType, user?.id);
  }

  // ─── Download (full) ─────────────────────────────────
  @Get('files/:fileUuid/download')
  async download(
    @Param('fileUuid') fileUuid: string,
    @Res() res: Response,
  ) {
    const stored = await this.filesService.getStoredFile(fileUuid, 'original');
    if (!stored?.filePath || !fs.existsSync(stored.filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.set({
      'Content-Type': stored.record.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(stored.record.file_name || 'archivo')}`,
      'Content-Length': fs.statSync(stored.filePath).size.toString(),
      'Cache-Control': 'private, no-store',
    });
    fs.createReadStream(stored.filePath).pipe(res);
  }

  @Get('files/:fileUuid/view')
  async view(@Param('fileUuid') fileUuid: string, @Res() res: Response) {
    const stored = await this.filesService.getStoredFile(fileUuid, 'original');
    if (!stored?.filePath || !fs.existsSync(stored.filePath)) return res.status(404).json({ message: 'Archivo no encontrado' });
    res.set({
      'Content-Type': stored.record.mime_type || 'application/octet-stream',
      'Content-Disposition': `inline; filename*=UTF-8''${encodeURIComponent(stored.record.file_name || 'archivo')}`,
      'Content-Length': fs.statSync(stored.filePath).size.toString(),
      'Cache-Control': 'private, max-age=3600',
    });
    fs.createReadStream(stored.filePath).pipe(res);
  }

  // ─── Download (medium) ───────────────────────────────
  @Get('files/:fileUuid/medium')
  async downloadMedium(
    @Param('fileUuid') fileUuid: string,
    @Res() res: Response,
  ) {
    const stored = await this.filesService.getStoredFile(fileUuid, 'medium');
    if (!stored?.filePath || !fs.existsSync(stored.filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.set({
      'Content-Type': 'image/webp',
      'Content-Length': fs.statSync(stored.filePath).size.toString(),
      'Cache-Control': 'private, max-age=3600',
    });
    fs.createReadStream(stored.filePath).pipe(res);
  }

  // ─── Download (thumb) ────────────────────────────────
  @Get('files/:fileUuid/thumb')
  async downloadThumb(
    @Param('fileUuid') fileUuid: string,
    @Res() res: Response,
  ) {
    const stored = await this.filesService.getStoredFile(fileUuid, 'thumb');
    if (!stored?.filePath || !fs.existsSync(stored.filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.set({
      'Content-Type': 'image/webp',
      'Content-Length': fs.statSync(stored.filePath).size.toString(),
      'Cache-Control': 'private, max-age=3600',
    });
    fs.createReadStream(stored.filePath).pipe(res);
  }

  // ─── Get photos by entity ────────────────────────────
  @Get('photos/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.filesService.findByEntity(entityType, entityId);
  }

  // ─── Delete photo ────────────────────────────────────
  @Delete('photos/:photoId')
  deletePhoto(
    @Param('photoId') photoId: string,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.filesService.deletePhoto(photoId, user?.id);
  }

  // ─── Legacy CRUD ─────────────────────────────────────
  @Post('files')
  create(@Body() dto: CreateFileDto) {
    return this.filesService.create(dto);
  }

  @Get('files')
  findAll() {
    return this.filesService.findAll();
  }

  @Get('files/:id')
  findOne(@Param('id') id: string) {
    return this.filesService.findById(id);
  }
}
