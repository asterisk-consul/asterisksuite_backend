import { Body, Controller, Delete, Get, Header, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '@/auth/jwt/jwt-auth.guard';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import type { AuthUser } from '@/auth/types/auth-user.interface';
import { RequirePermissions } from '@/access-control/decorators/require-permissions.decorator';
import { AllowCompanyAdmins } from '@/access-control/decorators/allow-company-admins.decorator';
import { ManagementReportsService } from './management-reports.service';
import { QueryManagementReportDto } from './dto/query-management-report.dto';
import {
  ConsolidatedManagementReportDto,
  ExportConsolidatedManagementReportDto,
} from './dto/consolidated-management-report.dto';
import { SaveReportTemplateDto } from './dto/save-report-template.dto';
import {
  FinancialResultsDetailDto,
  FinancialResultsDocumentItemsDto,
  FinancialResultsSummaryDto,
} from './dto/financial-results-report.dto';
import { FinancialResultsReportService } from './financial-results-report.service';

@UseGuards(JwtAuthGuard)
@AllowCompanyAdmins()
@RequirePermissions('management_reports.read')
@Controller('erp/reports/management')
export class ManagementReportsController {
  constructor(
    private readonly service: ManagementReportsService,
    private readonly financialResults: FinancialResultsReportService,
  ) {}

  @Get()
  getReport(@Query() query: QueryManagementReportDto) {
    return this.service.getReport(query);
  }

  @Post('financial-results')
  getFinancialResults(@Body() dto: FinancialResultsSummaryDto, @CurrentUser() user: AuthUser) {
    return this.financialResults.getSummary(dto, user.id);
  }

  @Post('financial-results/detail')
  getFinancialResultsDetail(@Body() dto: FinancialResultsDetailDto, @CurrentUser() user: AuthUser) {
    return this.financialResults.getDetail(dto, user.id);
  }

  @Post('financial-results/document-items')
  getFinancialResultsDocumentItems(@Body() dto: FinancialResultsDocumentItemsDto, @CurrentUser() user: AuthUser) {
    return this.financialResults.getDocumentItems(dto, user.id);
  }

  @Get('metadata')
  getMetadata() {
    return this.service.getMetadata();
  }

  @Get('templates')
  getReportTemplates(@CurrentUser() user: AuthUser) {
    return this.service.getReportTemplates(user.id);
  }

  @Post('templates')
  saveReportTemplate(@Body() dto: SaveReportTemplateDto, @CurrentUser() user: AuthUser) {
    return this.service.saveReportTemplate(user.id, dto);
  }

  @Delete('templates/:templateId')
  deleteReportTemplate(@Param('templateId') templateId: string, @CurrentUser() user: AuthUser) {
    return this.service.deleteReportTemplate(user.id, templateId);
  }

  @Get('consolidated/companies')
  @Header('Cache-Control', 'private, max-age=60')
  getConsolidatedCompanies(@CurrentUser() user: AuthUser) {
    return this.service.getAvailableCompanies(user.id);
  }

  @Post('consolidated')
  getConsolidatedReport(@Body() dto: ConsolidatedManagementReportDto, @CurrentUser() user: AuthUser) {
    return this.service.getConsolidatedReport(dto, user.id);
  }

  @Post('consolidated/export')
  async exportConsolidatedReport(
    @Body() dto: ExportConsolidatedManagementReportDto,
    @CurrentUser() user: AuthUser,
    @Res() response: Response,
  ) {
    const file = await this.service.exportConsolidatedReport(dto, user.id);
    response.set({
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
      'Cache-Control': 'no-store',
    });
    response.send(file.buffer);
  }
}
