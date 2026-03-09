import { Transformer } from '../core/interfaces';
import { ArticuloPrecioRaw } from '../schemas/articulo-precio.schema';
import { PrismaService } from '../../prisma/prisma.service';

export type ArticuloPrecioTransformed = {
  articuloid: number;
  precio: number;
};

export class ArticuloPrecioTransformer implements Transformer<
  ArticuloPrecioRaw,
  ArticuloPrecioTransformed
> {
  constructor(private prismaService: PrismaService) {}

  async transform(
    input: ArticuloPrecioRaw[],
  ): Promise<ArticuloPrecioTransformed[]> {
    const resultado: ArticuloPrecioTransformed[] = [];

    // Traemos artículos del sistema
    const articulos = await this.prismaService.articulos.findMany({
      select: {
        id: true,
        internalcode: true,
      },
    });

    // mapa internalcode -> articulo
    const articulosMap = new Map(articulos.map((a) => [a.internalcode, a]));

    for (const item of input) {
      const articulo = articulosMap.get(item.codigo);

      if (!articulo) {
        console.warn(
          `Artículo no encontrado para internalcode: ${item.codigo}`,
        );
        continue;
      }

      resultado.push({
        articuloid: Number(articulo.id),
        precio: Number(item.precio),
      });
    }

    return resultado;
  }
}
