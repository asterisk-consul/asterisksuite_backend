import { Sink } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { ComprasTransformado } from '../transformer/compras.transformer';

export class FacturaSink implements Sink<ComprasTransformado> {
  constructor(private prisma: PrismaService) {}

  async send(data: ComprasTransformado[]): Promise<void> {
    for (const doc of data) {
      const { ref, document_taxes, document_items, ...docData } = doc;

      const documentNumber = Number(docData.number);

      // 1. Verificar duplicado por ref
      const existingDocument = await this.prisma.documents.findFirst({
        where: { ref },
      });

      if (existingDocument) {
        console.log(`⏭️  Documento ${ref} ya existe, saltando...`);
        continue;
      }

      // 2. Insertar en transacción — si falla un hijo, se revierte todo
      await this.prisma.$transaction(async (tx) => {
        const inserted = await tx.documents.create({
          data: {
            ...docData,
            number: documentNumber,
            ref,
            // exempt_amount llega en docData automáticamente via spread
          },
        });

        if (document_taxes.length > 0) {
          await tx.document_taxes.createMany({
            data: document_taxes.map((t) => ({
              ...t,
              document_id: inserted.id,
            })),
          });
        }

        if (document_items.length > 0) {
          await tx.document_items.createMany({
            data: document_items.map((i) => ({
              ...i,
              document_id: inserted.id,
            })),
          });
        }

        console.log(
          `✅ ${ref} insertado (taxes: ${document_taxes.length}, items: ${document_items.length})`,
        );
      });
    }
  }
}
