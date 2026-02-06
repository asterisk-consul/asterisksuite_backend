import { Transformer } from '../core/interfaces';

export interface ArticuloPrecio {
  codigo: string;
  precio: number;
  proveedor: string;
}

export class ArticuloPrecioTransformer implements Transformer<
  any,
  ArticuloPrecio
> {
  async transform(input: any[]): Promise<ArticuloPrecio[]> {
    return input.map((row) => ({
      codigo: row.codigo,
      precio: Number(row.precio),
      proveedor: row.proveedor.trim(),
    }));
  }
}
