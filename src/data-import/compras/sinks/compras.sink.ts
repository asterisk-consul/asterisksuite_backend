import { Sink } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { ComprasTransformado } from '../transformer/compras.transformer';

export class FacturaSink implements Sink<ComprasTransformado> {
  constructor(private prisma: PrismaService) {}

  async send(data: ComprasTransformado[]): Promise<void> {
    for (const doc of data) {
      const { ref, document_taxes, document_items, ...docData } = doc;

      // 1. Insertar documento principal
      // number se convierte explícitamente a int por si viene como string
      const inserted = await this.prisma.documents.create({
        data: {
          ...docData,
          number: Number(docData.number), // ← conversión explícita
        },
      });

      // 2. Insertar impuestos asociados al documento
      if (document_taxes.length > 0) {
        await this.prisma.document_taxes.createMany({
          data: document_taxes.map((t) => ({
            ...t,
            document_id: inserted.id,
          })),
        });
      }

      // 3. Insertar ítems asociados al documento
      if (document_items.length > 0) {
        await this.prisma.document_items.createMany({
          data: document_items.map((i) => ({
            ...i,
            document_id: inserted.id,
          })),
        });
      }
    }
  }
}
