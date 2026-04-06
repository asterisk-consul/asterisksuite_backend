// src/modules/erp/purchases/purchases.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  GlobalPurchaseSummaryResponseDto,
  ProductSummaryDto,
  ProductPurchaseDetailResponseDto,
  PurchaseMovementResponseDto,
  SupplierDetailDto,
  DocumentTypeDetailDto,
  TaxDetailDto,
  AvailableProductResponseDto,
} from './dto';
import { QueryPurchasesDto } from './dto/query-purchases.dto';

@Injectable()
export class PurchasesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPurchaseSummary(
    query: QueryPurchasesDto,
  ): Promise<GlobalPurchaseSummaryResponseDto> {
    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        document_types: {
          active: true,
        },
      },
      include: {
        document_items: {
          include: {
            products: true,
          },
        },
        document_taxes: {
          include: {
            taxes: true,
          },
        },
        business_parties: true,
        document_types: true,
      },
    });

    const productTotals = new Map<
      string,
      {
        productCode: string;
        productName: string;
        totalPurchases: number;
        totalTaxes: number;
        totalExempt: number;
        transactionCount: number;
        invoiceCount: number;
        creditNoteCount: number;
        firstPurchaseDate: Date | null;
        lastPurchaseDate: Date | null;
        purchaseValues: number[];
      }
    >();

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.code);
      const isInvoice = sign === 1;

      const documentSubtotal = Number(doc.subtotal) * sign;

      for (const item of doc.document_items) {
        if (!item.products) continue;

        const productId = item.products.id;
        const product = item.products;

        const itemValue = Number(item.quantity) * Number(item.price);
        const proportion =
          documentSubtotal !== 0 ? itemValue / documentSubtotal : 0;

        const productValue = itemValue * sign;

        const current = productTotals.get(productId) || {
          productCode: product.sku || '',
          productName: product.name,
          totalPurchases: 0,
          totalTaxes: 0,
          totalExempt: 0,
          transactionCount: 0,
          invoiceCount: 0,
          creditNoteCount: 0,
          firstPurchaseDate: null,
          lastPurchaseDate: null,
          purchaseValues: [],
        };

        const productTaxes = doc.document_taxes.reduce((sum, tax) => {
          return sum + Number(tax.tax_amount) * proportion * sign;
        }, 0);

        const productExempt =
          Number(doc.exempt_amount || 0) * proportion * sign;

        current.totalPurchases += productValue;
        current.totalTaxes += productTaxes;
        current.totalExempt += productExempt;
        current.transactionCount += 1;

        if (isInvoice) {
          current.invoiceCount += 1;
        } else {
          current.creditNoteCount += 1;
        }

        current.purchaseValues.push(productValue);

        const docDate = new Date(doc.date);

        if (!current.firstPurchaseDate || docDate < current.firstPurchaseDate) {
          current.firstPurchaseDate = docDate;
        }

        if (!current.lastPurchaseDate || docDate > current.lastPurchaseDate) {
          current.lastPurchaseDate = docDate;
        }

        productTotals.set(productId, current);
      }
    }

    const products: ProductSummaryDto[] = Array.from(productTotals.entries())
      .map(([productId, data]) => ({
        productId: parseInt(productId),
        productCode: data.productCode,
        productName: data.productName,
        productCategory: '',
        totalPurchases: data.totalPurchases,
        totalTaxes: data.totalTaxes,
        totalExempt: data.totalExempt,
        transactionCount: data.transactionCount,
        invoiceCount: data.invoiceCount,
        creditNoteCount: data.creditNoteCount,
        firstPurchaseDate: data.firstPurchaseDate,
        lastPurchaseDate: data.lastPurchaseDate,
        avgPurchaseValue:
          data.purchaseValues.length > 0
            ? data.totalPurchases / data.purchaseValues.length
            : 0,
      }))
      .sort((a, b) => b.totalPurchases - a.totalPurchases);

    const globalTotal = products.reduce((sum, p) => sum + p.totalPurchases, 0);

    const globalTaxes = products.reduce((sum, p) => sum + p.totalTaxes, 0);

    const globalExempt = products.reduce((sum, p) => sum + p.totalExempt, 0);

    const globalTransactionCount = products.reduce(
      (sum, p) => sum + p.transactionCount,
      0,
    );

    return {
      globalTotal,
      globalTaxes,
      globalExempt,
      globalTransactionCount,
      totalProducts: products.length,
      products,
    };
  }

  async getProductPurchaseDetail(
    id: string,
    query: QueryPurchasesDto,
  ): Promise<ProductPurchaseDetailResponseDto> {
    const product = await this.prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        document_types: {
          active: true,
        },
        document_items: {
          some: {
            product_id: id,
          },
        },
      },
      include: {
        document_items: {
          where: {
            product_id: id,
          },
          include: {
            products: true,
          },
        },
        document_taxes: {
          include: {
            taxes: true,
          },
        },
        business_parties: true,
        document_types: true,
      },
    });

    const suppliersMap = new Map<string, SupplierDetailDto>();
    const documentTypesMap = new Map<string, DocumentTypeDetailDto>();
    const taxesMap = new Map<string, TaxDetailDto>();

    let totalGeneral = 0;
    let totalTaxes = 0;

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.code);

      const productTotal =
        doc.document_items.reduce((sum, item) => {
          const itemValue = Number(item.quantity) * Number(item.price);
          return sum + itemValue;
        }, 0) * sign;

      totalGeneral += productTotal;

      const documentTotal = Number(doc.total) * sign;
      const productProportion =
        documentTotal !== 0 ? productTotal / documentTotal : 0;

      if (doc.business_parties) {
        const supplierId = doc.business_parties.id;
        const existingSupplier = suppliersMap.get(supplierId);

        if (existingSupplier) {
          existingSupplier.totalBySupplier += productTotal;
          existingSupplier.transactionCount += 1;

          if (doc.date > existingSupplier.lastPurchaseDate) {
            existingSupplier.lastPurchaseDate = doc.date;
          }
        } else {
          suppliersMap.set(supplierId, {
            supplierId: parseInt(supplierId),
            supplierCode: doc.business_parties.id || '',
            supplierName: doc.business_parties.name,
            totalBySupplier: productTotal,
            transactionCount: 1,
            lastPurchaseDate: doc.date,
          });
        }
      }

      const docTypeId = doc.document_type_id;
      const existingDocType = documentTypesMap.get(docTypeId);

      if (existingDocType) {
        existingDocType.totalByDocumentType += productTotal;
        existingDocType.transactionCount += 1;
      } else {
        documentTypesMap.set(docTypeId, {
          documentTypeId: parseInt(docTypeId),
          documentTypeCode: doc.document_types.code,
          documentTypeName: doc.document_types.description,
          totalByDocumentType: productTotal,
          transactionCount: 1,
        });
      }

      for (const tax of doc.document_taxes) {
        const taxAmount = Number(tax.tax_amount) * productProportion * sign;

        totalTaxes += taxAmount;

        const taxId = tax.tax_id;
        const existingTax = taxesMap.get(taxId);

        if (existingTax) {
          existingTax.totalTaxByProduct += taxAmount;
          existingTax.taxableBase += productTotal;
        } else {
          taxesMap.set(taxId, {
            taxId: parseInt(taxId),
            taxCode: tax.taxes.code,
            taxName: tax.taxes.name,
            taxRate: Number(tax.taxes.rate),
            totalTaxByProduct: taxAmount,
            taxableBase: productTotal,
          });
        }
      }
    }

    return {
      productId: parseInt(product.id),
      productCode: product.sku || '',
      productName: product.name,
      productCategory: '',
      totalGeneral,
      totalTaxes,
      suppliers: Array.from(suppliersMap.values()),
      documentTypes: Array.from(documentTypesMap.values()),
      taxes: Array.from(taxesMap.values()),
    };
  }
  async getPurchaseMovements(
    query: QueryPurchasesDto,
  ): Promise<PurchaseMovementResponseDto[]> {
    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        document_types: {
          active: true,
        },
      },
      include: {
        document_items: {
          include: {
            products: true,
          },
        },
        document_taxes: {
          include: {
            taxes: true,
          },
        },
        business_parties: true,
        document_types: {
          include: {
            document_sequences: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const movements: PurchaseMovementResponseDto[] = [];

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.code);

      const transactionType = sign === 1 ? 'Compra' : 'Nota Crédito/Débito';

      for (const item of doc.document_items) {
        if (!item.products) continue;

        const itemValue = Number(item.quantity) * Number(item.price);

        movements.push({
          ref: doc.ref || '',
          number: doc.number?.toString() || '',
          date: doc.date,
          supplierName: doc.business_parties?.name || '',
          supplierCode: doc.business_parties?.id || '',
          productId: parseInt(item.products.id),
          productCode: item.products.sku || '',
          productName: item.products.name,
          documentTypeCode: doc.document_types.code,
          documentTypeName: doc.document_types.description,
          quantity: Number(item.quantity),
          unitPrice: Number(item.price),
          itemSubtotal: itemValue,
          documentSubtotal: Number(doc.subtotal),
          documentTotal: Number(doc.total),

          taxCode: doc.document_taxes.map((t) => t.taxes.code).join(', '),
          taxName: doc.document_taxes.map((t) => t.taxes.name).join(', '),

          taxAmount: doc.document_taxes.reduce(
            (sum, t) => sum + Number(t.tax_amount),
            0,
          ),

          sequenceNumber:
            doc.document_types.document_sequences?.current_number?.toString() ||
            '',

          transactionType,

          adjustedValue: itemValue * sign,
        });
      }
    }

    return movements;
  }
  async getAvailableProducts(): Promise<AvailableProductResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: {
        document_items: {
          some: {
            documents: {
              document_types: {
                active: true,
              },
            },
          },
        },
      },
      select: {
        id: true,
        sku: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return products.map((p) => ({
      id: parseInt(p.id),
      code: p.sku || '',
      name: p.name,
    }));
  }

  private buildWhereCondition(query: QueryPurchasesDto): any {
    const where: any = {};

    if (query) {
      if (query.startDate || query.endDate) {
        where.date = {};

        if (query.startDate) {
          where.date.gte = new Date(query.startDate);
        }

        if (query.endDate) {
          where.date.lte = new Date(query.endDate);
        }
      }

      if (query.supplierId) {
        where.party_id = query.supplierId;
      }

      if (query.documentTypeId) {
        where.document_type_id = query.documentTypeId;
      }

      if (query.productId) {
        where.document_items = {
          some: {
            product_id: query.productId.toString(),
          },
        };
      }
    }

    return where;
  }

  private getDocumentSign(documentCode: string): number {
    const positiveDocuments = [
      'FC',
      'FACT',
      'COM',
      'FCA',
      'FCB',
      'FCC',
      'FCE',
      'FCR',
    ];

    const negativeDocuments = [
      'NC',
      'ND',
      'CREDIT',
      'NOTA_CREDITO',
      'NDC',
      'NDD',
    ];

    if (positiveDocuments.includes(documentCode)) {
      return 1;
    }

    if (negativeDocuments.includes(documentCode)) {
      return -1;
    }

    return 1;
  }
}
