import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma-logistica/client';
import { LogisticaPrismaService } from '@/prisma/prisma-logistica.service';

@Injectable()
export class DocumentSequencesService {
  constructor(private prisma: LogisticaPrismaService) {}

  async getNextNumber(
    tx: Prisma.TransactionClient,
    companyId: string,
    documentType: string,
    pointOfSale: string,
  ): Promise<string> {
    const sequence = await tx.document_sequences.findUnique({
      where: {
        company_id_document_type_point_of_sale: {
          company_id: companyId,
          document_type: documentType,
          point_of_sale: pointOfSale,
        },
      },
    });

    if (!sequence || !sequence.active) {
      throw new BadRequestException('Talonario no configurado');
    }

    const nextNumber = sequence.current_number + 1;

    await tx.document_sequences.update({
      where: { id: sequence.id },
      data: { current_number: nextNumber },
    });

    const formatted = nextNumber.toString().padStart(8, '0');

    return `${sequence.prefix ?? ''}${sequence.point_of_sale}-${formatted}`;
  }
}
