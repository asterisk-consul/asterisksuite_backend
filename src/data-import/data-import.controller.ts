import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataImportService } from './data-import.service';

@Controller('data-import')
export class DataImportController {
  constructor(private service: DataImportService) {}

  @Post('articulo-precio')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log('Archivo recibido:', file);
    return this.service.importArticuloPrecio(file);
  }
}
