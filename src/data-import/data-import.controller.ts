// data-import.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataImportService } from './data-import.service';

@Controller('data-import')
export class DataImportController {
  constructor(private readonly service: DataImportService) {}

  @Post('articulo-precio')
  @UseInterceptors(FileInterceptor('file'))
  importArticuloPrecio(@UploadedFile() file: Express.Multer.File) {
    return this.service.importArticuloPrecio(file);
  }

  @Post('compras')
  @UseInterceptors(FileInterceptor('file'))
  importCompras(@UploadedFile() file: Express.Multer.File) {
    return this.service.importCompras(file);
  }

  @Post('nota-credito')
  @UseInterceptors(FileInterceptor('file'))
  importNotaCredito(@UploadedFile() file: Express.Multer.File) {
    return this.service.importNotaCredito(file);
  }

  @Post('nota-debito')
  @UseInterceptors(FileInterceptor('file'))
  importNotaDebito(@UploadedFile() file: Express.Multer.File) {
    return this.service.importNotaDebito(file);
  }
}