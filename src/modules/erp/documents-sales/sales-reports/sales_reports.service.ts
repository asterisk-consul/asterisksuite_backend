import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import {
  GlobalSalesSummaryResponseDto,
  ProductSummaryDto,
  ProductSalesDetailResponseDto,
  SalesMovementResponseDto,
  SupplierDetailDto,
  DocumentTypeDetailDto,
  TaxDetailDto,
  AvailableProductSalesResponseDto,
} from './dto';
import { QuerySalesDto, DocumentTypeFilter } from './dto/query-sales.dto';
import { SalesDocumentsResponseDto } from './dto/sales-documents-response.dto';
import { GlobalSalesDocumentsResponseDto } from './dto/global-sales-documents';
import { ProductReportLinesResponseDto } from './dto/product-report-lines.dto';

/**
 * Acumulador interno para calcular totales por producto
 * en getSalesSummary antes de mapear al DTO final.
 */
interface ProductTotalAccumulator {
  productId: string;
  productCode: string;
  productName: string;
  productCategory: string;
  unitLabel: string;
  currencyCode: string;
  totalQuantity: number;
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
export class SalesService {
  constructor(private db: PrismaService) {}

  // Getter privado para reutilizar en todos los métodos
  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  /**
   * Mapa de filtros públicos (enum) a categorías internas de documento.
   * Las categorías coinciden con los valores del campo `category` en document_types.
   */
  private readonly categoryMap: Record<DocumentTypeFilter, string> = {
    [DocumentTypeFilter.INVOICE]: 'INVOICE',
    [DocumentTypeFilter.CREDIT_NOTE]: 'CREDIT_NOTE',
    [DocumentTypeFilter.DEBIT_NOTE]: 'DEBIT_NOTE',
    [DocumentTypeFilter.ORDER]: 'ORDER',
    [DocumentTypeFilter.QUOTE]: 'QUOTE',
    [DocumentTypeFilter.REMITO]: 'REMITO',
  };

