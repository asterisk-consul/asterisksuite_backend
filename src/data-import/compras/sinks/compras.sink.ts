import { Sink } from '../../core/interfaces';
import { PrismaService } from '../../../prisma/prisma.service';
import { ComprasTransformado } from '../transformer/compras.transformer';

export class FacturaSink implements Sink<ComprasTransformado> {
  constructor(private prisma: PrismaService) {}

  async send(data: ComprasTransformado[]): Promise<void> {
    for (const doc of data) {
      const { ref, document_taxes, document_items, ...docData } = doc;

      // Convertir number explícitamente
      const documentNumber = Number(docData.number);

      // 1. Verificar si el documento ya existe por REF (identificador único del documento original)
      const existingDocument = await this.prisma.documents.findFirst({
        where: {
          ref: ref, // ← Usar ref para identificar duplicados
        },
      });

      // Si ya existe, saltar este documento
      if (existingDocument) {
        console.log(`Documento con ref ${ref} ya existe, saltando...`);
        continue;
      }

      // 2. Verificar si ya existe una combinación document_type_id + number
      // pero si el ref es único, esta verificación es opcional
      const existingByNumber = await this.prisma.documents.findFirst({
        where: {
          document_type_id: docData.document_type_id,
          number: documentNumber,
        },
      });

      if (existingByNumber) {
        console.log(
          `⚠️ Advertencia: Ya existe documento tipo ${docData.document_type_id} con número ${documentNumber}, pero ref ${ref} es diferente`,
        );
        // Puedes decidir si continuar o no
      }

      // 3. Insertar documento principal con ref
      const inserted = await this.prisma.documents.create({
        data: {
          ...docData,
          number: documentNumber,
          ref: ref, // ← Incluir ref
        },
      });

      // 4. Insertar impuestos asociados al documento
      if (document_taxes.length > 0) {
        await this.prisma.document_taxes.createMany({
          data: document_taxes.map((t) => ({
            ...t,
            document_id: inserted.id,
          })),
        });
      }

      // 5. Insertar ítems asociados al documento
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
