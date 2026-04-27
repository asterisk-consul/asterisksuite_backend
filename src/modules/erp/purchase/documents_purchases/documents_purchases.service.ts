import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { IndexTaxesPurchasesDto } from '../dto/taxes_purchases/index.dto';

@Injectable()
export class TaxesPurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: IndexTaxesPurchasesDto) {
    return this.prisma.taxes.findMany({
      where: {
        tax_type: 'PURCHASE', // 🔥 clave
        active: dto.active ?? true,
        ...(dto.code && { code: dto.code }),
        ...(dto.name && {
          name: { contains: dto.name, mode: 'insensitive' },
        }),
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // 🔥 ESTE ES EL IMPORTANTE PARA TU LÓGICA
  async getTaxesForDocumentType(documentTypeCode: string) {
    // Ej: COM → compras
    if (documentTypeCode !== 'COM') {
      return [];
    }

    return this.prisma.taxes.findMany({
      where: {
        tax_type: 'PURCHASE',
        active: true,
      },
    });
  }

  // 🔥 Para crear document_taxes después
  async createDocumentTaxes(documentId: string, taxes: any[]) {
    const data = taxes.map((tax) => ({
      document_id: documentId,
      tax_id: tax.id,
      tax_rate: tax.rate,
      taxable_base: 0, // lo calculás después
      tax_amount: 0, // lo calculás después
    }));

    return this.prisma.document_taxes.createMany({
      data,
    });
  }
}
