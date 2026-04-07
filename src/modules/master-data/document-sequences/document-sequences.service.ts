import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DocumentSequencesService {
  constructor(private prisma: PrismaService) {}

  async getNextNumber(
    tx: Prisma.TransactionClient,
    documentType: string,
    pointOfSale: string,
  ): Promise<string> {
    const sequence = await tx.document_sequences.findUnique({
      where: {
        document_type_point_of_sale: {
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
