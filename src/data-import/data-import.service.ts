import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { ImportPipeline } from './core/pipeline';
import { ExcelSource } from './sources/excel.source';
import { ArticuloPrecioParser } from './parsers/articulo-precio.parser';
import { ArticuloPrecioTransformer } from './transformers/articulo-precio.transformer';
import { ArticuloPrecioSink } from './sinks/articulo-precio.sink';

@Injectable()
export class DataImportService {
  constructor(private prismaService: PrismaService) {}

  async importArticuloPrecio(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new ArticuloPrecioParser(),
      new ArticuloPrecioTransformer(this.prismaService),
      new ArticuloPrecioSink(this.prismaService),
    );

    return pipeline.run();
  }
}
