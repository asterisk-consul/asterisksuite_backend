// data-import.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DataImportService } from './data-import.service';
// import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';

@Controller('data-import')
export class DataImportController {
  constructor(private readonly service: DataImportService) {}

  // @RequirePermissions('data_import.execute')
  @Post('articulo-precio')
  @UseInterceptors(FileInterceptor('file'))
  importArticuloPrecio(@UploadedFile() file: Express.Multer.File) {
    return this.service.importArticuloPrecio(file);
  }

  // @RequirePermissions('data_import.execute')
  @Post('compras')
  @UseInterceptors(FileInterceptor('file'))
  importCompras(@UploadedFile() file: Express.Multer.File) {
    return this.service.importCompras(file);
  }

  // @RequirePermissions('data_import.execute')
  @Post('ventas')
  @UseInterceptors(FileInterceptor('file'))
  importVentas(@UploadedFile() file: Express.Multer.File) {
    return this.service.importventas(file);
  }

  // @RequirePermissions('data_import.execute')
  @Post('nota-credito')
  @UseInterceptors(FileInterceptor('file'))
  importNotaCredito(@UploadedFile() file: Express.Multer.File) {
    return this.service.importNotaCredito(file);
  }

  // @RequirePermissions('data_import.execute')
  @Post('nota-debito')
  @UseInterceptors(FileInterceptor('file'))
  importNotaDebito(@UploadedFile() file: Express.Multer.File) {
    return this.service.importNotaDebito(file);
  }

  // @RequirePermissions('data_import.execute')
  @Post('products')
  @UseInterceptors(FileInterceptor('file'))
  importProducts(@UploadedFile() file: Express.Multer.File) {
    return this.service.importProducts(file);
  }
}
