import { Sink } from '../core/interfaces';
import { PrismaService } from '../../prisma/prisma.service';

export class ArticuloPrecioSink implements Sink<any> {
  constructor(private prisma: PrismaService) {}

  async send(data: any[]) {
    const batchSize = 100;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const ids = batch.map((item) => item.articuloid);
      const precios = batch.map((item) => item.precio);

      const cases = batch
        .map((item) => `WHEN ${item.articuloid} THEN ${Number(item.precio)}`)
        .join(' ');

      await this.prisma.$executeRawUnsafe(`
        UPDATE test9000.articuloprecio
        SET precio = CASE articuloid
          ${cases}
        END
        WHERE articuloid IN (${ids.join(',')})
      `);
    }
  }
}
