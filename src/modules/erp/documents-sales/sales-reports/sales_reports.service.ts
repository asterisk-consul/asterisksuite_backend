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

/**
 * Acumulador interno para calcular totales por producto
 * en getSalesSummary antes de mapear al DTO final.
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
  };

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
      include: {
        document_items: {
          include: { products: true },
        },
        document_taxes: {
          include: { taxes: true },
        },
        business_parties: true,
        document_types: true,
      },
    });

    const productTotals = new Map<string, ProductTotalAccumulator>();

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

        const current = productTotals.get(productId) ?? {
          productId: parseInt(productId),
          productCode: product.sku || '',
          productName: product.name,
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

        productTotals.set(productId, current);
      }
    }

    const products: ProductSummaryDto[] = Array.from(productTotals.entries())
      .map(([productId, data]) => ({
        productId,
        productCode: data.productCode,
        productName: data.productName,
        productCategory: '',
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
          return sum + Number(item.quantity) * Number(item.price);
        }, 0) * sign;

      for (const item of doc.document_items) {
        if (!item.products) continue;

        const itemValue = Number(item.quantity) * Number(item.price);
        const itemProportion =
          Number(doc.subtotal) !== 0 ? itemValue / Number(doc.subtotal) : 0;

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
      include: {
        document_types: {
          include: { document_sequences: true },
        },
        document_sequences: true,
      },
      orderBy: { date: 'desc' },
    });

    const pvMap = new Map<string, {
      point_of_sale: string;
      count: number;
      total: number;
      docTypeCounts: Map<string, number>;
    }>();

    for (const doc of documents) {
      // El PV del documento es la secuencia asignada al documento al momento
      // de emitirlo; la secuencia del tipo de documento es solo el fallback.
      const pv =
        doc.document_sequences?.point_of_sale ??
        doc.document_types?.document_sequences?.point_of_sale ??
        'S/PV';
      const existing = pvMap.get(pv);

      if (existing) {
        existing.count += 1;
        existing.total += Number(doc.total);

        const docTypeCode = doc.document_types?.code ?? 'N/A';
        const prev = existing.docTypeCounts.get(docTypeCode) ?? 0;
        existing.docTypeCounts.set(docTypeCode, prev + 1);
      } else {
        const docTypeCounts = new Map<string, number>();
        docTypeCounts.set(doc.document_types?.code ?? 'N/A', 1);
        pvMap.set(pv, {
          point_of_sale: pv,
          count: 1,
          total: Number(doc.total),
          docTypeCounts,
        });
      }
    }

    const results = Array.from(pvMap.values())
      .map((entry) => ({
        point_of_sale: entry.point_of_sale,
        count: entry.count,
        total: entry.total,
        byDocumentType: Array.from(entry.docTypeCounts.entries()).map(
          ([code, cnt]) => ({ code, count: cnt }),
        ),
      }))
      .sort((a, b) => a.point_of_sale.localeCompare(b.point_of_sale));

    const grandTotal = results.reduce((sum, r) => sum + r.total, 0);
    const totalCount = results.reduce((sum, r) => sum + r.count, 0);

    return {
      grandTotal,
      totalCount,
      totalPV: results.length,
      data: results,
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
    const where: any = {};

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
        some: { product_id: query.productId.toString() },
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
