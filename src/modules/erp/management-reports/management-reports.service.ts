import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { ExtendedPrismaClient } from '@/prisma/prisma.service';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake';
import { join } from 'node:path';
import { parseLocalDateTime } from '@/common/utils/dates';
import {
  ManagementPaymentState,
  ManagementProgressState,
  ManagementReportBasis,
  ManagementReportGroupBy,
  QueryManagementReportDto,
} from './dto/query-management-report.dto';
import {
  ConsolidatedManagementReportDto,
  ConsolidatedReportView,
  ExportConsolidatedManagementReportDto,
} from './dto/consolidated-management-report.dto';

type CurrencyTotals = Record<string, number>;
type DetailAmountRow = { label: string; currency_code: string; amount: number; count: number; balance?: number };
type DocumentSummaryRow = { direction: 'SALE' | 'PURCHASE'; category: string; status: number; currency_code: string; amount: number; count: number };
type PartySummaryRow = { role: string; total: number; active: number; with_balance: number; currency_code: string; balance: number };
type PersonSummaryRow = { name: string; kind: 'EMPLOYEE' | 'PARTNER'; active: boolean; detail: string; currency_code: string; configured_amount: number; movements_amount: number; movements_count: number; pending_amount: number };
type FinancialAccountRow = { name: string; institution?: string; status: string; currency_code: string; current_balance: number; period_change: number; opening_amount: number; movement_count: number };
type InventoryOrderRow = { order_number: number; order_date: string; customer: string; product: string; quantity: number; status: string; confirmation_at: string | null; user: string };
type StockMovementSummaryRow = { product: string; movement_type: string; direction: string; quantity: number; count: number };
type ConsolidatedCompany = {
  company_id: string;
  company_name: string;
  subdomain: string;
  role: string;
  sales: CurrencyTotals;
  purchases: CurrencyTotals;
  collections: CurrencyTotals;
  payments: CurrencyTotals;
  receivables: CurrencyTotals;
  payables: CurrencyTotals;
  banks: CurrencyTotals;
  cash: CurrencyTotals;
  pending_checks: CurrencyTotals;
  counts: { sales: number; purchases: number; collections: number; payments: number; pending_checks: number };
  details: {
    narratives: string[];
    party_summary: PartySummaryRow[];
    collections_by_party: DetailAmountRow[];
    payments_by_party: DetailAmountRow[];
    customer_balances: DetailAmountRow[];
    supplier_balances: DetailAmountRow[];
    documents: DocumentSummaryRow[];
    obligations: DetailAmountRow[];
    hr_vales: DetailAmountRow[];
    employees: PersonSummaryRow[];
    partners: PersonSummaryRow[];
    bank_accounts: FinancialAccountRow[];
    cash_boxes: FinancialAccountRow[];
    payment_statuses: DetailAmountRow[];
    checks: DetailAmountRow[];
    treasury_movements: DetailAmountRow[];
    transfers: DetailAmountRow[];
    treasury_variation: DetailAmountRow[];
    stock_movements: StockMovementSummaryRow[];
    inventory_orders: InventoryOrderRow[];
    alerts: string[];
  };
};

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

  async getAvailableCompanies(userId: string) {
    const memberships = await this.db.getDefaultClient().company_users.findMany({
      where: { user_id: userId, company: { deleted_at: null, subdomain: { not: null } } },
      select: {
        role: true,
        company: { select: { id: true, name: true, subdomain: true } },
      },
      orderBy: { company: { name: 'asc' } },
    });
    return memberships.map(({ company, role }) => ({ ...company, role }));
  }

  async getConsolidatedReport(dto: ConsolidatedManagementReportDto, userId: string) {
    const from = parseLocalDateTime(dto.date_from);
    const to = parseLocalDateTime(`${dto.date_to}T23:59:59.999`);
    if (from > to) throw new BadRequestException('La fecha desde no puede ser posterior a la fecha hasta');

    const uniqueCompanyIds = [...new Set(dto.company_ids)];
    const memberships = await this.db.getDefaultClient().company_users.findMany({
      where: {
        user_id: userId,
        company_id: { in: uniqueCompanyIds },
        company: { deleted_at: null, subdomain: { not: null } },
      },
      select: { role: true, company: { select: { id: true, name: true, subdomain: true } } },
    });
    if (memberships.length !== uniqueCompanyIds.length) {
      throw new ForbiddenException('Una o más empresas no están disponibles para este usuario');
    }

    const companies: ConsolidatedCompany[] = [];
    // Secuencial a propósito: un reporte de muchas empresas no debe abrir todos los pools a la vez.
    for (const membership of memberships) {
      const subdomain = membership.company.subdomain!;
      const company = await this.db.withTemporaryTenantClient(`${subdomain}_db`, (client) =>
        this.buildCompanySnapshot(client, membership.company, membership.role, from, to),
      );
      companies.push(company);
    }
    companies.sort((a, b) => a.company_name.localeCompare(b.company_name, 'es'));

    return {
      generated_at: new Date().toISOString(),
      view: dto.view ?? 'consolidated',
      period: { from: dto.date_from, to: dto.date_to },
      currency_note: 'Los importes se presentan separados por moneda para evitar conversiones incorrectas.',
      companies,
      consolidated: this.consolidateCompanies(companies),
    };
  }

  async exportConsolidatedReport(dto: ExportConsolidatedManagementReportDto, userId: string) {
    const report = await this.getConsolidatedReport(dto, userId);
    const baseName = `reporte-${dto.view ?? 'consolidado'}-${dto.date_from}-${dto.date_to}`;
    if (dto.format === 'xlsx') {
      return { filename: `${baseName}.xlsx`, contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: this.toExcel(report) };
    }
    if (dto.format === 'csv') {
      return { filename: `${baseName}.csv`, contentType: 'text/csv; charset=utf-8', buffer: Buffer.from(`\uFEFF${this.toCsv(report)}`, 'utf8') };
    }
    return { filename: `${baseName}.pdf`, contentType: 'application/pdf', buffer: await this.toPdf(report) };
  }

  private async buildCompanySnapshot(
    client: ExtendedPrismaClient,
    company: { id: string; name: string; subdomain: string | null },
    role: string,
    from: Date,
    to: Date,
  ): Promise<ConsolidatedCompany> {
    const [documents, payments, accounts, banks, cash, checks, obligations, vales, transfers, bankMovements, cashMovements, stockMovements, parties, employees, partners] = await Promise.all([
      client.documents.findMany({
        where: { deleted_at: null, date: { gte: from, lte: to } },
        select: {
          id: true, number: true, date: true, total: true, converted_total: true, currency_code: true, status: true, created_by: true, updated_at: true,
          business_parties: { select: { name: true } },
          document_types: { select: { direction: true, category: true, description: true } },
          document_items: { where: { deleted_at: null }, select: { quantity: true, products: { select: { name: true } }, product_variants: { select: { name: true } } } },
        },
      }),
      client.payments.findMany({
        where: { deleted_at: null, date: { gte: from, lte: to } },
        select: { type: true, status: true, amount: true, converted_amount: true, currency_code: true, party: { select: { name: true } } },
      }),
      client.current_accounts.findMany({
        where: { deleted_at: null, active: true },
        select: { party_type: true, balance: true, party: { select: { name: true } } },
      }),
      client.bank_accounts.findMany({ where: { deleted_at: null, active: true }, select: { id: true, name: true, bank_name: true, account_type: true, currency_code: true, balance: true } }),
      client.cash_box_balances.findMany({ where: { deleted_at: null, cash_box: { deleted_at: null, active: true } }, select: { cash_box_id: true, currency_code: true, balance: true, cash_box: { select: { name: true, status: true, type: true } } } }),
      client.checks.findMany({
        // En cartera = todo cheque todavía no cobrado, rechazado ni anulado.
        where: { deleted_at: null, status: { notIn: ['CLEARED', 'BOUNCED', 'CANCELLED'] } },
        select: { status: true, is_own: true, bank_name: true, currency_code: true, available_amount: true, amount: true },
      }),
      client.treasury_obligations.findMany({
        where: { deleted_at: null, due_date: { gte: from, lte: to } },
        select: { status: true, category: true, amount: true, estimated_amount: true, currency_code: true },
      }),
      client.hr_vales.findMany({
        where: { deleted_at: null, date: { gte: from, lte: to } },
        select: { party_id: true, status: true, type: true, party_type: true, amount: true, converted_amount: true, currency_code: true, party: { select: { name: true } } },
      }),
      client.cash_box_transfers.findMany({
        where: { deleted_at: null, created_at: { gte: from, lte: to } },
        select: { status: true, transfer_type: true, amount: true, converted_amount: true, currency_code: true },
      }),
      client.bank_account_movements.findMany({
        where: { deleted_at: null, date: { gte: from, lte: to } },
        select: { bank_account_id: true, type: true, currency_code: true, balance_before: true, balance_after: true },
      }),
      client.cash_box_movements.findMany({
        where: { deleted_at: null, date: { gte: from, lte: to } },
        select: { cash_box_id: true, type: true, currency_code: true, balance_before: true, balance_after: true },
      }),
      client.warehouse_stock_movements.findMany({
        where: { deleted_at: null, created_at: { gte: from, lte: to } },
        select: { direction: true, movement_type: true, quantity: true, products: { select: { name: true } } },
      }),
      client.business_parties.findMany({
        where: { deleted_at: null },
        select: { id: true, type: true, active: true, roles: { where: { active: true }, select: { role: true } } },
      }),
      client.employees.findMany({
        where: { deleted_at: null },
        select: { party_id: true, first_name: true, last_name: true, position: true, department: true, salary: true, currency_code: true, is_active: true },
        orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
      }),
      client.partners.findMany({
        where: { deleted_at: null },
        select: { party_id: true, first_name: true, last_name: true, share_percentage: true, capital_contributed: true, is_active: true },
        orderBy: [{ last_name: 'asc' }, { first_name: 'asc' }],
      }),
    ]);

    const inventoryDocuments = documents.filter((document) => document.document_types.direction === 1 && document.document_types.category === 'ORDER');
    const inventoryAudits = inventoryDocuments.length ? await client.audit_logs.findMany({
      where: { table_name: 'documents', record_id: { in: inventoryDocuments.map((document) => document.id) }, action: 'UPDATE' },
      select: { record_id: true, old_data: true, new_data: true, changed_at: true, changed_by: true }, orderBy: { changed_at: 'asc' },
    }) : [];
    const confirmationAudits = new Map<string, typeof inventoryAudits[number]>();
    for (const audit of inventoryAudits) {
      const oldStatus = Number((audit.old_data as Record<string, unknown> | null)?.status ?? 0);
      const newStatus = Number((audit.new_data as Record<string, unknown> | null)?.status ?? 0);
      if (!confirmationAudits.has(audit.record_id) && oldStatus < 2 && newStatus >= 2 && newStatus !== 3) confirmationAudits.set(audit.record_id, audit);
    }
    const userIds = [...new Set([
      ...inventoryDocuments.map((document) => document.created_by),
      ...[...confirmationAudits.values()].map((audit) => audit.changed_by),
    ].filter((id): id is string => Boolean(id)))];
    const creators = userIds.length
      ? await this.db.getDefaultClient().users.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true, email: true } })
      : [];
    const creatorNames = new Map(creators.map((creator) => [creator.id, creator.name || creator.email]));
    const inventoryOrders: InventoryOrderRow[] = inventoryDocuments.flatMap((document) => document.document_items.map((item) => ({
      order_number: document.number,
      order_date: document.date.toISOString().slice(0, 10),
      customer: document.business_parties?.name ?? 'Sin cliente',
      product: `${item.products?.name ?? 'Artículo sin producto'}${item.product_variants?.name ? ` · ${item.product_variants.name}` : ''}`,
      quantity: Number(item.quantity),
      status: this.documentStatusLabel('ORDER', document.status),
      confirmation_at: document.status === 0 ? null : confirmationAudits.get(document.id)?.changed_at.toISOString() ?? document.updated_at?.toISOString() ?? null,
      user: creatorNames.get(confirmationAudits.get(document.id)?.changed_by ?? document.created_by ?? '') ?? 'Usuario no disponible',
    })));

    const sales: CurrencyTotals = {};
    const purchases: CurrencyTotals = {};
    let salesCount = 0;
    let purchasesCount = 0;
    const effectiveDocuments = documents.filter((document) => document.status >= 2 && document.status !== 3 && ['INVOICE', 'CREDIT_NOTE', 'DEBIT_NOTE'].includes(document.document_types.category));
    for (const document of effectiveDocuments) {
      const sign = document.document_types.category === 'CREDIT_NOTE' ? -1 : 1;
      const currency = document.converted_total != null ? 'ARS' : (document.currency_code ?? 'ARS');
      const amount = Number(document.converted_total ?? document.total) * sign;
      if (document.document_types.direction === 1) { this.addCurrency(sales, currency, amount); salesCount += 1; }
      else { this.addCurrency(purchases, currency, amount); purchasesCount += 1; }
    }

    const collections: CurrencyTotals = {};
    const outgoingPayments: CurrencyTotals = {};
    let collectionCount = 0;
    let paymentCount = 0;
    const effectivePayments = payments.filter((payment) => ['CONFIRMED', 'PAID'].includes(payment.status));
    for (const payment of effectivePayments) {
      const currency = payment.converted_amount != null ? 'ARS' : payment.currency_code;
      const amount = Number(payment.converted_amount ?? payment.amount);
      if (payment.type === 'COLLECTION') { this.addCurrency(collections, currency, amount); collectionCount += 1; }
      else { this.addCurrency(outgoingPayments, currency, amount); paymentCount += 1; }
    }

    const receivables: CurrencyTotals = {};
    const payables: CurrencyTotals = {};
    for (const account of accounts) {
      const target = account.party_type === 'CUSTOMER' ? receivables : payables;
      this.addCurrency(target, 'ARS', Number(account.balance));
    }
    const bankTotals: CurrencyTotals = {};
    for (const bank of banks) this.addCurrency(bankTotals, bank.currency_code, Number(bank.balance));
    const cashTotals: CurrencyTotals = {};
    for (const balance of cash) this.addCurrency(cashTotals, balance.currency_code, Number(balance.balance));
    const checkTotals: CurrencyTotals = {};
    for (const check of checks) this.addCurrency(checkTotals, check.currency_code, Number(check.available_amount ?? check.amount));

    const groupDetails = (rows: any[], key: (row: any) => string, values: (row: any) => { currency: string; amount: number; balance?: number }) => {
      const grouped = new Map<string, DetailAmountRow>();
      for (const row of rows) {
        const value = values(row);
        const mapKey = `${key(row)}|${value.currency}`;
        const current = grouped.get(mapKey) ?? { label: key(row), currency_code: value.currency, amount: 0, count: 0, balance: value.balance };
        current.amount += value.amount;
        current.count += 1;
        if (value.balance !== undefined) current.balance = value.balance;
        grouped.set(mapKey, current);
      }
      return [...grouped.values()].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    };
    const accountRows = groupDetails(accounts, (row) => row.party.name, (row) => ({ currency: 'ARS', amount: Number(row.balance), balance: Number(row.balance) }));
    const documentGroups = new Map<string, DocumentSummaryRow>();
    for (const document of documents) {
      const currency = document.converted_total != null ? 'ARS' : (document.currency_code ?? 'ARS');
      const direction = document.document_types.direction === 1 ? 'SALE' as const : 'PURCHASE' as const;
      const key = `${direction}|${document.document_types.category}|${document.status}|${currency}`;
      const row = documentGroups.get(key) ?? { direction, category: document.document_types.category, status: document.status, currency_code: currency, amount: 0, count: 0 };
      row.amount += Number(document.converted_total ?? document.total);
      row.count += 1;
      documentGroups.set(key, row);
    }
    const stockMovementGroups = new Map<string, StockMovementSummaryRow>();
    for (const movement of stockMovements) {
      const product = movement.products.name;
      const movementType = this.codeLabel(movement.movement_type);
      const direction = this.codeLabel(movement.direction);
      const key = `${product}|${movementType}|${direction}`;
      const row = stockMovementGroups.get(key) ?? { product, movement_type: movementType, direction, quantity: 0, count: 0 };
      row.quantity += Number(movement.quantity) * (movement.direction === 'OUT' ? -1 : 1);
      row.count += 1;
      stockMovementGroups.set(key, row);
    }
    const treasuryVariation: DetailAmountRow[] = [];
    for (const [kind, movements] of [['Bancos', bankMovements], ['Cajas', cashMovements]] as const) {
      const totals: CurrencyTotals = {};
      const opening: CurrencyTotals = {};
      for (const movement of movements) {
        const delta = Number(movement.balance_after) - Number(movement.balance_before);
        this.addCurrency(movement.type === 'OPENING_BALANCE' ? opening : totals, movement.currency_code, delta);
      }
      for (const [currency, amount] of Object.entries(totals)) treasuryVariation.push({ label: `${kind}: variación sin aperturas`, currency_code: currency, amount, count: movements.length });
      for (const [currency, amount] of Object.entries(opening)) treasuryVariation.push({ label: `${kind}: aperturas`, currency_code: currency, amount, count: 0 });
    }

    const partyRoleMap = new Map<string, Set<string>>();
    for (const party of parties) {
      const roles = new Set<string>([party.type, ...party.roles.map((item) => item.role)]);
      partyRoleMap.set(party.id, roles);
    }
    const partySummary: PartySummaryRow[] = [];
    for (const role of ['CUSTOMER', 'SUPPLIER', 'EMPLOYEE', 'PARTNER', 'TAX_AUTHORITY', 'UTILITY', 'SERVICE_PROVIDER']) {
      const matching = parties.filter((party) => partyRoleMap.get(party.id)?.has(role));
      const matchingAccounts = accounts.filter((account) => account.party_type === role);
      if (!matching.length && !matchingAccounts.length) continue;
      partySummary.push({
        role,
        total: matching.length,
        active: matching.filter((party) => party.active).length,
        with_balance: matchingAccounts.filter((account) => Number(account.balance) !== 0).length,
        currency_code: 'ARS',
        balance: matchingAccounts.reduce((sum, account) => sum + Number(account.balance), 0),
      });
    }

    const movementStats = (rows: Array<{ type: string; currency_code: string; balance_before: unknown; balance_after: unknown }>) => {
      const byCurrency = new Map<string, { change: number; opening: number; count: number }>();
      for (const movement of rows) {
        const current = byCurrency.get(movement.currency_code) ?? { change: 0, opening: 0, count: 0 };
        const delta = Number(movement.balance_after) - Number(movement.balance_before);
        if (movement.type === 'OPENING_BALANCE') current.opening += delta;
        else current.change += delta;
        current.count += 1;
        byCurrency.set(movement.currency_code, current);
      }
      return byCurrency;
    };
    const bankAccountRows: FinancialAccountRow[] = banks.map((account) => {
      const stats = movementStats(bankMovements.filter((movement) => movement.bank_account_id === account.id)).get(account.currency_code) ?? { change: 0, opening: 0, count: 0 };
      return { name: account.name, institution: `${account.bank_name} · ${this.codeLabel(account.account_type)}`, status: 'Activa', currency_code: account.currency_code, current_balance: Number(account.balance), period_change: stats.change, opening_amount: stats.opening, movement_count: stats.count };
    });
    const cashBoxRows: FinancialAccountRow[] = cash.map((balance) => {
      const stats = movementStats(cashMovements.filter((movement) => movement.cash_box_id === balance.cash_box_id)).get(balance.currency_code) ?? { change: 0, opening: 0, count: 0 };
      return { name: balance.cash_box.name, institution: this.codeLabel(balance.cash_box.type), status: this.codeLabel(balance.cash_box.status), currency_code: balance.currency_code, current_balance: Number(balance.balance), period_change: stats.change, opening_amount: stats.opening, movement_count: stats.count };
    });
    const valeStats = (partyId: string | null, partyType: string) => {
      const rows = vales.filter((vale) => vale.party_id === partyId && vale.party_type === partyType);
      return {
        amount: rows.reduce((sum, vale) => sum + Number(vale.converted_amount ?? vale.amount), 0),
        count: rows.length,
        pending: rows.filter((vale) => !['PAID', 'CANCELLED'].includes(vale.status)).reduce((sum, vale) => sum + Number(vale.converted_amount ?? vale.amount), 0),
      };
    };
    const employeeRows: PersonSummaryRow[] = employees.map((employee) => {
      const stats = valeStats(employee.party_id, 'EMPLOYEE');
      return { name: `${employee.first_name} ${employee.last_name}`.trim(), kind: 'EMPLOYEE', active: employee.is_active, detail: [employee.position, employee.department].filter(Boolean).join(' · ') || 'Sin puesto o área informada', currency_code: employee.currency_code, configured_amount: Number(employee.salary ?? 0), movements_amount: stats.amount, movements_count: stats.count, pending_amount: stats.pending };
    });
    const partnerRows: PersonSummaryRow[] = partners.map((partner) => {
      const stats = valeStats(partner.party_id, 'PARTNER');
      const participation = partner.share_percentage == null ? 'Participación sin informar' : `Participación ${Number(partner.share_percentage)}%`;
      return { name: `${partner.first_name} ${partner.last_name}`.trim(), kind: 'PARTNER', active: partner.is_active, detail: participation, currency_code: 'ARS', configured_amount: Number(partner.capital_contributed ?? 0), movements_amount: stats.amount, movements_count: stats.count, pending_amount: stats.pending };
    });
    const alerts: string[] = [];
    const draftDocuments = documents.filter((document) => document.status === 0);
    const draftPayments = payments.filter((payment) => payment.status === 'DRAFT');
    const pendingTransfers = transfers.filter((transfer) => transfer.status.toLowerCase() === 'pending');
    const reviewObligations = obligations.filter((obligation) => !['PAID', 'CANCELLED'].includes(obligation.status));
    if (draftDocuments.length) alerts.push(`${draftDocuments.length} documentos en borrador requieren revisión.`);
    if (draftPayments.length) alerts.push(`${draftPayments.length} pagos o cobros permanecen en borrador.`);
    if (pendingTransfers.length) alerts.push(`${pendingTransfers.length} transferencias están pendientes de ejecución.`);
    if (reviewObligations.length) alerts.push(`${reviewObligations.length} obligaciones del período todavía no están pagadas.`);

    const narratives = [
      `Se registraron ${collectionCount} cobros y ${paymentCount} pagos efectivos dentro del período. Los movimientos anulados o en borrador se exponen por separado y no integran esos totales.`,
      `La empresa posee ${partySummary.find((row) => row.role === 'CUSTOMER')?.total ?? 0} clientes y ${partySummary.find((row) => row.role === 'SUPPLIER')?.total ?? 0} proveedores registrados; las cuentas con saldo se detallan debajo.`,
      `Tesorería informa ${bankAccountRows.length} cuentas bancarias, ${cashBoxRows.length} saldos de caja y ${checks.length} cheques todavía pendientes al momento de emitir el informe.`,
      `RR. HH. contiene ${employeeRows.length} empleados y ${partnerRows.length} socios. Los importes de vales corresponden al período seleccionado; sueldo, capital y participación son datos configurados actuales.`,
      'Los saldos actuales y los movimientos del período son magnitudes distintas. No deben sumarse entre sí ni interpretarse automáticamente como resultado económico.',
    ];

    return {
      company_id: company.id,
      company_name: company.name,
      subdomain: company.subdomain!,
      role,
      sales,
      purchases,
      collections,
      payments: outgoingPayments,
      receivables,
      payables,
      banks: bankTotals,
      cash: cashTotals,
      pending_checks: checkTotals,
      counts: { sales: salesCount, purchases: purchasesCount, collections: collectionCount, payments: paymentCount, pending_checks: checks.length },
      details: {
        narratives,
        party_summary: partySummary,
        collections_by_party: groupDetails(effectivePayments.filter((row) => row.type === 'COLLECTION'), (row) => row.party?.name ?? 'Sin tercero vinculado', (row) => ({ currency: row.converted_amount != null ? 'ARS' : row.currency_code, amount: Number(row.converted_amount ?? row.amount) })),
        payments_by_party: groupDetails(effectivePayments.filter((row) => row.type !== 'COLLECTION'), (row) => row.party?.name ?? 'Sin tercero vinculado', (row) => ({ currency: row.converted_amount != null ? 'ARS' : row.currency_code, amount: Number(row.converted_amount ?? row.amount) })),
        customer_balances: accountRows.filter((row) => accounts.some((account) => account.party.name === row.label && account.party_type === 'CUSTOMER')),
        supplier_balances: accountRows.filter((row) => accounts.some((account) => account.party.name === row.label && account.party_type === 'SUPPLIER')),
        documents: [...documentGroups.values()].sort((a, b) => a.direction.localeCompare(b.direction) || a.category.localeCompare(b.category) || a.status - b.status),
        obligations: groupDetails(obligations, (row) => `${this.codeLabel(row.category)} · ${this.codeLabel(row.status)}`, (row) => ({ currency: row.currency_code, amount: Number(row.amount ?? row.estimated_amount) })),
        hr_vales: groupDetails(vales, (row) => `${row.party.name} · ${this.codeLabel(row.party_type)} · ${this.codeLabel(row.type)} · ${this.codeLabel(row.status)}`, (row) => ({ currency: row.converted_amount != null ? 'ARS' : row.currency_code, amount: Number(row.converted_amount ?? row.amount) })),
        employees: employeeRows,
        partners: partnerRows,
        bank_accounts: bankAccountRows,
        cash_boxes: cashBoxRows,
        payment_statuses: groupDetails(payments, (row) => `${this.codeLabel(row.type)} · ${this.codeLabel(row.status)}`, (row) => ({ currency: row.converted_amount != null ? 'ARS' : row.currency_code, amount: Number(row.converted_amount ?? row.amount) })),
        checks: groupDetails(checks, (row) => `${row.is_own ? 'Propio' : 'De tercero'} · ${this.codeLabel(row.status)} · ${row.bank_name}`, (row) => ({ currency: row.currency_code, amount: Number(row.available_amount ?? row.amount) })),
        treasury_movements: [
          ...groupDetails(bankMovements, (row) => `Banco · ${this.codeLabel(row.type)}`, (row) => ({ currency: row.currency_code, amount: Number(row.balance_after) - Number(row.balance_before) })),
          ...groupDetails(cashMovements, (row) => `Caja · ${this.codeLabel(row.type)}`, (row) => ({ currency: row.currency_code, amount: Number(row.balance_after) - Number(row.balance_before) })),
        ],
        transfers: groupDetails(transfers, (row) => `${this.codeLabel(row.transfer_type)} · ${this.codeLabel(row.status)}`, (row) => ({ currency: row.converted_amount != null ? 'ARS' : row.currency_code, amount: Number(row.converted_amount ?? row.amount) })),
        treasury_variation: treasuryVariation,
        stock_movements: [...stockMovementGroups.values()].sort((a, b) => Math.abs(b.quantity) - Math.abs(a.quantity)),
        inventory_orders: inventoryOrders,
        alerts,
      },
    };
  }

  private consolidateCompanies(companies: ConsolidatedCompany[]) {
    const totals = {
      sales: {} as CurrencyTotals,
      purchases: {} as CurrencyTotals,
      collections: {} as CurrencyTotals,
      payments: {} as CurrencyTotals,
      receivables: {} as CurrencyTotals,
      payables: {} as CurrencyTotals,
      banks: {} as CurrencyTotals,
      cash: {} as CurrencyTotals,
      pending_checks: {} as CurrencyTotals,
      counts: { sales: 0, purchases: 0, collections: 0, payments: 0, pending_checks: 0 },
    };
    for (const company of companies) {
      for (const key of ['sales', 'purchases', 'collections', 'payments', 'receivables', 'payables', 'banks', 'cash', 'pending_checks'] as const) {
        for (const [currency, amount] of Object.entries(company[key])) this.addCurrency(totals[key], currency, amount);
      }
      for (const key of Object.keys(totals.counts) as Array<keyof typeof totals.counts>) totals.counts[key] += company.counts[key];
    }
    return totals;
  }

  private addCurrency(target: CurrencyTotals, currency: string, amount: number) {
    target[currency || 'ARS'] = (target[currency || 'ARS'] ?? 0) + amount;
  }

  private codeLabel(value: string) {
    const labels: Record<string, string> = {
      CUSTOMER: 'Cliente', SUPPLIER: 'Proveedor', EMPLOYEE: 'Empleado', PARTNER: 'Socio', TAX_AUTHORITY: 'Ente impositivo', UTILITY: 'Servicio público', FINANCIAL: 'Entidad financiera', SERVICE_PROVIDER: 'Proveedor de servicios',
      COLLECTION: 'Cobro', PAYMENT: 'Pago', EXPENSE: 'Gasto', DRAFT: 'Borrador', CONFIRMED: 'Confirmado', PAID: 'Pagado', CANCELLED: 'Anulado', PENDING: 'Pendiente', COMPLETED: 'Completada', FAILED: 'Fallida', REVIEW: 'En revisión',
      TAX: 'Impuesto', BANK: 'Bancaria', SERVICE: 'Servicio', INVOICE: 'Factura', ORDER: 'Orden', REMITO: 'Remito', QUOTE: 'Presupuesto', CREDIT_NOTE: 'Nota de crédito', DEBIT_NOTE: 'Nota de débito', RECEIPT: 'Recibo',
      IN: 'Entrada', OUT: 'Salida', INTL_TRANSIT: 'Tránsito internacional', MANUAL: 'Manual', PRODUCTION_CONSUME: 'Consumo de producción', PRODUCTION_OUTPUT: 'Producción terminada', DOCUMENT: 'Documento', ADJUSTMENT: 'Ajuste', TRANSFER: 'Transferencia',
      OPENING_BALANCE: 'Saldo inicial', WITHDRAWAL: 'Retiro', DEPOSIT: 'Depósito', FEE: 'Comisión bancaria', RETENTION: 'Retención', CREDIT: 'Ingreso manual', DEBIT: 'Egreso manual', REVERSAL: 'Reversión',
      OWN: 'Propio', THIRD_PARTY: 'De tercero', SAVINGS: 'Caja de ahorro', CHECKING: 'Cuenta corriente', CURRENT: 'Cuenta corriente', FIXED: 'Caja fija', OPEN: 'Abierta', CLOSED: 'Cerrada',
      SUELDO: 'Sueldo', ADELANTO: 'Adelanto', EXTRAS: 'Extras', RETIRO: 'Retiro', REEMBOLSO: 'Reembolso', PRESTAMO: 'Préstamo', APORTE: 'Aporte',
      CASH_TO_CASH: 'Caja a caja', CASH_TO_BANK: 'Caja a banco', BANK_TO_CASH: 'Banco a caja', BANK_TO_BANK: 'Banco a banco',
    };
    const key = value.toUpperCase();
    return labels[key] ?? key.replaceAll('_', ' ').toLocaleLowerCase('es').replace(/^./, (letter) => letter.toLocaleUpperCase('es'));
  }

  private documentStatusLabel(category: string, status: number) {
    if (status === 5) return category === 'QUOTE' ? 'Convertido' : category === 'ORDER' ? 'Entregado' : 'Completado';
    if (status === 6) return category === 'QUOTE' ? 'Rechazado' : 'Anulado';
    return ({ 0: 'Borrador', 1: 'Pendiente', 2: 'Confirmado', 3: 'Anulado', 4: 'Parcialmente entregado', 7: 'Cerrado', 8: 'Cancelado' } as Record<number, string>)[status] ?? `Estado ${status}`;
  }

  private exportRows(report: { companies: ConsolidatedCompany[] }) {
    const labels: Record<keyof Omit<ConsolidatedCompany, 'company_id' | 'company_name' | 'subdomain' | 'role' | 'counts' | 'details'>, string> = {
      sales: 'Ventas facturadas',
      purchases: 'Compras facturadas',
      collections: 'Cobros',
      payments: 'Pagos',
      receivables: 'Cuentas por cobrar actuales',
      payables: 'Deuda con proveedores actual',
      banks: 'Saldo bancario actual',
      cash: 'Saldo de cajas actual',
      pending_checks: 'Cheques pendientes actuales',
    };
    return report.companies.flatMap((company) =>
      (Object.keys(labels) as Array<keyof typeof labels>).flatMap((key) => {
        const entries: Array<[string, number]> = Object.entries(company[key]);
        const currencyRows: Array<[string, number]> = entries.length ? entries : [['ARS', 0]];
        return currencyRows.map(([currency, amount]) => ({
          Empresa: company.company_name,
          Indicador: labels[key],
          Moneda: currency,
          Importe: Number(amount),
          Cantidad: key in company.counts ? company.counts[key as keyof typeof company.counts] : '',
        }));
      }),
    );
  }

  private detailExportRows(company: ConsolidatedCompany) {
    const rows: Array<Record<string, string | number>> = [];
    const add = (section: string, values: DetailAmountRow[]) => values.forEach((row) => rows.push({
      Seccion: section,
      Detalle: row.label,
      Moneda: row.currency_code === 'UN' ? 'Unidades' : row.currency_code,
      Importe: row.amount,
      Cantidad: row.count,
      Saldo: row.balance ?? '',
    }));
    add('Cobros por cliente', company.details.collections_by_party);
    add('Pagos por tercero', company.details.payments_by_party);
    add('Saldos de clientes', company.details.customer_balances);
    add('Saldos de proveedores', company.details.supplier_balances);
    add('Obligaciones', company.details.obligations);
    add('Vales de empleados y socios', company.details.hr_vales);
    add('Transferencias', company.details.transfers);
    add('Variación de bancos y cajas', company.details.treasury_variation);
    company.details.stock_movements.forEach((row) => rows.push({
      Seccion: 'Movimientos de stock', Producto: row.product, Origen: row.movement_type, Movimiento: row.direction,
      Cantidad: row.quantity, Registros: row.count, Detalle: row.product, Moneda: 'Unidades', Importe: row.quantity, Saldo: '',
    }));
    company.details.inventory_orders.forEach((row) => rows.push({
      Seccion: 'Órdenes de venta por artículo', Empresa: company.company_name, OV: row.order_number, Fecha: row.order_date,
      Cliente: row.customer, Articulo: row.product, Cantidad: row.quantity, Estado: row.status,
      Confirmacion: row.confirmation_at ? new Date(row.confirmation_at).toLocaleString('es-AR') : 'No confirmada', Usuario: row.user,
      Detalle: `OV ${row.order_number} · ${row.customer} · ${row.product}`, Moneda: 'Unidades', Importe: row.quantity, Saldo: '',
    }));
    add('Pagos y cobros por estado', company.details.payment_statuses);
    add('Cheques por estado', company.details.checks);
    add('Movimientos de tesorería por tipo', company.details.treasury_movements);
    company.details.narratives.forEach((text) => rows.push({ Seccion: 'Lectura ejecutiva', Detalle: text, Moneda: '', Importe: '', Cantidad: '', Saldo: '' }));
    company.details.party_summary.forEach((row) => rows.push({ Seccion: 'Partes interesadas', Detalle: `${this.codeLabel(row.role)} · ${row.active} activos de ${row.total} · ${row.with_balance} cuentas con saldo`, Moneda: row.currency_code, Importe: '', Cantidad: row.total, Saldo: row.balance }));
    [...company.details.employees, ...company.details.partners].forEach((row) => rows.push({ Seccion: row.kind === 'EMPLOYEE' ? 'Empleados' : 'Socios', Detalle: `${row.name} · ${row.active ? 'Activo' : 'Inactivo'} · ${row.detail}`, Moneda: row.currency_code, Importe: row.movements_amount, Cantidad: row.movements_count, Saldo: row.pending_amount }));
    company.details.bank_accounts.forEach((row) => rows.push({ Seccion: 'Cuentas bancarias', Detalle: `${row.name}${row.institution ? ` · ${row.institution}` : ''} · ${row.status} · apertura ${row.opening_amount}`, Moneda: row.currency_code, Importe: row.period_change, Cantidad: row.movement_count, Saldo: row.current_balance }));
    company.details.cash_boxes.forEach((row) => rows.push({ Seccion: 'Cajas', Detalle: `${row.name}${row.institution ? ` · ${row.institution}` : ''} · ${row.status} · apertura ${row.opening_amount}`, Moneda: row.currency_code, Importe: row.period_change, Cantidad: row.movement_count, Saldo: row.current_balance }));
    company.details.documents.forEach((row) => rows.push({ Seccion: 'Documentos', Detalle: `${row.direction === 'SALE' ? 'Venta' : 'Compra'} · ${this.codeLabel(row.category)} · ${this.documentStatusLabel(row.category, row.status)}`, Moneda: row.currency_code, Importe: row.amount, Cantidad: row.count, Saldo: '' }));
    company.details.alerts.forEach((alert) => rows.push({ Seccion: 'Alertas', Detalle: alert, Moneda: '', Importe: '', Cantidad: '', Saldo: '' }));
    return rows;
  }

  private rowsForView(company: ConsolidatedCompany, view: ConsolidatedReportView) {
    const rows = this.detailExportRows(company);
    if (view === 'consolidated') return rows;
    const sections: Record<Exclude<ConsolidatedReportView, 'consolidated'>, string[]> = {
      customers: ['Lectura ejecutiva', 'Cobros por cliente', 'Saldos de clientes', 'Documentos', 'Alertas'],
      suppliers: ['Lectura ejecutiva', 'Pagos por tercero', 'Saldos de proveedores', 'Obligaciones', 'Documentos', 'Alertas'],
      hr: ['Lectura ejecutiva', 'Vales de empleados y socios', 'Empleados', 'Socios', 'Alertas'],
      treasury: ['Lectura ejecutiva', 'Transferencias', 'Variación de bancos y cajas', 'Pagos y cobros por estado', 'Cheques por estado', 'Movimientos de tesorería por tipo', 'Cuentas bancarias', 'Cajas', 'Alertas'],
      documents: ['Lectura ejecutiva', 'Documentos', 'Pagos y cobros por estado', 'Alertas'],
      inventory: ['Lectura ejecutiva', 'Órdenes de venta por artículo', 'Movimientos de stock', 'Alertas'],
    };
    return rows.filter((row) => sections[view].includes(String(row.Seccion)) || (row.Seccion === 'Partes interesadas' && (view === 'customers' ? String(row.Detalle).startsWith('Cliente ·') : view === 'suppliers' && String(row.Detalle).startsWith('Proveedor ·'))));
  }

  private narrativesForView(company: ConsolidatedCompany, view: ConsolidatedReportView) {
    const indexes: Record<ConsolidatedReportView, number[]> = {
      consolidated: [0, 1, 2, 3, 4], customers: [0, 1, 4], suppliers: [0, 1, 4], hr: [3, 4], treasury: [2, 4], documents: [0, 4], inventory: [4],
    };
    return indexes[view].map((index) => company.details.narratives[index]).filter((value): value is string => Boolean(value));
  }

  private toExcel(report: { companies: ConsolidatedCompany[]; period: { from: string; to: string }; generated_at: string; view: ConsolidatedReportView }) {
    const workbook = XLSX.utils.book_new();
    const rows = this.exportRows(report);
    const summary = XLSX.utils.json_to_sheet(rows);
    summary['!cols'] = [{ wch: 28 }, { wch: 32 }, { wch: 12 }, { wch: 18 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, summary, 'Resumen');
    report.companies.forEach((company, index) => {
      const sheet = XLSX.utils.json_to_sheet(this.rowsForView(company, report.view));
      sheet['!cols'] = [{ wch: 30 }, { wch: 60 }, { wch: 12 }, { wch: 18 }, { wch: 12 }, { wch: 18 }];
      const suffix = ` ${index + 1}`;
      const safeName = `${company.company_name.replace(/[\\/?*:[\]]/g, '').slice(0, 31 - suffix.length) || 'Empresa'}${suffix}`;
      XLSX.utils.book_append_sheet(workbook, sheet, safeName);
    });

    const metadata = XLSX.utils.aoa_to_sheet([
      [`Reporte de empresas · ${report.view}`],
      ['Desde', report.period.from],
      ['Hasta', report.period.to],
      ['Generado', report.generated_at],
      ['Nota', 'Los saldos de cuentas corrientes, bancos, cajas y cheques corresponden al saldo actual al generar el reporte.'],
    ]);
    metadata['!cols'] = [{ wch: 18 }, { wch: 90 }];
    XLSX.utils.book_append_sheet(workbook, metadata, 'Información');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }

  private toCsv(report: { companies: ConsolidatedCompany[]; view: ConsolidatedReportView }) {
    const rows = report.companies.flatMap((company) => this.rowsForView(company, report.view).map((row) => ({ Empresa: company.company_name, ...row })));
    return XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(rows), { FS: ';' });
  }

  private async toPdf(report: { companies: ConsolidatedCompany[]; period: { from: string; to: string }; generated_at: string; currency_note: string; view: ConsolidatedReportView }) {
    const fontPath = join(process.cwd(), 'node_modules', 'pdfmake', 'build', 'fonts', 'Roboto');
    pdfMake.setFonts({
      Roboto: {
        normal: join(fontPath, 'Roboto-Regular.ttf'),
        bold: join(fontPath, 'Roboto-Medium.ttf'),
        italics: join(fontPath, 'Roboto-Italic.ttf'),
        bolditalics: join(fontPath, 'Roboto-MediumItalic.ttf'),
      },
    });
    pdfMake.setUrlAccessPolicy(() => false);
    const money = (amount: number, currency: string) => new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount);
    const rows = this.exportRows(report);
    const body: unknown[][] = [[
      { text: 'Empresa', style: 'tableHeader' },
      { text: 'Indicador', style: 'tableHeader' },
      { text: 'Moneda', style: 'tableHeader' },
      { text: 'Importe', style: 'tableHeader', alignment: 'right' },
      { text: 'Cant.', style: 'tableHeader', alignment: 'right' },
    ]];
    for (const row of rows) body.push([
      row.Empresa,
      row.Indicador,
      row.Moneda,
      { text: money(row.Importe, row.Moneda), alignment: 'right' },
      { text: String(row.Cantidad), alignment: 'right' },
    ]);
    const detailContent = report.companies.flatMap((company, companyIndex) => {
      const detailRows = this.rowsForView(company, report.view).filter((row) => !['Alertas', 'Lectura ejecutiva'].includes(String(row.Seccion)));
      const groupedSections = new Map<string, typeof detailRows>();
      for (const row of detailRows) {
        const section = String(row.Seccion);
        const sectionRows = groupedSections.get(section) ?? [];
        sectionRows.push(row);
        groupedSections.set(section, sectionRows);
      }
      const sectionContent = [...groupedSections.entries()].flatMap(([section, sectionRows]) => {
        if (section === 'Órdenes de venta por artículo') {
          const inventoryBody: unknown[][] = [[
            { text: 'OV', style: 'tableHeader' }, { text: 'Fecha OV', style: 'tableHeader' }, { text: 'Cliente', style: 'tableHeader' },
            { text: 'Artículo', style: 'tableHeader' }, { text: 'Cantidad', style: 'tableHeader', alignment: 'right' },
            { text: 'Estado', style: 'tableHeader' }, { text: 'Confirmación', style: 'tableHeader' }, { text: 'Usuario', style: 'tableHeader' },
          ]];
          sectionRows.forEach((row) => inventoryBody.push([
            String(row.OV), String(row.Fecha), String(row.Cliente), String(row.Articulo),
            { text: Number(row.Cantidad).toLocaleString('es-AR'), alignment: 'right' }, String(row.Estado), String(row.Confirmacion), String(row.Usuario),
          ]));
          return [
            { text: section, style: 'sectionTitle' },
            { table: { headerRows: 1, widths: [32, 52, 115, 185, 45, 72, 88, 90], body: inventoryBody }, layout: 'lightHorizontalLines', margin: [0, 0, 0, 12] },
          ];
        }
        if (section === 'Movimientos de stock') {
          const stockBody: unknown[][] = [[
            { text: 'Producto', style: 'tableHeader' }, { text: 'Origen', style: 'tableHeader' },
            { text: 'Movimiento', style: 'tableHeader' }, { text: 'Cantidad neta', style: 'tableHeader', alignment: 'right' },
            { text: 'Movimientos', style: 'tableHeader', alignment: 'right' },
          ]];
          sectionRows.forEach((row) => stockBody.push([
            String(row.Producto), String(row.Origen), String(row.Movimiento),
            { text: Number(row.Cantidad).toLocaleString('es-AR', { maximumFractionDigits: 3 }), alignment: 'right' },
            { text: String(row.Registros), alignment: 'right' },
          ]));
          return [
            { text: section, style: 'sectionTitle' },
            { text: 'La cantidad neta es positiva para entradas y negativa para salidas.', style: 'note' },
            { table: { headerRows: 1, widths: [230, 170, 110, 85, 70], body: stockBody }, layout: 'lightHorizontalLines', margin: [0, 0, 0, 12] },
          ];
        }
        const sectionBody: unknown[][] = [[
          { text: 'Detalle', style: 'tableHeader' }, { text: 'Moneda', style: 'tableHeader' },
          { text: 'Importe / variación', style: 'tableHeader', alignment: 'right' },
          { text: 'Registros', style: 'tableHeader', alignment: 'right' },
          { text: 'Saldo / pendiente', style: 'tableHeader', alignment: 'right' },
        ]];
        sectionRows.forEach((row) => sectionBody.push([
          String(row.Detalle), String(row.Moneda),
          { text: row.Importe === '' ? '' : row.Moneda === 'Unidades' ? Number(row.Importe).toLocaleString('es-AR') : money(Number(row.Importe), String(row.Moneda)), alignment: 'right' },
          { text: String(row.Cantidad), alignment: 'right' },
          { text: row.Saldo === '' ? '' : row.Moneda === 'Unidades' ? Number(row.Saldo).toLocaleString('es-AR') : money(Number(row.Saldo), String(row.Moneda)), alignment: 'right' },
        ]));
        return [
          { text: section, style: 'sectionTitle' },
          { table: { headerRows: 1, widths: [285, 50, 100, 50, 100], body: sectionBody }, layout: 'lightHorizontalLines', margin: [0, 0, 0, 12] },
        ];
      });
      const showAdministrativeContext = report.view !== 'inventory';
      return [
        { text: company.company_name, style: 'companyTitle', ...(showAdministrativeContext || companyIndex > 0 ? { pageBreak: 'before' } : {}) },
        ...(showAdministrativeContext ? [
          { text: 'Lectura ejecutiva', style: 'sectionTitle' },
          ...this.narrativesForView(company, report.view).map((text) => ({ text, margin: [0, 0, 0, 5], lineHeight: 1.2 })),
          ...(company.details.alerts.length ? [{ text: 'Prioridades de seguimiento', style: 'sectionTitle' }, { ul: company.details.alerts, color: '#9a3412', margin: [0, 0, 0, 12] }] : []),
        ] : []),
        ...sectionContent,
      ];
    });
    const reportTitles: Record<ConsolidatedReportView, string> = {
      consolidated: 'Reporte consolidado de empresas', customers: 'Reporte de clientes', suppliers: 'Reporte de proveedores',
      hr: 'Reporte de empleados y socios', treasury: 'Reporte de bancos, cajas y cheques', documents: 'Reporte de documentos', inventory: 'Reporte de inventario y logística',
    };
    const definition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [32, 42, 32, 42],
      defaultStyle: { font: 'Roboto', fontSize: 8 },
      content: report.view === 'inventory' ? detailContent : [
        { text: reportTitles[report.view], style: 'title' },
        { text: `Período: ${report.period.from} al ${report.period.to}`, style: 'subtitle' },
        { text: `Empresas: ${report.companies.map((company) => company.company_name).join(', ')}`, margin: [0, 0, 0, 14] },
        { text: 'Resumen ejecutivo', style: 'sectionTitle' },
        { table: { headerRows: 1, widths: [110, 150, 48, 90, 40], body }, layout: 'lightHorizontalLines' },
        { text: 'Criterios de lectura', style: 'sectionTitle' },
        { text: 'Los movimientos del período se calculan por fecha de operación. Los saldos de cuentas corrientes, bancos, cajas y cheques son los vigentes al momento de generar el reporte. Documentos, pagos y movimientos de tesorería pueden representar una misma operación y no deben sumarse entre sí. Las aperturas se informan separadas y no representan ingresos del período.', style: 'note' },
        { text: report.currency_note, style: 'note' },
        ...detailContent,
      ],
      footer: (currentPage: number, pageCount: number) => ({
        columns: [
          { text: `Generado ${new Date(report.generated_at).toLocaleString('es-AR')}`, margin: [32, 0, 0, 0] },
          { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', margin: [0, 0, 32, 0] },
        ],
        fontSize: 7,
        color: '#64748b',
      }),
      styles: {
        title: { fontSize: 18, bold: true, color: '#0f172a', margin: [0, 0, 0, 4] },
        subtitle: { fontSize: 10, color: '#475569', margin: [0, 0, 0, 4] },
        companyTitle: { fontSize: 16, bold: true, color: '#0f766e', margin: [0, 0, 0, 10] },
        sectionTitle: { fontSize: 11, bold: true, color: '#0f172a', margin: [0, 0, 0, 6] },
        tableHeader: { bold: true, color: '#ffffff', fillColor: '#0f766e', margin: [3, 4, 3, 4] },
        note: { fontSize: 7, color: '#64748b', margin: [0, 14, 0, 0] },
      },
    };
    return await pdfMake.createPdf(definition).getBuffer() as Buffer;
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
