import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import type { ExtendedPrismaClient } from '@/prisma/prisma.service';
import type {
  FinancialResultsDetailDto,
  FinancialResultsDocumentItemsDto,
  FinancialResultsMetric,
  FinancialResultsSummaryDto,
} from './dto/financial-results-report.dto';

type MoneyByCurrency = Record<string, string>;
type CountByCurrency = Record<string, number>;
type FinancialResultsMetricKey = FinancialResultsMetric | 'sales_order_paid' | 'purchase_invoices_paid';
type Metrics = Record<FinancialResultsMetricKey, MoneyByCurrency>;
type CountKey = FinancialResultsMetric | 'orders_paid_full' | 'orders_paid_partial' | 'orders_unpaid' | 'purchase_invoices_paid_full' | 'purchase_invoices_paid_partial' | 'purchase_invoices_unpaid';
type Counts = Record<CountKey, CountByCurrency>;

type CompanyMembership = {
  role: string;
  company: { id: string; name: string; subdomain: string | null };
};

type SummaryCompany = {
  company_id: string;
  company_name: string;
  subdomain: string;
  metrics: Metrics;
  counts: Counts;
};

type MutableComposition = {
  key: string;
  account_id: string | null;
  account_code: string | null;
  account_name: string;
  label: string;
  metric_type: string | null;
  currency_code: string;
  amount: Prisma.Decimal;
  document_count: number;
};

type Allocation = {
  key: string;
  account_id: string | null;
  account_code: string | null;
  account_name: string;
  label: string;
  metric_type: string | null;
  currency_code: string;
  amount: Prisma.Decimal;
  item_count: number;
  origins: string[];
};

type DetailEntry = {
  id: string;
  document_id: string;
  document_category: string;
  document_label: string;
  document_reference: string;
  document_date: string;
  party_id: string | null;
  party_name: string;
  reference: string | null;
  description: string | null;
  status: number | string;
  currency_code: string;
  account_key: string;
  account_id: string | null;
  account_code: string | null;
  account_name: string;
  metric_type: string | null;
  origin: string;
  amount: string;
  document_total_amount: string;
  paid_amount: string | null;
  pending_amount: string | null;
  payment_state: 'UNPAID' | 'PARTIAL' | 'PAID' | null;
  item_count: number;
  expandable: boolean;
};

type DetailState = {
  composition: Map<string, MutableComposition>;
  items: DetailEntry[];
  total_rows: number;
  total_documents: number;
  total_amount: Prisma.Decimal;
};

const DOCUMENT_BATCH_SIZE = 100;
const DOCUMENT_DETAIL_SELECT = {
  id: true,
  party_id: true,
  number: true,
  date: true,
  total: true,
  paid_amount: true,
  currency_code: true,
  status: true,
  ref: true,
  descrip: true,
  business_parties: { select: { id: true, name: true } },
  document_types: { select: { category: true, description: true } },
  document_sequences: { select: { point_of_sale: true, prefix: true } },
  document_items: {
    where: { deleted_at: null },
    select: {
      id: true,
      quantity: true,
      price: true,
      currency_code: true,
      products: {
        select: {
          name: true,
          income_account: { select: { id: true, code: true, name: true } },
          expense_account: { select: { id: true, code: true, name: true } },
        },
      },
      product_variants: { select: { name: true } },
    },
  },
} satisfies Prisma.documentsSelect;
type DocumentDetailRecord = Prisma.documentsGetPayload<{ select: typeof DOCUMENT_DETAIL_SELECT }>;

const EMPTY_COUNTS = () => Object.fromEntries(
  ['sales_confirmed', 'purchase_invoices', 'purchase_invoices_pending', 'payments', 'expenses', 'other_outflows', 'outflows', 'collections', 'pending_orders', 'opening_balance_receivable', 'orders_paid_full', 'orders_paid_partial', 'orders_unpaid', 'purchase_invoices_paid_full', 'purchase_invoices_paid_partial', 'purchase_invoices_unpaid']
    .map(key => [key, {}]),
) as Counts;
const EMPTY_METRICS = () => Object.fromEntries(
  ['sales_confirmed', 'sales_order_paid', 'purchase_invoices', 'purchase_invoices_paid', 'purchase_invoices_pending', 'payments', 'expenses', 'other_outflows', 'outflows', 'collections', 'pending_orders', 'opening_balance_receivable']
    .map(key => [key, {}]),
) as Metrics;

@Injectable()
export class FinancialResultsReportService {
  constructor(private readonly db: PrismaService) {}

  async getSummary(dto: FinancialResultsSummaryDto, userId: string) {
    const range = this.parseRange(dto.date_from, dto.date_to);
    const memberships = await this.getMemberships(dto.company_ids, userId);
    const companies: SummaryCompany[] = [];

    // A propósito secuencial: el reporte puede abarcar muchas bases tenant, pero nunca abre todos los pools en paralelo.
    for (const membership of memberships) {
      const { id, name, subdomain } = membership.company;
      if (!subdomain) throw new ForbiddenException('Una o más empresas no tienen una base disponible para el reporte.');
      const summary = await this.db.withTemporaryTenantClient(`${subdomain}_db`, client =>
        this.buildCompanySummary(client, range, dto.ov_statuses),
      );
      companies.push({ company_id: id, company_name: name, subdomain, ...summary });
    }

    companies.sort((a, b) => a.company_name.localeCompare(b.company_name, 'es'));
    const totals = this.mergeCompanySummaries(companies);
    return {
      generated_at: new Date().toISOString(),
      period: { from: dto.date_from, to: dto.date_to },
      currency_note: 'Cada moneda se mantiene separada; el reporte no convierte ni mezcla importes.',
      criteria: {
        sales_confirmed: `Solo OV en los estados seleccionados (${(dto.ov_statuses ?? [1, 2, 3, 4, 5, 6, 7]).join(', ')}), por fecha de la orden. Las facturas asociadas no se suman ni se descuentan de este importe; cobrado y saldo reflejan el acumulado actual.`,
        purchase_invoices: 'Total de facturas de compra confirmadas (estado 2), por fecha del comprobante. El resumen también informa cuánto está pagado y cuánto queda pendiente según paid_amount actual.',
        purchase_invoices_pending: 'Saldo pendiente actual de las facturas de compra confirmadas del período: total menos paid_amount, sin permitir saldos negativos.',
        payments: 'Pagos pagados de tipo PAYMENT, por fecha efectiva del movimiento; se muestran separados al elegir el desglose de egresos.',
        expenses: 'Gastos pagados de tipo EXPENSE, por fecha efectiva del movimiento; se muestran separados al elegir el desglose de egresos.',
        other_outflows: 'Vales de empleados y obligaciones pagadas sin un movimiento PAYMENT asociado, evitando duplicaciones.',
        outflows: 'Egresos efectivos del período: PAYMENT, EXPENSE, vales de empleados y obligaciones pagadas sin PAYMENT asociado. Los pagos aplicados a facturas se cuentan una sola vez como movimientos.',
        collections: 'Cobros pagados (COLLECTION), presentados en una sección independiente.',
        pending_orders: 'Saldo positivo de las OV aprobadas y posteriores: total menos importe cobrado aplicado.',
        opening_balance_receivable: 'Saldos iniciales positivos de clientes, cargados hasta la fecha Hasta y aún pendientes al momento de consultar; se muestran por separado de las OV.',
      },
      companies,
      totals,
    };
  }

