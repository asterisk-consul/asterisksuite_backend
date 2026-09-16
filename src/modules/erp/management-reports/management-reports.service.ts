import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { parseLocalDateTime } from '@/common/utils/dates';
import {
  ManagementPaymentState,
  ManagementProgressState,
  ManagementReportBasis,
  ManagementReportGroupBy,
  QueryManagementReportDto,
} from './dto/query-management-report.dto';

type ReportRow = {
  id: string;
  date: Date;
  label: string;
  party_id: string | null;
  party_name: string;
  seller_id: string | null;
  seller_name: string;
  currency_code: string;
  amount: number;
  converted_amount: number | null;
  paid_amount: number;
  pending_amount: number;
  payment_state: ManagementPaymentState;
  invoicing_state: ManagementProgressState;
  delivery_state: ManagementProgressState;
  product_lines: Array<{
    product_id: string;
    product_name: string;
    sku: string | null;
    quantity: number;
    converted_revenue: number | null;
  }>;
};

@Injectable()
export class ManagementReportsService {
  constructor(private readonly db: PrismaService) {}

  private get prisma() {
    return this.db.getClientForCurrentContext();
  }

  async getMetadata() {
    const [parties, sellers, products, pointsOfSale] = await Promise.all([
      this.prisma.business_parties.findMany({
        where: { active: true, deleted_at: null, documents: { some: { document_types: { direction: 1 } } } },
        select: { id: true, name: true, tax_id: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.employees.findMany({
        where: { is_active: true, is_salesperson: true, deleted_at: null },
        select: { id: true, first_name: true, last_name: true },
        orderBy: { first_name: 'asc' },
      }),
      this.prisma.products.findMany({
        where: { active: true, deleted_at: null, document_items: { some: { documents: { document_types: { direction: 1 } } } } },
        select: { id: true, name: true, sku: true },
        orderBy: { name: 'asc' },
      }),
      this.prisma.document_sequences.findMany({
        where: {
          active: true,
          deleted_at: null,
          document_type_sequences: { some: { document_types: { direction: 1 } } },
        },
        select: { id: true, name: true, point_of_sale: true },
        orderBy: { point_of_sale: 'asc' },
      }),
    ]);
    return { parties, sellers, products, points_of_sale: pointsOfSale };
  }

  async getReport(query: QueryManagementReportDto) {
    const rows = query.basis === ManagementReportBasis.COLLECTION
      ? await this.getCollections(query)
      : await this.getDocuments(query);
    const filtered = rows.filter((row) => {
      if (query.payment_state !== ManagementPaymentState.ALL && row.payment_state !== query.payment_state) return false;
      if (query.invoicing_state !== ManagementProgressState.ALL && row.invoicing_state !== query.invoicing_state) return false;
      if (query.delivery_state !== ManagementProgressState.ALL && row.delivery_state !== query.delivery_state) return false;
      return true;
    });

    const byCurrency: Record<string, { total: number; paid: number; pending: number; count: number }> = {};
    let convertedTotal = 0;
    let convertedPaid = 0;
    let convertedPending = 0;
    let missingExchangeRateCount = 0;
    for (const row of filtered) {
      const currency = row.currency_code || 'ARS';
      byCurrency[currency] ??= { total: 0, paid: 0, pending: 0, count: 0 };
      byCurrency[currency].total += row.amount;
      byCurrency[currency].paid += row.paid_amount;
      byCurrency[currency].pending += row.pending_amount;
      byCurrency[currency].count += 1;
      if (row.converted_amount == null) missingExchangeRateCount += 1;
      else {
        convertedTotal += row.converted_amount;
        const ratio = row.amount ? row.converted_amount / row.amount : 1;
        convertedPaid += row.paid_amount * ratio;
        convertedPending += row.pending_amount * ratio;
      }
    }

    const grouped = this.groupRows(filtered, query.group_by);
    return {
      basis: query.basis,
      filters: query,
      summary: {
        count: filtered.length,
        by_currency: byCurrency,
        converted_total: convertedTotal,
        converted_paid: convertedPaid,
        converted_pending: convertedPending,
        missing_exchange_rate_count: missingExchangeRateCount,
      },
      grouped,
      commercial_performance: query.basis === ManagementReportBasis.COLLECTION
        ? null
        : this.buildCommercialPerformance(filtered),
      rows: filtered.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 200),
    };
  }

  private async getDocuments(query: QueryManagementReportDto): Promise<ReportRow[]> {
    const categories = query.basis === ManagementReportBasis.SALES_ORDER
      ? ['ORDER']
      : ['INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE'];
    const documents = await this.prisma.documents.findMany({
      where: {
        deleted_at: null,
        date: {
          gte: parseLocalDateTime(query.date_from),
          lte: parseLocalDateTime(`${query.date_to}T23:59:59.999`),
        },
        status: { gte: 2, not: 3 },
        ...(query.party_id ? { party_id: query.party_id } : {}),
        ...(query.currency_code ? { currency_code: query.currency_code } : {}),
        ...(query.point_of_sale_id ? { document_sequence_id: query.point_of_sale_id } : {}),
        ...(query.product_id ? { document_items: { some: { product_id: query.product_id, deleted_at: null } } } : {}),
        document_types: { direction: 1, category: { in: categories } },
        ...(query.seller_id ? { orden_venta_doc: { seller_id: query.seller_id } } : {}),
      },
      include: {
        document_types: { select: { category: true, description: true } },
        business_parties: { select: { id: true, name: true } },
        orden_venta_doc: {
          select: {
            seller_id: true,
            seller: { select: { first_name: true, last_name: true } },
          },
        },
        parent_document: {
          select: {
            orden_venta_doc: {
              select: {
                seller_id: true,
                seller: { select: { first_name: true, last_name: true } },
              },
            },
          },
        },
        document_items: {
          where: { deleted_at: null },
          select: {
            product_id: true,
            quantity: true,
            quantity_invoiced: true,
            quantity_delivered: true,
            price: true,
            converted_price: true,
            products: { select: { name: true, sku: true } },
          },
        },
      },
      orderBy: { date: 'desc' },
    });

    return documents.map((doc) => {
      const isCreditNote = doc.document_types.category === 'CREDIT_NOTE';
      const sign = isCreditNote ? -1 : 1;
      const amount = Number(doc.total) * sign;
      const paid = isCreditNote
        ? amount
        : Math.min(Math.abs(amount), Number(doc.paid_amount ?? 0)) * sign;
      const pending = amount - paid;
      const totalQuantity = doc.document_items.reduce((sum, item) => sum + Number(item.quantity), 0);
      const invoicedQuantity = doc.document_items.reduce((sum, item) => sum + Number(item.quantity_invoiced ?? 0), 0);
      const deliveredQuantity = doc.document_items.reduce((sum, item) => sum + Number(item.quantity_delivered ?? 0), 0);
      const currencyCode = doc.currency_code ?? 'ARS';
      const saleData = doc.orden_venta_doc ?? doc.parent_document?.orden_venta_doc;
      return {
        id: doc.id,
        date: doc.date,
        label: `${doc.document_types.description} #${doc.number}`,
        party_id: doc.party_id,
        party_name: doc.business_parties?.name ?? 'Sin tercero',
        seller_id: saleData?.seller_id ?? null,
        seller_name: saleData?.seller
          ? `${saleData.seller.first_name} ${saleData.seller.last_name}`.trim()
          : 'Sin vendedor',
        currency_code: currencyCode,
        amount,
        converted_amount: doc.converted_total != null
          ? Number(doc.converted_total) * sign
          : currencyCode === 'ARS' ? amount : null,
        paid_amount: paid,
        pending_amount: pending,
        payment_state: isCreditNote
          ? ManagementPaymentState.PAID
          : this.paymentState(Math.abs(amount), Math.abs(paid)),
        invoicing_state: this.progressState(totalQuantity, invoicedQuantity),
        delivery_state: this.progressState(totalQuantity, deliveredQuantity),
        product_lines: doc.document_items
          .filter((item) => item.product_id && (!query.product_id || item.product_id === query.product_id))
          .map((item) => ({
            product_id: item.product_id!,
            product_name: item.products?.name ?? 'Producto sin nombre',
            sku: item.products?.sku ?? null,
            quantity: Number(item.quantity) * sign,
            converted_revenue: item.converted_price != null
              ? Number(item.converted_price) * sign
              : currencyCode === 'ARS' ? Number(item.price) * sign : null,
          })),
      };
    });
  }

  private async getCollections(query: QueryManagementReportDto): Promise<ReportRow[]> {
    const payments = await this.prisma.payments.findMany({
      where: {
        deleted_at: null,
        type: 'COLLECTION',
        status: { in: ['CONFIRMED', 'PAID'] },
        date: {
          gte: parseLocalDateTime(query.date_from),
          lte: parseLocalDateTime(`${query.date_to}T23:59:59.999`),
        },
        ...(query.party_id ? { party_id: query.party_id } : {}),
        ...(query.currency_code ? { currency_code: query.currency_code } : {}),
      },
      include: { party: { select: { id: true, name: true } } },
      orderBy: { date: 'desc' },
    });
    return payments.map((payment) => ({
      id: payment.id,
      date: payment.date,
      label: `Cobro #${payment.number}`,
      party_id: payment.party_id,
      party_name: payment.party?.name ?? 'Sin tercero',
      seller_id: null,
      seller_name: 'Sin vendedor',
      currency_code: payment.currency_code,
      amount: Number(payment.amount),
      converted_amount: payment.converted_amount != null
        ? Number(payment.converted_amount)
        : payment.currency_code === 'ARS' ? Number(payment.amount) : null,
      paid_amount: Number(payment.amount),
      pending_amount: 0,
      payment_state: ManagementPaymentState.PAID,
      invoicing_state: ManagementProgressState.ALL,
      delivery_state: ManagementProgressState.ALL,
      product_lines: [],
    }));
  }

  private buildCommercialPerformance(rows: ReportRow[]) {
    const products = new Map<string, {
      product_id: string; name: string; sku: string | null; quantity: number;
      revenue: number; document_ids: Set<string>; missing_exchange_rate_count: number;
    }>();
    const sellers = new Map<string, {
      seller_id: string | null; name: string; revenue: number; paid: number;
      quantity: number; document_count: number;
    }>();

    for (const row of rows) {
      const sellerKey = row.seller_id ?? 'none';
      const seller = sellers.get(sellerKey) ?? {
        seller_id: row.seller_id,
        name: row.seller_name,
        revenue: 0,
        paid: 0,
        quantity: 0,
        document_count: 0,
      };
      const conversionRatio = row.converted_amount != null && row.amount !== 0
        ? row.converted_amount / row.amount
        : row.currency_code === 'ARS' ? 1 : 0;
      seller.revenue += row.converted_amount ?? 0;
      seller.paid += row.paid_amount * conversionRatio;
      seller.quantity += row.product_lines.reduce((sum, line) => sum + line.quantity, 0);
      seller.document_count += 1;
      sellers.set(sellerKey, seller);

      for (const line of row.product_lines) {
        const product = products.get(line.product_id) ?? {
          product_id: line.product_id,
          name: line.product_name,
          sku: line.sku,
          quantity: 0,
          revenue: 0,
          document_ids: new Set<string>(),
          missing_exchange_rate_count: 0,
        };
        product.quantity += line.quantity;
        if (line.converted_revenue == null) product.missing_exchange_rate_count += 1;
        else product.revenue += line.converted_revenue;
        product.document_ids.add(row.id);
        products.set(line.product_id, product);
      }
    }

    const productRows = Array.from(products.values()).map(({ document_ids, ...product }) => ({
      ...product,
      document_count: document_ids.size,
    }));
    return {
      products_by_quantity: [...productRows].sort((a, b) => b.quantity - a.quantity).slice(0, 10),
      products_by_revenue: [...productRows].sort((a, b) => b.revenue - a.revenue).slice(0, 10),
      sellers: Array.from(sellers.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 10),
    };
  }

  private paymentState(total: number, paid: number): ManagementPaymentState {
    if (paid <= 0) return ManagementPaymentState.UNPAID;
    if (paid + 0.01 >= total) return ManagementPaymentState.PAID;
    return ManagementPaymentState.PARTIAL;
  }

  private progressState(total: number, completed: number): ManagementProgressState {
    if (completed <= 0) return ManagementProgressState.NONE;
    if (completed + 0.001 >= total) return ManagementProgressState.COMPLETE;
    return ManagementProgressState.PARTIAL;
  }

  private groupRows(rows: ReportRow[], groupBy: ManagementReportGroupBy) {
    const groups = new Map<string, { key: string; label: string; total: number; paid: number; pending: number; count: number }>();
    for (const row of rows) {
      const date = row.date.toISOString();
      const [key, label] = groupBy === ManagementReportGroupBy.DAY
        ? [date.slice(0, 10), date.slice(0, 10)]
        : groupBy === ManagementReportGroupBy.MONTH
          ? [date.slice(0, 7), date.slice(0, 7)]
          : groupBy === ManagementReportGroupBy.PARTY
            ? [row.party_id ?? 'none', row.party_name]
            : groupBy === ManagementReportGroupBy.SELLER
              ? [row.seller_id ?? 'none', row.seller_name]
              : [row.currency_code, row.currency_code];
      const group = groups.get(key) ?? { key, label, total: 0, paid: 0, pending: 0, count: 0 };
      group.total += row.converted_amount ?? row.amount;
      const conversionRatio = row.converted_amount != null && row.amount !== 0
        ? row.converted_amount / row.amount
        : 1;
      group.paid += row.paid_amount * conversionRatio;
      group.pending += row.pending_amount * conversionRatio;
      group.count += 1;
      groups.set(key, group);
    }
    return Array.from(groups.values()).sort((a, b) => a.key.localeCompare(b.key));
  }
}
