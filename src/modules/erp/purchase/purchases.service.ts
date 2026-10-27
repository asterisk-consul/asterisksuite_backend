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
import {
  QueryPurchasesDto,
  DocumentTypeFilter,
} from './dto/query-purchases.dto';
import { PurchasesDocumentsResponseDto } from './dto/documents_purchases/purchases-documents-response';
import { GlobalPurchaseDocumentsResponseDto } from './dto/documents_purchases/global-purchases-documents';

/**
 * Acumulador interno para calcular totales por producto
 */
interface ProductTotalAccumulator {
  productId: number;
  productCode: string;
  productName: string;
  totalSales: number;
  totalTaxes: number;
  totalExempt: number;
  transactionCount: number;
  invoiceCount: number;
  creditNoteCount: number;
  firstSalesDate: Date | null;
  lastSalesDate: Date | null;
  salesValues: number[];
}

@Injectable()
export class PurchasesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /** Resumen liviano para el dashboard de compras, acotado y agregado en DB. */
  async getDashboardSummary(daysInput?: number) {
    const days = Number.isFinite(daysInput) ? Math.min(Math.max(Math.trunc(daysInput!), 7), 90) : 30;
    const now = new Date();
    const argentinaNow = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const to = new Date(Date.UTC(argentinaNow.getUTCFullYear(), argentinaNow.getUTCMonth(), argentinaNow.getUTCDate() + 1));
    const from = new Date(to);
    from.setUTCDate(from.getUTCDate() - days);
    const grouped = await this.prisma.documents.groupBy({
      by: ['date', 'status', 'document_type_id', 'currency_code'],
      where: {
        deleted_at: null,
        date: { gte: from, lt: to },
        document_types: { direction: -1, category: { in: ['INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'ORDER', 'REMITO'] } },
      },
      _count: { id: true },
      _sum: { total: true },
    });
    const types = await this.prisma.document_types.findMany({
      where: { id: { in: [...new Set(grouped.map(row => row.document_type_id))] } },
      select: { id: true, category: true },
    });
    const categoryByType = new Map<string, string>(types.map(type => [type.id, type.category ?? ''] as const));
    const daily = new Map<string, Record<string, number>>();
    const categories: Record<string, { count: number; confirmedCount: number; amountByCurrency: Record<string, number>; byStatus: Record<string, number> }> = {};
    for (const row of grouped) {
      const category = categoryByType.get(row.document_type_id) ?? 'OTHER';
      const amount = Number(row._sum.total ?? 0);
      const count = row._count.id;
      const signedAmount = category === 'CREDIT_NOTE' ? -amount : amount;
      const currency = row.currency_code || 'ARS';
      const categoryRow = categories[category] ??= { count: 0, confirmedCount: 0, amountByCurrency: {}, byStatus: {} };
      categoryRow.count += count;
      if (row.status === 2) {
        categoryRow.confirmedCount += count;
        categoryRow.amountByCurrency[currency] = (categoryRow.amountByCurrency[currency] ?? 0) + signedAmount;
      }
      categoryRow.byStatus[String(row.status)] = (categoryRow.byStatus[String(row.status)] ?? 0) + count;
      const key = new Date(row.date).toISOString().slice(0, 10);
      const dailyCategories = daily.get(key) ?? {};
      dailyCategories[category] = (dailyCategories[category] ?? 0) + count;
      daily.set(key, dailyCategories);
    }
    const netInvoicedByCurrency: Record<string, number> = {};
    for (const category of ['INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE']) {
      for (const [currency, amount] of Object.entries(categories[category]?.amountByCurrency ?? {})) {
        netInvoicedByCurrency[currency] = (netInvoicedByCurrency[currency] ?? 0) + amount;
      }
    }
    return {
      period: { from: from.toISOString().slice(0, 10), to: new Date(to.getTime() - 86400000).toISOString().slice(0, 10), days },
      netInvoicedByCurrency,
      invoiceCount: categories.INVOICE?.confirmedCount ?? 0,
      orderCount: categories.ORDER?.count ?? 0,
      remitoCount: categories.REMITO?.count ?? 0,
      categories,
      daily: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, counts]) => ({ date, counts })),
    };
  }

  /**
   * Mapa de filtros públicos (enum) a categorías internas de documento.
   * Las categorías coinciden con los valores del campo `category` en document_types.
   */
  private readonly categoryMap: Record<DocumentTypeFilter, string> = {
    [DocumentTypeFilter.INVOICE]: 'INVOICE',
    [DocumentTypeFilter.CREDIT_NOTE]: 'CREDIT_NOTE',
    [DocumentTypeFilter.DEBIT_NOTE]: 'DEBIT_NOTE',
  };

  async getPurchaseSummary(
    query: QueryPurchasesDto,
  ): Promise<GlobalPurchaseSummaryResponseDto> {
    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        document_types: {
          active: true,
          ...(whereCondition.document_types ?? {}),
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
        productId: number;
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

      const sign = this.getDocumentSign(doc.document_types.category);
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
          productId: parseInt(productId),
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
          purchaseValues: [] as number[],
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
        productId,
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

    const grandTotal = globalTotal + globalTaxes + globalExempt;

    const globalTransactionCount = products.reduce(
      (sum, p) => sum + p.transactionCount,
      0,
    );

    const negTotal = documents.reduce((sum, doc) => {
      if (!doc.document_types) return sum;

      const sign = this.getDocumentSign(doc.document_types.category);

      if (sign === -1) {
        return sum + Number(doc.subtotal);
      }

      return sum;
    }, 0);

    return {
      globalTotal,
      globalTaxes,
      globalExempt,
      globalPurchaseTotal: grandTotal,
      grandTotal,
      globalTransactionCount,
      negTotal,
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
          ...(whereCondition.document_types ?? {}),
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
        document_types: {
          include: {
            document_sequences: true,
          },
        },
      },
    });

    const suppliersMap = new Map<string, SupplierDetailDto>();
    const documentTypesMap = new Map<string, DocumentTypeDetailDto>();
    const taxesMap = new Map<string, TaxDetailDto>();

    let totalGeneral = 0;
    let totalTaxes = 0;

    // 🔥 CORRECTO: declarado fuera del loop
    const movements: PurchaseMovementResponseDto[] = [];

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.category);

      const productTotal =
        doc.document_items.reduce((sum, item) => {
          const itemValue = Number(item.quantity) * Number(item.price);
          return sum + itemValue;
        }, 0) * sign;

      // 🔥 MOVIMIENTOS
      for (const item of doc.document_items) {
        if (!item.products) continue;

        const itemValue = Number(item.quantity) * Number(item.price);
        movements.push({
          ref: doc.ref || '',
          number: doc.number?.toString() || '',
          date: doc.date,

          supplierName: doc.business_parties?.name || '',
          supplierCode: doc.business_parties?.id || '',

          productId: item.products.id,
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
            doc.document_types?.document_sequences?.current_number?.toString() ||
            '',

          transactionType: sign === 1 ? 'Compra' : 'Nota Crédito/Débito',

          adjustedValue: itemValue * sign,
        });
      }

      totalGeneral += productTotal;

      const documentTotal = Number(doc.total) * sign;
      const productProportion =
        documentTotal !== 0 ? productTotal / documentTotal : 0;

      // 🔹 PROVEEDORES
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
            supplierId: parseInt(supplierId), // ⚠️ si esto también es UUID, habría que cambiarlo
            supplierCode: doc.business_parties.id || '',
            supplierName: doc.business_parties.name,
            totalBySupplier: productTotal,
            transactionCount: 1,
            lastPurchaseDate: doc.date,
          });
        }
      }

      // 🔹 TIPOS DE DOCUMENTO
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

      // 🔹 IMPUESTOS
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

    // 🔥 RETURN FINAL CORREGIDO
    return {
      productId: product.id, // ✅ sin parseInt
      productCode: product.sku || '',
      productName: product.name,
      productCategory: '',
      totalGeneral,
      totalTaxes,
      suppliers: Array.from(suppliersMap.values()),
      documentTypes: Array.from(documentTypesMap.values()),
      taxes: Array.from(taxesMap.values()),
      movements, // ✅ agregado
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
          ...(whereCondition.document_types ?? {}),
        },
      },
      include: {
        document_items: {
          where: {
            product_id: query.productId, // 🔥 ESTE ES EL FIX
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

      const sign = this.getDocumentSign(doc.document_types.category);

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
          productId: item.products.id,
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

  async getPurchaseDocuments(
    query: QueryPurchasesDto,
  ): Promise<GlobalPurchaseDocumentsResponseDto> {
    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        document_types: {
          active: true,
          ...(whereCondition.document_types ?? {}),
        },
      },
      include: {
        business_parties: true,
        document_taxes: {
          include: {
            taxes: true,
          },
        },
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

    let grandTotal = 0;

    const purchaseDocuments: PurchasesDocumentsResponseDto[] = [];

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.category);

      const subtotal = Number(doc.subtotal) * sign;

      const taxes =
        doc.document_taxes.reduce((sum, t) => sum + Number(t.tax_amount), 0) *
        sign;

      const exempt = Number(doc.exempt_amount || 0) * sign;

      const grossTotal = subtotal + taxes + exempt;

      grandTotal += grossTotal;

      purchaseDocuments.push({
        ref: doc.ref || '',
        number: doc.number?.toString() || '',
        date: doc.date,

        supplierName: doc.business_parties?.name || '',
        supplierCode: doc.business_parties?.id || '',

        documentTypeCode: doc.document_types.code,
        documentTypeName: doc.document_types.description,

        documentSubtotal: subtotal,
        taxAmount: taxes,
        totalExempt: exempt,

        documentTotal: grossTotal,

        taxCode: doc.document_taxes.map((t) => t.taxes.code).join(', '),
        taxName: doc.document_taxes.map((t) => t.taxes.name).join(', '),

        sequenceNumber:
          doc.document_types.document_sequences?.current_number?.toString() ||
          '',

        transactionType: sign === 1 ? 'Compra' : 'Nota Crédito/Débito',

        adjustedValue: grossTotal,
      });
    }

    return {
      grandTotal,
      documents: purchaseDocuments,
    };
  }

  async getAvailableProducts(): Promise<AvailableProductResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: {
        document_items: {
          some: {
            documents: {
              document_types: {
                active: true,
                direction: -1,
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
    if (query.documentTypeFilter) {
      const category = this.categoryMap[query.documentTypeFilter];
      where.document_types = { direction: -1, category };
    } else {
      where.document_types = { direction: -1 };
    }

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

  /**
   * Retorna el signo contable del documento según su categoría:
   *  1 → suma (INVOICE, DEBIT_NOTE)
   * -1 → resta (CREDIT_NOTE)
   */
  private getDocumentSign(category: string | null): number {
    if (category === 'CREDIT_NOTE') return -1;
    return 1;
  }
}