  async getDetail(dto: FinancialResultsDetailDto, userId: string) {
    const range = this.parseRange(dto.date_from, dto.date_to);
    const [membership] = await this.getMemberships([dto.company_id], userId);
    const detail = await this.db.withTemporaryTenantClient(`${membership.company.subdomain}_db`, client =>
      this.buildDetail(client, dto, range),
    );
    return {
      generated_at: new Date().toISOString(),
      period: { from: dto.date_from, to: dto.date_to },
      company: {
        id: membership.company.id,
        name: membership.company.name,
      },
      metric: dto.metric,
      currency_code: dto.currency_code ?? null,
      account_key: dto.account_key ?? null,
      page: dto.page,
      page_size: dto.page_size,
      ...detail,
    };
  }

  async getDocumentItems(dto: FinancialResultsDocumentItemsDto, userId: string) {
    const range = this.parseRange(dto.date_from, dto.date_to);
    const [membership] = await this.getMemberships([dto.company_id], userId);
    return this.db.withTemporaryTenantClient(`${membership.company.subdomain}_db`, async client => {
      const where = this.documentWhere(dto.metric, range, dto.ov_statuses);
      const document = await client.documents.findFirst({
        where: { id: dto.document_id, ...where },
        select: DOCUMENT_DETAIL_SELECT,
      });
      if (!document) throw new NotFoundException('El documento ya no pertenece al resultado seleccionado.');

      const total = new Prisma.Decimal(document.total ?? 0);
      const paid = this.appliedAmount(total, document.paid_amount);
      const pending = Prisma.Decimal.max(total.minus(paid), new Prisma.Decimal(0));
      if ((dto.metric === 'pending_orders' || dto.metric === 'purchase_invoices_pending' || dto.metric === 'opening_balance_receivable') && !pending.greaterThan(0)) {
        throw new NotFoundException(dto.metric === 'opening_balance_receivable'
          ? 'El saldo inicial ya no tiene importe pendiente.'
          : dto.metric === 'purchase_invoices_pending'
            ? 'La factura de compra ya no tiene saldo pendiente.'
            : 'La OV ya no tiene saldo pendiente en el período seleccionado.');
      }

      const currency = this.currency(document.currency_code);
      const items = dto.metric === 'pending_orders' || dto.metric === 'purchase_invoices_pending' || dto.metric === 'opening_balance_receivable'
        ? [{
            id: 'pending-balance',
            product_name: dto.metric === 'opening_balance_receivable'
              ? 'Saldo inicial pendiente (no distribuido por producto)'
              : dto.metric === 'purchase_invoices_pending'
                ? 'Saldo pendiente de factura de compra (no distribuido por partida)'
                : 'Saldo pendiente total (no distribuido por producto)',
            variant_name: null,
            quantity: '—',
            account_id: null,
            account_code: null,
            account_name: dto.metric === 'opening_balance_receivable' ? 'Saldo inicial por cobrar' : dto.metric === 'purchase_invoices_pending' ? 'Saldo de facturas de compra pendiente' : 'Saldo de OV confirmada por cobrar',
            amount: pending.toFixed(2),
            currency_code: currency,
            kind: 'DIFFERENCE' as const,
          }]
        : document.document_items.map(item => {
        const account = dto.metric === 'purchase_invoices' ? item.products?.expense_account : item.products?.income_account;
        return {
          id: item.id,
          product_name: item.products?.name ?? item.product_variants?.name ?? 'Artículo sin producto',
          variant_name: item.product_variants?.name ?? null,
          quantity: item.quantity.toString(),
          account_id: account?.id ?? null,
          account_code: account?.code ?? null,
          account_name: this.accountLabel(account),
          amount: item.price.toString(),
          currency_code: this.currency(item.currency_code ?? currency),
          kind: 'ITEM' as const,
        };
      });

      const lineTotal = items.reduce((sum, item) => sum.plus(item.amount), new Prisma.Decimal(0));
      const difference = total.minus(lineTotal);
      if (dto.metric !== 'pending_orders' && dto.metric !== 'purchase_invoices_pending' && dto.metric !== 'opening_balance_receivable' && !difference.isZero()) {
        items.push({
          id: 'document-difference',
          product_name: 'Impuestos / ajustes / sin ítems',
          variant_name: null,
          quantity: '—',
          account_id: null,
          account_code: null,
          account_name: 'Diferencia entre total documental y partidas activas',
          amount: difference.toFixed(2),
          currency_code: currency,
          kind: 'DIFFERENCE' as const,
        });
      }

      return {
        document_id: document.id,
        document_reference: this.documentReference(document),
        currency_code: currency,
        document_total_amount: total.toFixed(2),
        paid_amount: paid.toFixed(2),
        pending_amount: pending.toFixed(2),
        items,
      };
    });
  }

