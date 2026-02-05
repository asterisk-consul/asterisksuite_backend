import { Injectable } from '@nestjs/common';
import { ImportPipeline } from './core/pipeline';
import { ExcelSource } from './sources/excel.source';
import { ArticuloPrecioParser } from './parsers/articulo-precio.parser';
import { ArticuloPrecioTransformer } from './transformers/articulo-precio.transformer';
import { ArticuloPrecioSink } from './sinks/articulo-precio.sink';
@Injectable()
export class DataImportService {
  async importArticuloPrecio(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new ArticuloPrecioParser(),
      new ArticuloPrecioTransformer(),
      new ArticuloPrecioSink(),
    );

    return pipeline.run();
  }
}
