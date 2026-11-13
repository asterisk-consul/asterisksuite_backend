import { Body, Controller, Delete, ForbiddenException, Get, Header, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { PermissionContextBuilder } from '@/access-control/authorization/permission-context.builder';
import { RequireAnyPermission, RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { ManagementReportsService } from './management-reports.service';
import { QueryManagementReportDto } from './dto/query-management-report.dto';
import {
  ConsolidatedManagementReportDto,
  ExportConsolidatedManagementReportDto,
  ConsolidatedReportView,
} from './dto/consolidated-management-report.dto';
import { SaveReportTemplateDto } from './dto/save-report-template.dto';
import {
  FinancialResultsDetailDto,
  FinancialResultsDocumentItemsDto,
  FinancialResultsSummaryDto,
} from './dto/financial-results-report.dto';
import { FinancialResultsReportService } from './financial-results-report.service';
import { SalesProductsReportService } from './sales-products-report.service';
import { ExportSalesProductsReportDto, SalesProductsReportDetailDto, SalesProductsReportDto } from './dto/sales-products-report.dto';

@UseGuards(JwtAuthGuard)
@Controller('erp/reports/management')
export class ManagementReportsController {
  constructor(
    private readonly service: ManagementReportsService,
    private readonly financialResults: FinancialResultsReportService,
    private readonly salesProducts: SalesProductsReportService,
    private readonly permissionContexts: PermissionContextBuilder,
  ) {}

  @Get()
  @RequireAnyPermission('management_reports.read', 'management_reports.management.read')
  getReport(@Query() query: QueryManagementReportDto) {
    return this.service.getReport(query);
  }

  @Post('financial-results')
  @RequireAnyPermission('management_reports.read', 'management_reports.financial_results.read')
  getFinancialResults(@Body() dto: FinancialResultsSummaryDto, @CurrentUser() user: AuthUser) {
    return this.financialResults.getSummary(dto, user.id);
  }

  @Post('financial-results/detail')
  @RequireAnyPermission('management_reports.read', 'management_reports.financial_results.read')
  getFinancialResultsDetail(@Body() dto: FinancialResultsDetailDto, @CurrentUser() user: AuthUser) {
    return this.financialResults.getDetail(dto, user.id);
  }

  @Post('financial-results/document-items')
  @RequireAnyPermission('management_reports.read', 'management_reports.financial_results.read')
  getFinancialResultsDocumentItems(@Body() dto: FinancialResultsDocumentItemsDto, @CurrentUser() user: AuthUser) {
    return this.financialResults.getDocumentItems(dto, user.id);
  }

  @Post('sales-products')
  @RequireAnyPermission('management_reports.read', 'management_reports.sales_products.read')
  getSalesProducts(@Body() dto: SalesProductsReportDto, @CurrentUser() user: AuthUser) {
    return this.salesProducts.getSummary(dto, user.id);
  }

  @Post('sales-products/detail')
  @RequireAnyPermission('management_reports.read', 'management_reports.sales_products.read')
  getSalesProductsDetail(@Body() dto: SalesProductsReportDetailDto, @CurrentUser() user: AuthUser) {
    return this.salesProducts.getDetail(dto, user.id);
  }

  @Post('sales-products/export')
  @RequireAnyPermission('management_reports.read', 'management_reports.sales_products.read')
  async exportSalesProducts(
    @Body() dto: ExportSalesProductsReportDto,
    @CurrentUser() user: AuthUser,
    @Res() response: Response,
  ) {
    const file = await this.salesProducts.export(dto, user.id);
    response.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Cache-Control': 'no-store',
    });
    response.send(file.buffer);
  }

  @Get('metadata')
  @RequireAnyPermission('management_reports.read', 'management_reports.management.read')
  getMetadata() {
    return this.service.getMetadata();
  }

  @Get('templates')
  @RequireAnyPermission('management_reports.read', 'management_reports.builder.read')
  getReportTemplates(@CurrentUser() user: AuthUser) {
    return this.service.getReportTemplates(user.id);
  }

  @Post('templates')
  @RequireAnyPermission('management_reports.read', 'management_reports.builder.read')
  saveReportTemplate(@Body() dto: SaveReportTemplateDto, @CurrentUser() user: AuthUser) {
    return this.service.saveReportTemplate(user.id, dto);
  }

  @Delete('templates/:templateId')
  @RequireAnyPermission('management_reports.read', 'management_reports.builder.read')
  deleteReportTemplate(@Param('templateId') templateId: string, @CurrentUser() user: AuthUser) {
    return this.service.deleteReportTemplate(user.id, templateId);
  }

  @Get('consolidated/companies')
  @RequireAnyPermission(
    'management_reports.read',
    'management_reports.management.read',
    'management_reports.financial_results.read',
    'management_reports.sales_products.read',
    'management_reports.consolidated.read',
    'management_reports.customers.read',
    'management_reports.suppliers.read',
    'management_reports.hr.read',
    'management_reports.treasury.read',
    'management_reports.documents.read',
    'management_reports.inventory.read',
  )
  @Header('Cache-Control', 'private, max-age=60')
  getConsolidatedCompanies(@CurrentUser() user: AuthUser) {
    return this.service.getAvailableCompanies(user.id);
  }

  @Post('consolidated')
  @RequireAnyPermission(
    'management_reports.read',
    'management_reports.consolidated.read',
    'management_reports.customers.read',
    'management_reports.suppliers.read',
    'management_reports.hr.read',
    'management_reports.treasury.read',
    'management_reports.documents.read',
    'management_reports.inventory.read',
  )
  async getConsolidatedReport(
    @Body() dto: ConsolidatedManagementReportDto,
    @CurrentUser() user: AuthUser,
    @Req() request: { companyUserRole?: string },
  ) {
    await this.assertReportViewAccess(user.id, dto.view ?? 'consolidated', request.companyUserRole);
    return this.service.getConsolidatedReport(dto, user.id);
  }

  @Post('consolidated/export')
  @RequireAnyPermission(
    'management_reports.read',
    'management_reports.consolidated.read',
    'management_reports.customers.read',
    'management_reports.suppliers.read',
    'management_reports.hr.read',
    'management_reports.treasury.read',
    'management_reports.documents.read',
    'management_reports.inventory.read',
  )
  async exportConsolidatedReport(
    @Body() dto: ExportConsolidatedManagementReportDto,
    @CurrentUser() user: AuthUser,
    @Req() request: { companyUserRole?: string },
    @Res() response: Response,
  ) {
    await this.assertReportViewAccess(user.id, dto.view ?? 'consolidated', request.companyUserRole);
    const file = await this.service.exportConsolidatedReport(dto, user.id);
    response.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Cache-Control': 'no-store',
    });
    response.send(file.buffer);
  }

  private async assertReportViewAccess(userId: string, view: ConsolidatedReportView, companyRole?: string) {
    if (companyRole === 'OWNER') return;
    const permissionByView: Record<ConsolidatedReportView, string> = {
      consolidated: 'management_reports.consolidated.read',
      customers: 'management_reports.customers.read',
      suppliers: 'management_reports.suppliers.read',
      hr: 'management_reports.hr.read',
      treasury: 'management_reports.treasury.read',
      documents: 'management_reports.documents.read',
      inventory: 'management_reports.inventory.read',
    };
    const context = await this.permissionContexts.build(userId);
    if (!context.can('management_reports.read') && !context.can(permissionByView[view])) {
      throw new ForbiddenException('No tenés permiso para consultar este reporte');
    }
  }
}