  private async buildCompanySummary(client: ExtendedPrismaClient, range: DateRange, ovStatuses?: number[]) {
    const metrics = EMPTY_METRICS();
    const counts = EMPTY_COUNTS();
    const [paymentGroups] = await Promise.all([
      client.payments.groupBy({
        by: ['currency_code', 'type'],
        where: this.paymentWhere(['PAYMENT', 'EXPENSE', 'COLLECTION'], range),
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.addPurchaseInvoiceTotals(client, range, metrics, counts),
      this.addOtherOutflowTotals(client, range, metrics.other_outflows, counts.other_outflows),
    ]);

    await this.addOrderTotals(client, range, metrics, counts, ovStatuses);
    await this.addOpeningBalanceReceivables(client, range, metrics.opening_balance_receivable, counts.opening_balance_receivable);

    for (const row of paymentGroups) {
      const currency = this.currency(row.currency_code);
      if (row.type === 'COLLECTION') {
        this.addMoney(metrics.collections, currency, row._sum.amount ?? 0);
        this.addCount(counts.collections, currency, row._count.id);
      } else if (row.type === 'PAYMENT') {
        this.addMoney(metrics.payments, currency, row._sum.amount ?? 0);
        this.addCount(counts.payments, currency, row._count.id);
      } else if (row.type === 'EXPENSE') {
        this.addMoney(metrics.expenses, currency, row._sum.amount ?? 0);
        this.addCount(counts.expenses, currency, row._count.id);
      }
    }
    metrics.outflows = this.sumMoneyMaps(metrics.payments, metrics.expenses, metrics.other_outflows);
    counts.outflows = this.sumCountMaps(counts.payments, counts.expenses, counts.other_outflows);
    return { metrics, counts };
  }

  private async addPurchaseInvoiceTotals(client: ExtendedPrismaClient, range: DateRange, metrics: Metrics, counts: Counts) {
    let cursor: string | undefined;
    while (true) {
      const rows = await client.documents.findMany({
        where: this.documentWhere('purchase_invoices', range),
        select: { id: true, total: true, paid_amount: true, currency_code: true },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (!rows.length) break;
      for (const row of rows) {
        const total = new Prisma.Decimal(row.total);
        const paid = this.appliedAmount(total, row.paid_amount);
        const pending = Prisma.Decimal.max(total.minus(paid), new Prisma.Decimal(0));
        const currency = this.currency(row.currency_code);
        this.addMoney(metrics.purchase_invoices, currency, total);
        this.addMoney(metrics.purchase_invoices_paid, currency, paid);
        this.addCount(counts.purchase_invoices, currency, 1);
        if (pending.greaterThan(0)) {
          this.addMoney(metrics.purchase_invoices_pending, currency, pending);
          this.addCount(counts.purchase_invoices_pending, currency, 1);
        }
        const state = this.paymentState(total, paid);
        const bucket = state === 'PAID' ? 'purchase_invoices_paid_full' : state === 'PARTIAL' ? 'purchase_invoices_paid_partial' : 'purchase_invoices_unpaid';
        this.addCount(counts[bucket], currency, 1);
      }
      cursor = rows[rows.length - 1]!.id;
      if (rows.length < DOCUMENT_BATCH_SIZE) break;
    }
  }

  private async addOtherOutflowTotals(
    client: ExtendedPrismaClient,
    range: DateRange,
    totals: MoneyByCurrency,
    counts: CountByCurrency,
  ) {
    let valeCursor: string | undefined;
    while (true) {
      const vales = await client.hr_vales.findMany({
        where: { deleted_at: null, status: 'PAID', party_type: 'EMPLOYEE', paid_at: { gte: range.from, lt: range.to } },
        select: { id: true, number: true, party_id: true, amount: true, currency_code: true },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(valeCursor ? { cursor: { id: valeCursor }, skip: 1 } : {}),
      });
      if (!vales.length) break;
      const documents = await client.documents.findMany({
        where: {
          deleted_at: null,
          document_types: { category: 'VALE' },
          OR: vales.map(vale => ({ party_id: vale.party_id, descrip: `Vale #${vale.number}` })),
        },
        select: { id: true, party_id: true, descrip: true },
      });
      const documentByVale = new Map(documents.map(document => [`${document.party_id}:${document.descrip}`, document.id]));
      const documentIds = [...new Set(documents.map(document => document.id))];
      const paidDocumentIds = documentIds.length
        ? new Set((await client.payment_documents.findMany({
            where: {
              document_id: { in: documentIds },
              deleted_at: null,
              payment: this.paymentWhere(['PAYMENT'], range),
            },
            select: { document_id: true },
          })).map(link => link.document_id))
        : new Set<string>();
      for (const vale of vales) {
        const documentId = documentByVale.get(`${vale.party_id}:Vale #${vale.number}`);
        if (documentId && paidDocumentIds.has(documentId)) continue;
        this.addMoney(totals, this.currency(vale.currency_code), vale.amount);
        this.addCount(counts, this.currency(vale.currency_code), 1);
      }
      valeCursor = vales[vales.length - 1]!.id;
      if (vales.length < DOCUMENT_BATCH_SIZE) break;
    }

    let obligationCursor: string | undefined;
    while (true) {
      const obligations = await client.treasury_obligations.findMany({
        where: {
          deleted_at: null,
          status: 'PAID',
          payment_id: null,
          paid_at: { gte: range.from, lt: range.to },
        },
        select: { id: true, amount: true, estimated_amount: true, currency_code: true },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(obligationCursor ? { cursor: { id: obligationCursor }, skip: 1 } : {}),
      });
      if (!obligations.length) break;
      for (const obligation of obligations) {
        this.addMoney(totals, this.currency(obligation.currency_code), obligation.amount ?? obligation.estimated_amount);
        this.addCount(counts, this.currency(obligation.currency_code), 1);
      }
      obligationCursor = obligations[obligations.length - 1]!.id;
      if (obligations.length < DOCUMENT_BATCH_SIZE) break;
    }
  }

  private async addOrderTotals(client: ExtendedPrismaClient, range: DateRange, metrics: Metrics, counts: Counts, ovStatuses?: number[]) {
    let cursor: string | undefined;
    while (true) {
      const rows = await client.documents.findMany({
        where: this.documentWhere('sales_confirmed', range, ovStatuses),
        select: { id: true, total: true, paid_amount: true, currency_code: true },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (!rows.length) break;
      for (const row of rows) {
        const total = new Prisma.Decimal(row.total);
        const paid = this.appliedAmount(total, row.paid_amount);
        const pending = Prisma.Decimal.max(total.minus(paid), new Prisma.Decimal(0));
        const currency = this.currency(row.currency_code);
        this.addMoney(metrics.sales_confirmed, currency, total);
        this.addMoney(metrics.sales_order_paid, currency, paid);
        this.addCount(counts.sales_confirmed, currency, 1);
        if (pending.greaterThan(0)) {
          this.addMoney(metrics.pending_orders, currency, pending);
          this.addCount(counts.pending_orders, currency, 1);
        }
        const state = this.paymentState(total, paid);
        const bucket = state === 'PAID' ? 'orders_paid_full' : state === 'PARTIAL' ? 'orders_paid_partial' : 'orders_unpaid';
        this.addCount(counts[bucket], currency, 1);
      }
      cursor = rows[rows.length - 1]!.id;
      if (rows.length < DOCUMENT_BATCH_SIZE) break;
    }
  }

  private appliedAmount(total: Prisma.Decimal, rawPaid: Prisma.Decimal | number | string | null | undefined) {
    return Prisma.Decimal.min(total, Prisma.Decimal.max(new Prisma.Decimal(rawPaid ?? 0), new Prisma.Decimal(0)));
  }

  private paymentState(total: Prisma.Decimal, paid: Prisma.Decimal): 'UNPAID' | 'PARTIAL' | 'PAID' {
    return paid.lessThanOrEqualTo(0) ? 'UNPAID' : paid.greaterThanOrEqualTo(total) ? 'PAID' : 'PARTIAL';
  }

  private async addOpeningBalanceReceivables(
    client: ExtendedPrismaClient,
    range: DateRange,
    totals: MoneyByCurrency,
    counts: CountByCurrency,
  ) {
    let cursor: string | undefined;
    while (true) {
      const rows = await client.documents.findMany({
        where: this.documentWhere('opening_balance_receivable', range),
        select: { id: true, total: true, paid_amount: true, currency_code: true },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (!rows.length) break;
      for (const row of rows) {
        const pending = new Prisma.Decimal(row.total).minus(row.paid_amount ?? 0);
        if (!pending.greaterThan(0)) continue;
        const currency = this.currency(row.currency_code);
        this.addMoney(totals, currency, pending);
        this.addCount(counts, currency, 1);
      }
      cursor = rows[rows.length - 1]!.id;
      if (rows.length < DOCUMENT_BATCH_SIZE) break;
    }
  }

  private mergeCompanySummaries(companies: SummaryCompany[]) {
    const metrics = EMPTY_METRICS();
    const counts = EMPTY_COUNTS();
    for (const company of companies) {
      for (const [metric, currencyAmounts] of Object.entries(company.metrics) as Array<[FinancialResultsMetricKey, MoneyByCurrency]>) {
        for (const [currency, amount] of Object.entries(currencyAmounts)) this.addMoney(metrics[metric], currency, amount);
      }
      for (const [metric, currencyCounts] of Object.entries(company.counts) as Array<[CountKey, CountByCurrency]>) {
        for (const [currency, count] of Object.entries(currencyCounts)) this.addCount(counts[metric], currency, count);
      }
    }
    return { metrics, counts };
  }

  private async buildDetail(client: ExtendedPrismaClient, dto: FinancialResultsDetailDto, range: DateRange) {
    const state: DetailState = {
      composition: new Map(),
      items: [],
      total_rows: 0,
      total_documents: 0,
      total_amount: new Prisma.Decimal(0),
    };
    const query = dto.search?.trim().toLocaleLowerCase('es-AR') ?? '';
    const offset = (dto.page - 1) * dto.page_size;
    const pageEnd = offset + dto.page_size;

    if (['payments', 'expenses', 'collections', 'outflows', 'other_outflows'].includes(dto.metric)) {
      await this.processPaymentDetail(client, dto, range, state, query, offset, pageEnd);
    } else {
      await this.processDocumentDetail(client, dto, range, state, query, offset, pageEnd);
    }

    return {
      composition: [...state.composition.values()]
        .sort((a, b) => a.currency_code.localeCompare(b.currency_code) || b.amount.comparedTo(a.amount))
        .map(row => ({ ...row, amount: row.amount.toFixed(2) })),
      items: state.items,
      total_rows: state.total_rows,
      total_documents: state.total_documents,
      total_amount: state.total_amount.toFixed(2),
    };
  }

  private async processDocumentDetail(
    client: ExtendedPrismaClient,
    dto: FinancialResultsDetailDto,
    range: DateRange,
    state: DetailState,
    query: string,
    offset: number,
    pageEnd: number,
  ) {
    let cursor: string | undefined;
    while (true) {
      const rows = await client.documents.findMany({
        where: this.documentWhere(dto.metric, range, dto.ov_statuses),
        select: DOCUMENT_DETAIL_SELECT,
        orderBy: [{ date: 'desc' }, { id: 'asc' }],
        take: DOCUMENT_BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (!rows.length) break;

      for (const document of rows) {
        if (['sales_confirmed', 'pending_orders', 'purchase_invoices', 'purchase_invoices_pending'].includes(dto.metric) && dto.payment_state && dto.payment_state !== 'ALL') {
          const total = new Prisma.Decimal(document.total);
          const paid = this.appliedAmount(total, document.paid_amount);
          const paymentState = this.paymentState(total, paid);
          if (paymentState !== dto.payment_state) continue;
        }
        const allocations = this.documentAllocations(document, dto.metric);
        if (dto.metric === 'purchase_invoices') {
          const documentFields = [
            this.documentReference(document), document.id, document.document_types.description,
            document.business_parties?.name, document.ref, document.descrip,
          ];
          const matchingForSearch = !query || this.matchesSearch(query, documentFields)
            ? allocations
            : allocations.filter(allocation => this.matchesSearch(query, [allocation.account_name, allocation.label, ...allocation.origins]));
          if (!matchingForSearch.length) continue;
          matchingForSearch.forEach(allocation => this.addComposition(state.composition, allocation));
          const matching = allocations.filter(allocation =>
            (!dto.currency_code || allocation.currency_code === this.currency(dto.currency_code))
            && (!dto.account_key || allocation.key === dto.account_key),
          );
          if (!matching.length) continue;
          const amount = matching.reduce((sum, allocation) => sum.plus(allocation.amount), new Prisma.Decimal(0));
          const originLabels = [...new Set(matching.flatMap(allocation => allocation.origins))];
          const consolidatedAllocation: Allocation = matching.length === 1
            ? matching[0]!
            : {
                key: dto.account_key ?? '__purchase_invoice_total__',
                account_id: null,
                account_code: null,
                account_name: dto.account_key ? matching[0]!.account_name : 'Varias cuentas',
                label: dto.account_key ? matching[0]!.label : 'Varias cuentas',
                metric_type: null,
                currency_code: matching[0]!.currency_code,
                amount,
                item_count: matching.reduce((sum, allocation) => sum + allocation.item_count, 0),
                origins: originLabels.slice(0, 3),
              };
          const entry = this.documentEntry(document, consolidatedAllocation, dto.metric);
          if (query && !this.matchesSearch(query, [
            entry.document_reference, entry.document_id, entry.document_label, entry.party_name,
            entry.reference, entry.description, entry.account_name, entry.origin,
            ...matching.flatMap(allocation => allocation.origins),
          ])) continue;
          this.appendDetailEntry(state, entry, offset, pageEnd);
          state.total_documents += 1;
          continue;
        }
        let documentMatched = false;
        for (const allocation of allocations) {
          const entry = this.documentEntry(document, allocation, dto.metric);
          if (query && !this.matchesSearch(query, [
            entry.document_reference, entry.document_id, entry.document_label, entry.party_name,
            entry.reference, entry.description, entry.account_name, entry.origin,
          ])) continue;
          this.addComposition(state.composition, allocation);
          if (dto.currency_code && allocation.currency_code !== this.currency(dto.currency_code)) continue;
          if (dto.account_key && allocation.key !== dto.account_key) continue;

          documentMatched = true;
          this.appendDetailEntry(state, entry, offset, pageEnd);
        }
        if (documentMatched) state.total_documents += 1;
      }

      cursor = rows[rows.length - 1]!.id;
      if (rows.length < DOCUMENT_BATCH_SIZE) break;
    }
  }

  private async processPaymentDetail(
    client: ExtendedPrismaClient,
    dto: FinancialResultsDetailDto,
    range: DateRange,
    state: DetailState,
    query: string,
    offset: number,
    pageEnd: number,
  ) {
    const types: Array<'PAYMENT' | 'EXPENSE' | 'COLLECTION'> = dto.metric === 'collections'
      ? ['COLLECTION']
      : dto.metric === 'expenses'
        ? ['EXPENSE']
        : dto.metric === 'payments'
          ? ['PAYMENT']
          : dto.metric === 'outflows'
            ? ['PAYMENT', 'EXPENSE']
            : [];
    let cursor: string | undefined;
    while (types.length) {
      const rows = await client.payments.findMany({
        where: this.paymentWhere([...types], range),
        select: {
          id: true, number: true, type: true, date: true, payment_date: true, amount: true,
          currency_code: true, description: true, reference: true, party_id: true, party: { select: { name: true } },
          withholding_remittance_id: true,
          account_id: true, account: { select: { id: true, code: true, name: true } },
          documents: {
            where: { deleted_at: null, document: { deleted_at: null } },
            select: { document: { select: { document_types: { select: { category: true, direction: true } } } } },
          },
        },
        orderBy: [{ date: 'desc' }, { id: 'asc' }],
        take: DOCUMENT_BATCH_SIZE,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      });
      if (!rows.length) break;

      for (const payment of rows) {
        const currency = this.currency(payment.currency_code);
        const linkedPurchaseInvoice = payment.documents.some(link => link.document.document_types.category === 'INVOICE' && link.document.document_types.direction === -1);
        const linkedVale = payment.documents.some(link => link.document.document_types.category === 'VALE');
        const typeLabel = payment.type === 'EXPENSE'
          ? 'Gasto · EXPENSE'
          : payment.type === 'COLLECTION'
            ? 'Cobro · COLLECTION'
            : linkedPurchaseInvoice
              ? 'Pago de factura · PAYMENT'
              : linkedVale
                ? 'Pago de vale · PAYMENT'
                : payment.withholding_remittance_id
                  ? 'Pago de obligación · PAYMENT'
                  : 'Pago · PAYMENT';
        const account = payment.account;
        const accountKey = `${payment.type}:${payment.account_id ?? '__unassigned__'}`;
        const accountName = account
          ? this.accountLabel(account)
          : payment.account_id ? `Cuenta histórica (${payment.account_id.slice(0, 8)})` : 'Sin cuenta contable asignada';
        const amount = new Prisma.Decimal(payment.amount);
        const composition: Allocation = {
          key: accountKey,
          account_id: payment.account_id,
          account_code: account?.code ?? null,
          account_name: account?.name ?? accountName,
          label: accountName,
          metric_type: typeLabel,
          currency_code: currency,
          amount,
          item_count: 1,
          origins: [payment.description || payment.reference || typeLabel],
        };
        const effectiveDate = payment.payment_date ?? payment.date;
        const entry: DetailEntry = {
          id: payment.id,
          document_id: payment.id,
          document_category: payment.type,
          document_label: `${typeLabel} #${payment.number}`,
          document_reference: `${typeLabel} #${payment.number}`,
          document_date: effectiveDate.toISOString().slice(0, 10),
          party_id: payment.party_id,
          party_name: payment.party?.name ?? 'Sin tercero',
          reference: payment.reference,
          description: payment.description,
          status: 'PAID',
          currency_code: currency,
          account_key: accountKey,
          account_id: payment.account_id,
          account_code: account?.code ?? null,
          account_name: accountName,
          metric_type: typeLabel,
          origin: payment.description || payment.reference || typeLabel,
          amount: amount.toFixed(2),
          document_total_amount: amount.toFixed(2),
          paid_amount: null,
          pending_amount: null,
          payment_state: null,
          item_count: 1,
          expandable: false,
        };
        if (query && !this.matchesSearch(query, [
          entry.document_reference, entry.document_id, entry.party_name, entry.reference,
          entry.description, entry.account_name, entry.origin,
        ])) continue;
        this.addComposition(state.composition, composition);
        if (dto.currency_code && currency !== this.currency(dto.currency_code)) continue;
        if (dto.account_key && accountKey !== dto.account_key) continue;
        this.appendDetailEntry(state, entry, offset, pageEnd);
        state.total_documents += 1;
      }

      cursor = rows[rows.length - 1]!.id;
      if (rows.length < DOCUMENT_BATCH_SIZE) break;
    }
    if (dto.metric === 'outflows' || dto.metric === 'other_outflows') {
      await this.processOtherOutflowDetail(client, dto, range, state, query, offset, pageEnd);
    }
  }

  private async processOtherOutflowDetail(
    client: ExtendedPrismaClient,
    dto: FinancialResultsDetailDto,
    range: DateRange,
    state: DetailState,
    query: string,
    offset: number,
    pageEnd: number,
  ) {
    let valeCursor: string | undefined;
    while (true) {
      const vales = await client.hr_vales.findMany({
        where: { deleted_at: null, status: 'PAID', party_type: 'EMPLOYEE', paid_at: { gte: range.from, lt: range.to } },
        select: {
          id: true, number: true, party_id: true, type: true, amount: true, currency_code: true,
          description: true, paid_at: true, party: { select: { name: true } },
        },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(valeCursor ? { cursor: { id: valeCursor }, skip: 1 } : {}),
      });
      if (!vales.length) break;
      const documents = await client.documents.findMany({
        where: {
          deleted_at: null,
          document_types: { category: 'VALE' },
          OR: vales.map(vale => ({ party_id: vale.party_id, descrip: `Vale #${vale.number}` })),
        },
        select: { id: true, party_id: true, descrip: true },
      });
      const documentByVale = new Map(documents.map(document => [`${document.party_id}:${document.descrip}`, document.id]));
      const documentIds = [...new Set(documents.map(document => document.id))];
      const paidDocumentIds = documentIds.length
        ? new Set((await client.payment_documents.findMany({
            where: {
              document_id: { in: documentIds },
              deleted_at: null,
              payment: this.paymentWhere(['PAYMENT'], range),
            },
            select: { document_id: true },
          })).map(link => link.document_id))
        : new Set<string>();

      for (const vale of vales) {
        const documentId = documentByVale.get(`${vale.party_id}:Vale #${vale.number}`);
        if (documentId && paidDocumentIds.has(documentId)) continue;
        const currency = this.currency(vale.currency_code);
        const amount = new Prisma.Decimal(vale.amount);
        const typeLabel = `Vale empleado · ${vale.type}`;
        const accountKey = 'HR_VALE:__unassigned__';
        const origin = vale.description || typeLabel;
        const allocation: Allocation = {
          key: accountKey,
          account_id: null,
          account_code: null,
          account_name: 'Vale de empleado · sin cuenta asignada',
          label: 'Vale de empleado · sin cuenta asignada',
          metric_type: typeLabel,
          currency_code: currency,
          amount,
          item_count: 1,
          origins: [origin],
        };
        const entry: DetailEntry = {
          id: `VALE:${vale.id}`,
          document_id: vale.id,
          document_category: 'HR_VALE',
          document_label: 'Vale de empleado',
          document_reference: `Vale #${vale.number}`,
          document_date: vale.paid_at!.toISOString().slice(0, 10),
          party_id: vale.party_id,
          party_name: vale.party?.name ?? 'Sin tercero',
          reference: `Vale #${vale.number}`,
          description: vale.description,
          status: 'PAID',
          currency_code: currency,
          account_key: accountKey,
          account_id: null,
          account_code: null,
          account_name: allocation.account_name,
          metric_type: typeLabel,
          origin,
          amount: amount.toFixed(2),
          document_total_amount: amount.toFixed(2),
          paid_amount: null,
          pending_amount: null,
          payment_state: null,
          item_count: 1,
          expandable: false,
        };
        if (query && !this.matchesSearch(query, [entry.document_reference, entry.document_id, entry.party_name, entry.reference, entry.description, entry.account_name, entry.origin])) continue;
        this.addComposition(state.composition, allocation);
        if (dto.currency_code && currency !== this.currency(dto.currency_code)) continue;
        if (dto.account_key && accountKey !== dto.account_key) continue;
        this.appendDetailEntry(state, entry, offset, pageEnd);
        state.total_documents += 1;
      }
      valeCursor = vales[vales.length - 1]!.id;
      if (vales.length < DOCUMENT_BATCH_SIZE) break;
    }

    let obligationCursor: string | undefined;
    while (true) {
      const obligations = await client.treasury_obligations.findMany({
        where: {
          deleted_at: null,
          status: 'PAID',
          payment_id: null,
          paid_at: { gte: range.from, lt: range.to },
        },
        select: {
          id: true, party_id: true, category: true, description: true, reference: true,
          amount: true, estimated_amount: true, currency_code: true, expense_account_id: true, paid_at: true,
        },
        orderBy: { id: 'asc' },
        take: DOCUMENT_BATCH_SIZE,
        ...(obligationCursor ? { cursor: { id: obligationCursor }, skip: 1 } : {}),
      });
      if (!obligations.length) break;
      const partyIds = [...new Set(obligations.map(row => row.party_id))];
      const accountIds = [...new Set(obligations.map(row => row.expense_account_id).filter((id): id is string => Boolean(id)))];
      const [parties, accounts] = await Promise.all([
        partyIds.length ? client.business_parties.findMany({ where: { id: { in: partyIds } }, select: { id: true, name: true } }) : Promise.resolve([]),
        accountIds.length ? client.accounts.findMany({ where: { id: { in: accountIds } }, select: { id: true, code: true, name: true } }) : Promise.resolve([]),
      ]);
      const partyById = new Map<string, string>(parties.map((party: any) => [party.id, party.name] as const));
      const accountById = new Map<string, { id: string; code: string; name: string }>(
        accounts.map((account: any) => [account.id, account] as const),
      );

      for (const obligation of obligations) {
        const currency = this.currency(obligation.currency_code);
        const amount = new Prisma.Decimal(obligation.amount ?? obligation.estimated_amount);
        const account = obligation.expense_account_id ? accountById.get(obligation.expense_account_id) : null;
        const typeLabel = `Obligación · ${obligation.category}`;
        const accountKey = `TREASURY_OBLIGATION:${obligation.expense_account_id ?? '__unassigned__'}`;
        const accountName = account ? this.accountLabel(account) : 'Sin cuenta contable asignada';
        const origin = obligation.description || typeLabel;
        const entry: DetailEntry = {
          id: `OBLIGATION:${obligation.id}`,
          document_id: obligation.id,
          document_category: 'TREASURY_OBLIGATION',
          document_label: 'Obligación pagada',
          document_reference: obligation.reference || `Obligación ${obligation.id.slice(0, 8)}`,
          document_date: obligation.paid_at!.toISOString().slice(0, 10),
          party_id: obligation.party_id,
          party_name: partyById.get(obligation.party_id) ?? 'Sin tercero',
          reference: obligation.reference,
          description: obligation.description,
          status: 'PAID',
          currency_code: currency,
          account_key: accountKey,
          account_id: obligation.expense_account_id,
          account_code: account?.code ?? null,
          account_name: accountName,
          metric_type: typeLabel,
          origin,
          amount: amount.toFixed(2),
          document_total_amount: amount.toFixed(2),
          paid_amount: null,
          pending_amount: null,
          payment_state: null,
          item_count: 1,
          expandable: false,
        };
        const allocation: Allocation = {
          key: accountKey,
          account_id: obligation.expense_account_id,
          account_code: account?.code ?? null,
          account_name: accountName,
          label: accountName,
          metric_type: typeLabel,
          currency_code: currency,
          amount,
          item_count: 1,
          origins: [origin],
        };
        if (query && !this.matchesSearch(query, [entry.document_reference, entry.document_id, entry.document_label, entry.party_name, entry.reference, entry.description, entry.account_name, entry.origin])) continue;
        this.addComposition(state.composition, allocation);
        if (dto.currency_code && currency !== this.currency(dto.currency_code)) continue;
        if (dto.account_key && accountKey !== dto.account_key) continue;
        this.appendDetailEntry(state, entry, offset, pageEnd);
        state.total_documents += 1;
      }
      obligationCursor = obligations[obligations.length - 1]!.id;
      if (obligations.length < DOCUMENT_BATCH_SIZE) break;
    }
  }

  private documentAllocations(document: DocumentDetailRecord, metric: FinancialResultsMetric): Allocation[] {
    const currency = this.currency(document.currency_code);
    if (metric === 'pending_orders' || metric === 'purchase_invoices_pending' || metric === 'opening_balance_receivable') {
      const total = new Prisma.Decimal(document.total);
      const paid = this.appliedAmount(total, document.paid_amount);
      const pending = Prisma.Decimal.max(total.minus(paid), new Prisma.Decimal(0));
      if (!pending.greaterThan(0)) return [];
      const isOpeningBalance = metric === 'opening_balance_receivable';
      const isPurchaseInvoice = metric === 'purchase_invoices_pending';
      const label = isOpeningBalance ? 'Saldo inicial por cobrar' : isPurchaseInvoice ? 'Saldo de factura de compra pendiente' : 'Saldo de OV confirmada por cobrar';
      return [{
        key: isOpeningBalance ? '__opening_balance_receivable__' : isPurchaseInvoice ? '__purchase_invoice_pending__' : '__pending_receivable__',
        account_id: null, account_code: null, account_name: label,
        label, metric_type: null, currency_code: currency, amount: pending,
        item_count: 0,
        origins: [isOpeningBalance ? 'Saldo inicial del cliente menos cobros y retenciones imputados' : isPurchaseInvoice ? 'Total de factura de compra menos paid_amount aplicado' : 'Total de la OV menos el importe cobrado registrado'],
      }];
    }

    const byAccount = new Map<string, Allocation>();
    let itemTotal = new Prisma.Decimal(0);
    for (const item of document.document_items) {
      const account = metric === 'purchase_invoices' ? item.products?.expense_account : item.products?.income_account;
      const key = account?.id ? `ACCOUNT:${account.id}` : '__unassigned__';
      const amount = new Prisma.Decimal(item.price);
      itemTotal = itemTotal.plus(amount);
      const row = byAccount.get(key) ?? {
        key,
        account_id: account?.id ?? null,
        account_code: account?.code ?? null,
        account_name: account?.name ?? 'Sin cuenta contable asignada',
        label: account ? this.accountLabel(account) : 'Sin cuenta contable asignada',
        metric_type: null,
        currency_code: currency,
        amount: new Prisma.Decimal(0),
        item_count: 0,
        origins: [],
      };
      row.amount = row.amount.plus(amount);
      row.item_count += 1;
      const origin = `${item.products?.name ?? 'Artículo sin producto'}${item.product_variants?.name ? ` · ${item.product_variants.name}` : ''}`;
      if (!row.origins.includes(origin) && row.origins.length < 3) row.origins.push(origin);
      byAccount.set(key, row);
    }

    const difference = new Prisma.Decimal(document.total).minus(itemTotal);
    if (!difference.isZero()) {
      byAccount.set('__document_difference__', {
        key: '__document_difference__', account_id: null, account_code: null,
        account_name: 'Impuestos / ajustes / sin ítems', label: 'Impuestos / ajustes / sin ítems', metric_type: null,
        currency_code: currency, amount: difference, item_count: 0,
        origins: ['Diferencia entre el total documental y las partidas activas'],
      });
    }

    return [...byAccount.values()];
  }

  private addComposition(target: Map<string, MutableComposition>, allocation: Allocation) {
    const key = `${allocation.currency_code}|${allocation.metric_type ?? ''}|${allocation.key}`;
    const current = target.get(key) ?? {
      key: allocation.key,
      account_id: allocation.account_id,
      account_code: allocation.account_code,
      account_name: allocation.account_name,
      label: allocation.label,
      metric_type: allocation.metric_type,
      currency_code: allocation.currency_code,
      amount: new Prisma.Decimal(0),
      document_count: 0,
    };
    current.amount = current.amount.plus(allocation.amount);
    // Cada documento ya llega agrupado por cuenta y tipo, así no hace falta retener
    // IDs en memoria para calcular la cantidad de documentos de la composición.
    current.document_count += 1;
    target.set(key, current);
  }

  private appendDetailEntry(state: DetailState, entry: DetailEntry, offset: number, pageEnd: number) {
    const currentIndex = state.total_rows;
    state.total_rows += 1;
    state.total_amount = state.total_amount.plus(entry.amount);
    if (currentIndex >= offset && currentIndex < pageEnd) state.items.push(entry);
  }

  private documentEntry(document: DocumentDetailRecord, allocation: Allocation, metric: FinancialResultsMetric): DetailEntry {
    const total = new Prisma.Decimal(document.total);
    const paid = this.appliedAmount(total, document.paid_amount);
    const pending = Prisma.Decimal.max(total.minus(paid), new Prisma.Decimal(0));
    const tracksPayment = ['sales_confirmed', 'pending_orders', 'purchase_invoices', 'purchase_invoices_pending'].includes(metric);
    return {
      id: `${document.id}:${allocation.key}`,
      document_id: document.id,
      document_category: document.document_types.category ?? 'ORDER',
      document_label: document.document_types.description,
      document_reference: this.documentReference(document),
      document_date: document.date.toISOString().slice(0, 10),
      party_id: document.party_id,
      party_name: document.business_parties?.name ?? 'Sin tercero',
      reference: document.ref,
      description: document.descrip,
      status: document.status,
      currency_code: allocation.currency_code,
      account_key: allocation.key,
      account_id: allocation.account_id,
      account_code: allocation.account_code,
      account_name: allocation.label,
      metric_type: allocation.metric_type,
      origin: allocation.origins.join(' · ') || (metric === 'pending_orders' ? 'Saldo pendiente de la OV' : metric === 'purchase_invoices_pending' ? 'Saldo pendiente de factura de compra' : metric === 'opening_balance_receivable' ? 'Saldo inicial pendiente de cobro' : 'Sin renglones activos'),
      amount: allocation.amount.toFixed(2),
      document_total_amount: total.toFixed(2),
      paid_amount: tracksPayment ? paid.toFixed(2) : null,
      pending_amount: tracksPayment ? pending.toFixed(2) : null,
      payment_state: tracksPayment ? this.paymentState(total, paid) : null,
      item_count: allocation.item_count,
      expandable: true,
    };
  }

  private async getMemberships(companyIds: string[], userId: string): Promise<CompanyMembership[]> {
    const uniqueCompanyIds = [...new Set(companyIds)];
    if (!uniqueCompanyIds.length || uniqueCompanyIds.length > 20) {
      throw new BadRequestException('Seleccioná entre 1 y 20 empresas.');
    }
    const memberships = await this.db.getDefaultClient().company_users.findMany({
      where: {
        user_id: userId,
        company_id: { in: uniqueCompanyIds },
        company: { deleted_at: null, subdomain: { not: null } },
      },
      select: { role: true, company: { select: { id: true, name: true, subdomain: true } } },
    });
    if (memberships.length !== uniqueCompanyIds.length || memberships.some(row => !row.company.subdomain)) {
      throw new ForbiddenException('Una o más empresas no están disponibles para este usuario.');
    }
    return memberships;
  }

  private parseRange(dateFrom: string, dateTo: string): DateRange {
    if (!this.isDateOnly(dateFrom) || !this.isDateOnly(dateTo) || dateFrom > dateTo) {
      throw new BadRequestException('Ingresá un período válido: Desde debe ser anterior o igual a Hasta.');
    }
    const from = new Date(`${dateFrom}T00:00:00.000Z`);
    const to = new Date(`${dateTo}T00:00:00.000Z`);
    to.setUTCDate(to.getUTCDate() + 1);
    return { from, to };
  }

  private isDateOnly(value: string) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }

  private documentWhere(metric: FinancialResultsMetric, range: DateRange, ovStatuses?: number[]): Prisma.documentsWhereInput {
    const common = { deleted_at: null, date: { gte: range.from, lt: range.to } };
    if (metric === 'sales_confirmed') {
      return { ...common, status: { in: ovStatuses ?? [1, 2, 3, 4, 5, 6, 7] }, document_types: { direction: 1, category: 'ORDER' } };
    }
    if (metric === 'purchase_invoices' || metric === 'purchase_invoices_pending') {
      return { ...common, status: 2, document_types: { direction: -1, category: 'INVOICE' } };
    }
    if (metric === 'pending_orders') {
      return { ...common, status: { in: ovStatuses ?? [1, 2, 3, 4, 5, 6, 7] }, document_types: { direction: 1, category: 'ORDER' } };
    }
    if (metric === 'opening_balance_receivable') {
      return {
        deleted_at: null,
        source: 'opening_balance',
        status: 2,
        total: { gt: 0 },
        date: { lt: range.to },
        document_types: { direction: 1, category: 'OPENING_BALANCE' },
      };
    }
    throw new BadRequestException('El tipo de detalle no corresponde a un documento.');
  }

  private paymentWhere(types: Array<'PAYMENT' | 'EXPENSE' | 'COLLECTION'>, range: DateRange) {
    return {
      deleted_at: null,
      status: 'PAID' as const,
      type: { in: [...types] },
      OR: [
        { payment_date: { gte: range.from, lt: range.to } },
        { payment_date: null, date: { gte: range.from, lt: range.to } },
      ],
    };
  }

  private sumMoneyMaps(...maps: MoneyByCurrency[]): MoneyByCurrency {
    const result: MoneyByCurrency = {};
    for (const values of maps) {
      for (const [currency, amount] of Object.entries(values)) this.addMoney(result, currency, amount);
    }
    return result;
  }

  private sumCountMaps(...maps: CountByCurrency[]): CountByCurrency {
    const result: CountByCurrency = {};
    for (const values of maps) {
      for (const [currency, count] of Object.entries(values)) result[currency] = (result[currency] ?? 0) + count;
    }
    return result;
  }

  private addMoney(target: MoneyByCurrency, currency: string, amount: Prisma.Decimal | number | string) {
    target[currency] = new Prisma.Decimal(target[currency] ?? 0).plus(amount).toFixed(2);
  }

  private addCount(target: CountByCurrency, currency: string, count: number) {
    target[currency] = (target[currency] ?? 0) + count;
  }

  private currency(value: string | null | undefined) {
    return value?.trim().toUpperCase() || 'ARS';
  }

  private accountLabel(account: { code: string; name: string } | null | undefined) {
    return account ? `${account.code} · ${account.name}` : 'Sin cuenta contable asignada';
  }

  private documentReference(document: { number: number; document_sequences: { point_of_sale: string; prefix: string | null } | null }) {
    const number = String(document.number).padStart(8, '0');
    const pointOfSale = document.document_sequences?.point_of_sale?.trim();
    const prefix = document.document_sequences?.prefix?.trim();
    return `${prefix ? `${prefix} ` : ''}${pointOfSale ? `${pointOfSale.padStart(4, '0')}-` : ''}${number}`;
  }

  private matchesSearch(query: string, values: Array<string | null | undefined>) {
    return values.some(value => value?.toLocaleLowerCase('es-AR').includes(query));
  }
}

type DateRange = { from: Date; to: Date };