  /** Resumen liviano para el dashboard comercial: sólo agrega documentos del período. */
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
        document_types: { category: { in: ['INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE', 'QUOTE', 'ORDER', 'REMITO'] } },
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
      quoteCount: categories.QUOTE?.count ?? 0,
      orderCount: categories.ORDER?.count ?? 0,
      categories,
      daily: [...daily.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([date, counts]) => ({ date, counts })),
    };
  }

  // ---------------------------------------------------------------------------
  // RESUMEN GLOBAL DE VENTAS POR PRODUCTO
  // ---------------------------------------------------------------------------

  async getSalesSummary(
    query: QuerySalesDto,
  ): Promise<GlobalSalesSummaryResponseDto> {
    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        // Merge: preserva el filtro de código y agrega active: true
        document_types: {
          active: true,
          ...(whereCondition.document_types ?? {}),
        },
      },
      select: {
        date: true,
        currency_code: true,
        subtotal: true,
        exempt_amount: true,
        document_items: {
          where: { deleted_at: null },
          select: {
            quantity: true,
            price: true,
            products: {
              select: {
                id: true,
                sku: true,
                name: true,
                unit: { select: { name: true, symbol: true } },
                product_categories: {
                  where: { deleted_at: null },
                  select: {
                    categories: { select: { name: true, sort_order: true } },
                  },
                },
              },
            },
          },
        },
        document_taxes: { select: { tax_amount: true } },
        document_types: { select: { category: true } },
      },
    });

    const productTotals = new Map<string, ProductTotalAccumulator>();

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.category);
      const isInvoice = sign === 1;
      const documentSubtotal = Number(doc.subtotal);

      for (const item of doc.document_items) {
        if (!item.products) continue;

        const productId = item.products.id;
        const product = item.products;
        const currencyCode = doc.currency_code || 'ARS';
        const categories = product.product_categories
          .map((relation) => relation.categories)
          .filter((category): category is NonNullable<typeof category> => Boolean(category))
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((category) => category.name.trim())
          .filter(Boolean);
        const productCategory = categories.length
          ? [...new Set(categories)].join(' / ')
          : 'Sin categoría';
        const key = `${productId}:${currencyCode}`;
        // `document_items.price` guarda el subtotal del renglón (cantidad × precio unitario).
        // No volver a multiplicarlo por la cantidad: eso inflaba el reporte al cuadrado.
        const itemValue = Number(item.price);
        const proportion =
          documentSubtotal !== 0 ? itemValue / documentSubtotal : 0;
        const productValue = itemValue * sign;

        const current = productTotals.get(key) ?? {
          productId,
          productCode: product.sku || '',
          productName: product.name,
          productCategory,
          unitLabel: product.unit?.symbol || product.unit?.name || '',
          currencyCode,
          totalQuantity: 0,
          totalSales: 0,
          totalTaxes: 0,
          totalExempt: 0,
          transactionCount: 0,
          invoiceCount: 0,
          creditNoteCount: 0,
          firstSalesDate: null,
          lastSalesDate: null,
          salesValues: [] as number[],
        };

        const productTaxes = doc.document_taxes.reduce((sum, tax) => {
          return sum + Number(tax.tax_amount) * proportion * sign;
        }, 0);

        const productExempt =
          Number(doc.exempt_amount || 0) * proportion * sign;

        current.totalSales += productValue;
        current.totalQuantity += Number(item.quantity) * sign;
        current.totalTaxes += productTaxes;
        current.totalExempt += productExempt;
        current.transactionCount += 1;

        if (isInvoice) {
          current.invoiceCount += 1;
        } else {
          current.creditNoteCount += 1;
        }

        current.salesValues.push(productValue);

        const docDate = new Date(doc.date);
        if (!current.firstSalesDate || docDate < current.firstSalesDate) {
          current.firstSalesDate = docDate;
        }
        if (!current.lastSalesDate || docDate > current.lastSalesDate) {
          current.lastSalesDate = docDate;
        }

        productTotals.set(key, current);
      }
    }

    const products: ProductSummaryDto[] = Array.from(productTotals.entries())
      .map(([, data]) => ({
        productId: data.productId,
        productCode: data.productCode,
        productName: data.productName,
        productCategory: data.productCategory,
        unitLabel: data.unitLabel,
        currencyCode: data.currencyCode,
        totalQuantity: data.totalQuantity,
        totalSales: data.totalSales,
        totalTaxes: data.totalTaxes,
        totalExempt: data.totalExempt,
        transactionCount: data.transactionCount,
        invoiceCount: data.invoiceCount,
        creditNoteCount: data.creditNoteCount,
        firstSalesDate: data.firstSalesDate,
        lastSalesDate: data.lastSalesDate,
        avgPurchaseValue:
          data.salesValues.length > 0
            ? data.totalSales / data.salesValues.length
            : 0,
      }))
      .sort((a, b) => b.totalSales - a.totalSales);

    const globalTotal = products.reduce((sum, p) => sum + p.totalSales, 0);
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
      if (sign === -1) return sum + Number(doc.subtotal);
      return sum;
    }, 0);

    return {
      globalTotal,
      globalTaxes,
      globalExempt,
      globalSalesTotal: grandTotal,
      grandTotal,
      globalTransactionCount,
      negTotal,
      totalProducts: products.length,
      products,
    };
  }

  // ---------------------------------------------------------------------------
  // DETALLE DE VENTAS POR PRODUCTO
  // ---------------------------------------------------------------------------

  async getProductSalesDetail(
    id: string,
    query: QuerySalesDto,
  ): Promise<ProductSalesDetailResponseDto> {
    const product = await this.prisma.products.findUnique({ where: { id } });

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
          some: { product_id: id },
        },
      },
      include: {
        document_items: {
          where: { product_id: id },
          include: { products: true },
        },
        document_taxes: {
          include: { taxes: true },
        },
        business_parties: true,
        document_types: {
          include: { document_sequences: true },
        },
      },
    });

    const suppliersMap = new Map<string, SupplierDetailDto>();
    const documentTypesMap = new Map<string, DocumentTypeDetailDto>();
    const taxesMap = new Map<string, TaxDetailDto>();

    let totalGeneral = 0;
    let totalTaxes = 0;
    const movements: SalesMovementResponseDto[] = [];

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.category);

      const productTotal =
        doc.document_items.reduce((sum, item) => {
          return sum + Number(item.price);
        }, 0) * sign;

      for (const item of doc.document_items) {
        if (!item.products) continue;

        const itemValue = Number(item.price);
        const itemProportion =
          Number(doc.subtotal) !== 0 ? itemValue / Number(doc.subtotal) : 0;

        movements.push({
          documentId: doc.id,
          documentStatus: doc.status,
          documentCategory: doc.document_types.category,
          currencyCode: doc.currency_code || 'ARS',
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
          exempt_amount: Number(doc.exempt_amount || 0),
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

          transactionType: sign === 1 ? 'Venta' : 'Nota Crédito/Débito',
          adjustedValue:
            itemValue * sign - Number(doc.exempt_amount || 0) * itemProportion,
        });
      }

      totalGeneral += productTotal;

      const documentTotal = Number(doc.total) * sign;
      const productProportion =
        documentTotal !== 0 ? productTotal / documentTotal : 0;

      // Agrupación por cliente/proveedor
      if (doc.business_parties) {
        const supplierId = doc.business_parties.id;
        const existingSupplier = suppliersMap.get(supplierId);

        if (existingSupplier) {
          existingSupplier.totalBySupplier += productTotal;
          existingSupplier.transactionCount += 1;
          if (doc.date > existingSupplier.lastSalesDate) {
            existingSupplier.lastSalesDate = doc.date;
          }
        } else {
          suppliersMap.set(supplierId, {
            supplierId: parseInt(supplierId),
            supplierCode: doc.business_parties.id || '',
            supplierName: doc.business_parties.name,
            totalBySupplier: productTotal,
            transactionCount: 1,
            lastSalesDate: doc.date,
          });
        }
      }

      // Agrupación por tipo de documento
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

      // Agrupación por impuesto
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
      productId: product.id,
      productCode: product.sku || '',
      productName: product.name,
      productCategory: '',
      totalGeneral,
      totalTaxes,
      exempt_amount: documents.reduce(
        // ✅ agregá esto
        (sum, doc) => sum + Number(doc.exempt_amount || 0),
        0,
      ),
      suppliers: Array.from(suppliersMap.values()),
      documentTypes: Array.from(documentTypesMap.values()),
      taxes: Array.from(taxesMap.values()),
      movements,
    };
  }

  // ---------------------------------------------------------------------------
  // MOVIMIENTOS DE VENTA
  // ---------------------------------------------------------------------------

  async getSalesMovements(
    query: QuerySalesDto,
  ): Promise<SalesMovementResponseDto[]> {
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
          where: { product_id: query.productId },
          include: { products: true },
        },
        document_taxes: {
          include: { taxes: true },
        },
        business_parties: true,
        document_types: {
          include: { document_sequences: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    const movements: SalesMovementResponseDto[] = [];

    for (const doc of documents) {
      if (!doc.document_types) continue;

      const sign = this.getDocumentSign(doc.document_types.category);
      const transactionType = sign === 1 ? 'Venta' : 'Nota Crédito/Débito';

      for (const item of doc.document_items) {
        if (!item.products) continue;

        const itemValue = Number(item.price);

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
          exempt_amount: Number(doc.exempt_amount || 0),
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

  async getProductReportLines(
    id: string,
    query: QuerySalesDto,
  ): Promise<ProductReportLinesResponseDto> {
    const filters = Object.fromEntries(
      Object.entries(query).filter(([key]) => !['productId', 'page', 'pageSize'].includes(key)),
    ) as QuerySalesDto;
    const documentWhere = this.buildWhereCondition(filters);
    const where = {
      product_id: id,
      deleted_at: null,
      documents: {
        ...documentWhere,
        document_types: {
          active: true,
          ...(documentWhere.document_types ?? {}),
        },
      },
    };
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;

    const [total, items] = await Promise.all([
      this.prisma.document_items.count({ where }),
      this.prisma.document_items.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [{ documents: { date: 'desc' } }, { created_at: 'desc' }],
        select: {
          id: true,
          quantity: true,
          price: true,
          document_item_taxes: {
            where: { deleted_at: null },
            select: { tax_amount: true },
          },
          documents: {
            select: {
              id: true,
              number: true,
              date: true,
              status: true,
              ref: true,
              currency_code: true,
              subtotal: true,
              total_taxes: true,
              exempt_amount: true,
              document_types: {
                select: { code: true, description: true, category: true },
              },
              business_parties: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    return {
      page,
      pageSize,
      total,
      items: items.map((item) => {
        const document = item.documents;
        const sign = this.getDocumentSign(document.document_types?.category ?? null);
        const rawNet = Number(item.price);
        const proportion = Number(document.subtotal) !== 0
          ? rawNet / Number(document.subtotal)
          : 0;
        const rawTax = item.document_item_taxes.length
          ? item.document_item_taxes.reduce((sum, tax) => sum + Number(tax.tax_amount), 0)
          : Number(document.total_taxes) * proportion;
        const netAmount = rawNet * sign;
        const taxAmount = rawTax * sign;
        const totalAmount = netAmount + taxAmount + Number(document.exempt_amount ?? 0) * proportion * sign;

        return {
          id: item.id,
          documentId: document.id,
          documentDate: document.date,
          documentNumber: String(document.number),
          documentReference: document.ref || String(document.number),
          documentTypeCode: document.document_types?.code || '',
          documentTypeName: document.document_types?.description || 'Comprobante',
          documentCategory: document.document_types?.category ?? null,
          documentStatus: document.status,
          partyName: document.business_parties?.name || 'Sin tercero',
          currencyCode: document.currency_code || 'ARS',
          quantity: Number(item.quantity) * sign,
          unitPrice: Number(item.price),
          netAmount,
          taxAmount,
          totalAmount,
        };
      }),
    };
  }

  // ---------------------------------------------------------------------------
  // DOCUMENTOS DE VENTA
  // ---------------------------------------------------------------------------

  async getSalesDocuments(
    query: QuerySalesDto,
  ): Promise<GlobalSalesDocumentsResponseDto> {
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
          include: { taxes: true },
        },
        document_types: {
          include: { document_sequences: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    let grandTotal = 0;
    const SalesDocuments: SalesDocumentsResponseDto[] = [];

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

      SalesDocuments.push({
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
        transactionType: sign === 1 ? 'Venta' : 'Nota Crédito/Débito',
        adjustedValue: grossTotal,
      });
    }

    return { grandTotal, documents: SalesDocuments };
  }

  // ---------------------------------------------------------------------------
  // PRODUCTOS DISPONIBLES CON MOVIMIENTOS DE VENTA
  // ---------------------------------------------------------------------------

  async getAvailableProducts(): Promise<AvailableProductSalesResponseDto[]> {
    const products = await this.prisma.products.findMany({
      where: {
        document_items: {
          some: {
            documents: {
              document_types: {
                // Solo productos que aparecen en documentos de venta activos
                active: true,
                direction: 1,
              },
            },
          },
        },
      },
      select: { id: true, sku: true, name: true },
      orderBy: { name: 'asc' },
    });

    return products.map((p) => ({
      id: parseInt(p.id),
      code: p.sku || '',
      name: p.name,
    }));
  }

  // ---------------------------------------------------------------------------
  // VENTAS POR PUNTO DE VENTA
  // ---------------------------------------------------------------------------

  async getByPointOfSale(query: QuerySalesDto) {
    const whereCondition = this.buildWhereCondition(query);

    const documents = await this.prisma.documents.findMany({
      where: {
        ...whereCondition,
        document_types: {
          active: true,
          ...(whereCondition.document_types ?? {}),
        },
      },
      select: {
        total: true,
        currency_code: true,
        document_types: { select: { code: true, category: true, document_sequences: { select: { point_of_sale: true } } } },
        document_sequences: { select: { point_of_sale: true } },
      },
      orderBy: { date: 'desc' },
    });

    const pvMap = new Map<string, {
      point_of_sale: string;
      count: number;
      total: number;
      currency_code: string;
      docTypes: Map<string, { count: number; total: number }>;
    }>();

    for (const doc of documents) {
      // El PV del documento es la secuencia asignada al documento al momento
      // de emitirlo; la secuencia del tipo de documento es solo el fallback.
      const pv =
        doc.document_sequences?.point_of_sale ??
        doc.document_types?.document_sequences?.point_of_sale ??
        'S/PV';
      const currency = doc.currency_code?.trim().toUpperCase() || 'ARS';
      const key = `${pv}|${currency}`;
      const existing = pvMap.get(key);
      const docTypeCode = doc.document_types?.code ?? 'N/A';
      const amount = Number(doc.total) * this.getDocumentSign(doc.document_types?.category ?? null);

      if (existing) {
        existing.count += 1;
        existing.total += amount;
        const type = existing.docTypes.get(docTypeCode) ?? { count: 0, total: 0 };
        type.count += 1;
        type.total += amount;
        existing.docTypes.set(docTypeCode, type);
      } else {
        const docTypes = new Map<string, { count: number; total: number }>();
        docTypes.set(docTypeCode, { count: 1, total: amount });
        pvMap.set(key, {
          point_of_sale: pv,
          count: 1,
          total: amount,
          currency_code: currency,
          docTypes,
        });
      }
    }

    const results = Array.from(pvMap.values())
      .map((entry) => ({
        point_of_sale: entry.point_of_sale,
        count: entry.count,
        total: entry.total,
        currency_code: entry.currency_code,
        byDocumentType: Array.from(entry.docTypes.entries()).map(
          ([code, values]) => ({ code, ...values }),
        ),
      }))
      .sort((a, b) => a.point_of_sale.localeCompare(b.point_of_sale) || a.currency_code.localeCompare(b.currency_code));

    const totalsByCurrency = new Map<string, number>();
    for (const row of results) totalsByCurrency.set(row.currency_code, (totalsByCurrency.get(row.currency_code) ?? 0) + row.total);

    return {
      totalDocuments: results.reduce((sum, row) => sum + row.count, 0),
      totalPV: new Set(results.map((row) => row.point_of_sale)).size,
      totalsByCurrency: [...totalsByCurrency.entries()].map(([currency_code, total]) => ({ currency_code, total })),
      data: results,
    };
  }

  async getByPointOfSaleDocuments(query: QuerySalesDto) {
    if (!query.pointOfSale?.trim()) throw new NotFoundException('Indicá el punto de venta para consultar sus documentos.');
    const whereCondition = this.buildWhereCondition(query);
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 25;
    const pointOfSaleConditions = query.pointOfSale === 'S/PV'
      ? [{ document_sequence_id: null, document_types: { document_sequences: null } }]
      : [
          { document_sequences: { point_of_sale: query.pointOfSale } },
          { document_sequence_id: null, document_types: { document_sequences: { point_of_sale: query.pointOfSale } } },
        ];
    const where = {
      ...whereCondition,
      ...(query.currencyCode ? { currency_code: query.currencyCode } : {}),
      document_types: { active: true, ...(whereCondition.document_types ?? {}) },
      AND: [{
        OR: pointOfSaleConditions,
      }],
    };
    const [total, documents] = await Promise.all([
      this.prisma.documents.count({ where }),
      this.prisma.documents.findMany({
        where,
        orderBy: [{ date: 'desc' }, { id: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true, number: true, date: true, status: true, total: true, currency_code: true, ref: true,
          business_parties: { select: { name: true } },
          document_types: { select: { code: true, description: true, category: true, document_sequences: { select: { point_of_sale: true, prefix: true } } } },
          document_sequences: { select: { point_of_sale: true, prefix: true } },
          document_items: {
            where: { deleted_at: null },
            select: {
              id: true, quantity: true, price: true,
              products: { select: { name: true } },
              product_variants: { select: { name: true } },
            },
          },
        },
      }),
    ]);

    return {
      point_of_sale: query.pointOfSale,
      currency_code: query.currencyCode ?? null,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      documents: documents.map((document) => ({
        id: document.id,
        reference: `${(document.document_sequences?.prefix ?? document.document_types.document_sequences?.prefix) ? `${document.document_sequences?.prefix ?? document.document_types.document_sequences?.prefix} ` : ''}${(document.document_sequences?.point_of_sale ?? document.document_types.document_sequences?.point_of_sale) ? `${(document.document_sequences?.point_of_sale ?? document.document_types.document_sequences?.point_of_sale)?.padStart(4, '0')}-` : ''}${String(document.number).padStart(8, '0')}`,
        date: document.date,
        status: document.status,
        type_code: document.document_types.code,
        type_name: document.document_types.description,
        category: document.document_types.category,
        party_name: document.business_parties?.name ?? 'Sin tercero',
        currency_code: document.currency_code?.trim().toUpperCase() || 'ARS',
        total: Number(document.total) * this.getDocumentSign(document.document_types.category),
        total_quantity: document.document_items.reduce((sum, item) => sum + Number(item.quantity) * this.getDocumentSign(document.document_types.category), 0),
        items: document.document_items.map((item) => ({
          id: item.id,
          product_name: item.products?.name ?? item.product_variants?.name ?? 'Artículo sin producto',
          variant_name: item.product_variants?.name ?? null,
          quantity: Number(item.quantity) * this.getDocumentSign(document.document_types.category),
          total: Number(item.price) * this.getDocumentSign(document.document_types.category),
        })),
      })),
    };
  }

  // ---------------------------------------------------------------------------
  // HELPERS PRIVADOS
  // ---------------------------------------------------------------------------

  /**
   * Construye el objeto `where` para Prisma según los filtros del query.
   *
   * Siempre filtra por direction: 1 (ventas).
   * Si se pasa un `documentTypeFilter` específico, filtra por category.
   */
  private buildWhereCondition(query: QuerySalesDto): any {
    const where: any = { deleted_at: null };

    if (query.documentTypeFilter) {
      const category = this.categoryMap[query.documentTypeFilter];
      where.document_types = { direction: 1, category };
    } else {
      where.document_types = { direction: 1 };
    }

    if (query.startDate || query.endDate) {
      where.date = {};
      if (query.startDate) where.date.gte = new Date(query.startDate);
      if (query.endDate) where.date.lte = new Date(query.endDate);
    }

    if (query.supplierId) {
      where.party_id = query.supplierId;
    }

    if (query.productId) {
      where.document_items = {
        some: { product_id: query.productId.toString(), deleted_at: null },
      };
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
