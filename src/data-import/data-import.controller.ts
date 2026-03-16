import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataImportService } from './data-import.service';
import { ExcelSource } from './sources/excel.source'; // ← agregá esto

@Controller('data-import')
export class DataImportController {
  constructor(private service: DataImportService) {}

  @Post('articulo-precio')
  @UseInterceptors(FileInterceptor('file'))
  uploadArticuloPrecio(@UploadedFile() file: Express.Multer.File) {
    return this.service.importArticuloPrecio(file);
  }

  @Post('compras')
  @UseInterceptors(FileInterceptor('file'))
  uploadCompras(@UploadedFile() file: Express.Multer.File) {
    return this.service.importCompras(file);
  }

  @Post('compras-debug')
  @UseInterceptors(FileInterceptor('file'))
  async debug(@UploadedFile() file: Express.Multer.File) {
    const source = new ExcelSource(file);
    const raw = await source.load();
    return raw[0];
  }
}
