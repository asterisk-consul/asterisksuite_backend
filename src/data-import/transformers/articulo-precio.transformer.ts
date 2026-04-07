import { Transformer } from '../core/interfaces';
import { ArticuloPrecioRaw } from '../schemas/articulo-precio.schema';

export class ArticuloPrecioTransformer implements Transformer<
  ArticuloPrecioRaw,
  any
> {
  async transform(input: ArticuloPrecioRaw[]): Promise<any[]> {
    // Transformar array completo
    return input.map((item) => ({
      codigo: item.codigo,
      precio: item.precio,
      proveedor: item.proveedor,
      // Agrega cualquier transformación adicional aquí
    }));
  }
}
