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
import { FacturaSink as VentasSink } from './sales/sinks/sales.sink';

import { NotaParser } from './compras/paresers/notas.parser';
import { NotaTransformer } from './compras/transformer/notas.transformer';

import { VentasTransformer } from './sales/transformer/sales.transformer';
import { FacturaVentaParser } from './sales/parsers/sales.parser';

import { ProductParser } from './products/product.parser';
import { ProductTransformer } from './products/product.transformer';
import { ProductSink } from './products/product.sink';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DataImportService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

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
      new ComprasTransformer(this.db),
      new FacturaSink(this.db),
    );
    return pipeline.run();
  }
  async importventas(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new FacturaVentaParser(),
      new VentasTransformer(this.db),
      new VentasSink(this.db),
    );
    return pipeline.run();
  }
  async importNotaCredito(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new NotaParser(),
      new NotaTransformer(this.db, 'NC'),
      new FacturaSink(this.db), // reutilizamos el mismo sink
    );
    return pipeline.run();
  }

  async importNotaDebito(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new NotaParser(),
      new NotaTransformer(this.db, 'ND'),
      new FacturaSink(this.db),
    );
    return pipeline.run();
  }

  async importProducts(file: Express.Multer.File) {
    const pipeline = new ImportPipeline(
      new ExcelSource(file),
      new ProductParser(),
      new ProductTransformer(),
      new ProductSink(this.db),
    );
    return pipeline.run();
  }
}
