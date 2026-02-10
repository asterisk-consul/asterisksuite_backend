import { Parser } from '../core/interfaces';
import {
  ArticuloPrecioSchema,
  ArticuloPrecioRaw,
} from '../schemas/articulo-precio.schema';

type ArticuloPrecioRow = {
  CODIGO: unknown;
  PRECIO: unknown;
  PROVEEDOR: unknown;
};

export class ArticuloPrecioParser implements Parser<ArticuloPrecioRaw> {
  parse(raw: unknown[]): ArticuloPrecioRaw[] {
    return raw.map((row) => {
      const r = row as ArticuloPrecioRow;

      return ArticuloPrecioSchema.parse({
        codigo: r.CODIGO,
        precio: r.PRECIO,
        proveedor: r.PROVEEDOR,
      });
    });
  }
}
