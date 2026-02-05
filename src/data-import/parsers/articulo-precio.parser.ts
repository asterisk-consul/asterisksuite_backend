import { Parser } from '../core/interfaces';
import { ArticuloPrecioSchema } from '../schemas/articulo-precio.schema';

export interface ArticuloPrecioRaw {
  codigo: string;
  precio: number;
  proveedor: string;
}

export class ArticuloPrecioParser implements Parser<ArticuloPrecioRaw> {
  async parse(raw: any[]): Promise<ArticuloPrecioRaw[]> {
    if (!raw.length) {
      throw new Error('Excel vacío');
    }

    const columns = Object.keys(raw[0]);

    for (const col of ArticuloPrecioSchema.requiredColumns) {
      if (!columns.includes(col)) {
        throw new Error(`Falta columna: ${col}`);
      }
    }

    return raw as ArticuloPrecioRaw[];
  }
}
