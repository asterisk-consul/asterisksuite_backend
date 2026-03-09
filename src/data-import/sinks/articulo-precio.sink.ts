import { Sink } from '../core/interfaces';
import { PrismaService } from '../../prisma/prisma.service';

export class ArticuloPrecioSink implements Sink<any> {
  constructor(private prismaService: PrismaService) {}

  async send(data: any[]) {
    const batchSize = 500;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const queries = batch.map((item) =>
        this.prismaService.articuloprecio.updateMany({
          where: {
            articuloid: item.articuloid,
          },
          data: {
            precio: item.precio,
          },
        }),
      );

      await this.prismaService.$transaction(queries);
    }
  }
}
