// data-import.service.ts
import { Injectable } from '@nestjs/common';
import { ImportPipeline } from './core/pipeline';
import { ExcelSource } from './sources/excel.source';

import { ArticuloPrecioParser } from './parsers/articulo-precio.parser';
import { ArticuloPrecioTransformer } from './transformers/articulo-precio.transformer';
import { ArticuloPrecioSink } from './sinks/articulo-precio.sink';

import { FacturaCompraParser } from './compras/paresers/compras.parser';
import { ComprasTransformer } from './compras/transformer/compras.transformer';
import { FacturaSink } from './compras/sinks/compras.sink';

import { NotaParser } from './compras/paresers/notas.parser';
import { NotaTransformer } from './compras/transformer/notas.transformer';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataImportService {
  constructor(private prisma: PrismaService) {}

  async importArticuloPrecio(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new ArticuloPrecioParser(),
      new ArticuloPrecioTransformer(),
      new ArticuloPrecioSink(),
    );
    return pipeline.run();
  }

  async importCompras(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new FacturaCompraParser(),
      new ComprasTransformer(this.prisma),
      new FacturaSink(this.prisma),
    );
    return pipeline.run();
  }

  async importNotaCredito(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new NotaParser(),
      new NotaTransformer(this.prisma, 'NC'),
      new FacturaSink(this.prisma), // reutilizamos el mismo sink
    );
    return pipeline.run();
  }

  async importNotaDebito(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new NotaParser(),
      new NotaTransformer(this.prisma, 'ND'),
      new FacturaSink(this.prisma),
    );
    return pipeline.run();
  }
}