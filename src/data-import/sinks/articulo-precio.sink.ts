import { Sink } from '../core/interfaces';
import { PrismaService } from '../../prisma/prisma.service';

export class ArticuloPrecioSink implements Sink<any> {
  constructor(private prismaService: PrismaService) {}

  async send(data: any[]) {
    const batchSize = 500;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const now = new Date(); // 👈 misma fecha para todo el batch

      // 1. Update existentes
      const updateQueries = batch.map((item) =>
        this.prismaService.articuloprecio.updateMany({
          where: { articuloid: item.articuloid },
          data: {
            categid: 10790,
            precio: item.precio,
            changedate: now, // 👈 FIX
          },
        }),
      );

      // 2. Insertar los que NO existen
      const createData = batch.map((item) => ({
        articuloid: item.articuloid,
        categid: 10790,
        precio: item.precio,
        changedate: now, // 👈 FIX
      }));

      // 3. Histórico
      const historicoData = batch.map((item) => ({
        articuloid: item.articuloid,
        categid: 10790, // 👈 opcional: consistencia
        precio: item.precio,
        changedate: now, // 👈 FIX consistente
        factorconversion: 1,
      }));

      await this.prismaService.$transaction([
        ...updateQueries,

        this.prismaService.articuloprecio.createMany({
          data: createData,
          skipDuplicates: true,
        }),

        this.prismaService.articulopreciohistorico.createMany({
          data: historicoData,
        }),
      ]);
    }
  }
}
