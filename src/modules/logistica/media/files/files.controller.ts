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

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Controller('media')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
  ) {
    return this.filesService.upload(file, entityType, entityId, photoType, user?.id);
  }

  // ─── Download (full) ─────────────────────────────────
  @Get('files/:fileUuid/download')
  async download(
    @Param('fileUuid') fileUuid: string,
    @Res() res: Response,
  ) {
    const filePath = this.filesService.getFilePath(fileUuid, 'full');
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.set({ 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000' });
    fs.createReadStream(filePath).pipe(res);
  }

  // ─── Download (medium) ───────────────────────────────
  @Get('files/:fileUuid/medium')
  async downloadMedium(
    @Param('fileUuid') fileUuid: string,
    @Res() res: Response,
  ) {
    const filePath = this.filesService.getFilePath(fileUuid, 'medium');
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.set({ 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000' });
    fs.createReadStream(filePath).pipe(res);
  }

  // ─── Download (thumb) ────────────────────────────────
  @Get('files/:fileUuid/thumb')
  async downloadThumb(
    @Param('fileUuid') fileUuid: string,
    @Res() res: Response,
  ) {
    const filePath = this.filesService.getFilePath(fileUuid, 'thumb');
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }
    res.set({ 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000' });
    fs.createReadStream(filePath).pipe(res);
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
