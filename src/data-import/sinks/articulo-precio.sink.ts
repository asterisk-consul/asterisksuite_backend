import { Sink } from '../core/interfaces';
import { PrismaService } from '../../prisma/prisma.service';

export class ArticuloPrecioSink implements Sink<any> {
  constructor(private prismaService: PrismaService) {}

  async send(data: any[]) {
    const batchSize = 20;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      const now = new Date();

      await this.prismaService.$transaction(
        async (tx) => {
          for (const item of batch) {
            await tx.articuloprecio.updateMany({
              where: { articuloid: item.articuloid },
              data: {
                categid: 10790,
                precio: item.precio,
                changedate: now,
              },
            });
          }

          const createData = batch.map((item) => ({
            articuloid: item.articuloid,
            categid: 10790,
            precio: item.precio,
            changedate: now,
          }));

          await tx.articuloprecio.createMany({
            data: createData,
            skipDuplicates: true,
          });
        },
        { timeout: 30000 },
      );
    }
  }
}
